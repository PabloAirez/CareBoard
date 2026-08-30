import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PendingDemandService } from '../../application/services/pending-demand.service';

const DEMAND_POLL_INTERVAL_MS = 5000;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PendingDemandGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server!: Server;

  private knownPendingDemandIds = new Set<number>();
  private interval?: NodeJS.Timeout;

  constructor(private readonly pendingDemandService: PendingDemandService) {}

  afterInit() {
    this.interval = setInterval(() => {
      void this.broadcastPendingDemands();
    }, DEMAND_POLL_INTERVAL_MS);

    void this.broadcastPendingDemands();
  }

  async handleConnection(client: Socket) {
    const rawUnitId = client.handshake.query?.unitId || client.handshake.auth?.unitId;
    const unitId = rawUnitId ? Number(rawUnitId) : undefined;

    if (unitId) {
      void client.join(`unit_${unitId}`);
    }

    const pendingDemands = await this.pendingDemandService.findPending(unitId);
    client.emit('demand:pending:list', pendingDemands);
  }

  onApplicationShutdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async broadcastPendingDemands() {
    const allPendingDemands = await this.pendingDemandService.findPending();
    const currentIds = new Set(allPendingDemands.map((demand) => demand.id));
    const newDemands = allPendingDemands.filter(
      (demand) => !this.knownPendingDemandIds.has(demand.id),
    );

    this.knownPendingDemandIds = currentIds;

    // Group pending demands by unitId
    const unitMap = new Map<number, typeof allPendingDemands>();
    for (const demand of allPendingDemands) {
      if (demand.unitId) {
        const list = unitMap.get(demand.unitId) || [];
        list.push(demand);
        unitMap.set(demand.unitId, list);
      }
    }

    // Emit unit-filtered demand list to each unit room
    for (const [unitId, unitDemands] of unitMap.entries()) {
      this.server.to(`unit_${unitId}`).emit('demand:pending:list', unitDemands);
    }

    // Broadcast overall list for global/admin clients not scoped to a single unit
    this.server.emit('demand:pending:list', allPendingDemands);

    for (const demand of newDemands) {
      if (demand.unitId) {
        this.server.to(`unit_${demand.unitId}`).emit('demand:pending:new', demand);
      }
      this.server.emit('demand:pending:new', demand);
    }
  }
}
