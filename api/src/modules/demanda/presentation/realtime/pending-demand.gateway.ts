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
    const pendingDemands = await this.pendingDemandService.findPending();

    client.emit('demand:pending:list', pendingDemands);
  }

  onApplicationShutdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async broadcastPendingDemands() {
    const pendingDemands = await this.pendingDemandService.findPending();
    const currentIds = new Set(pendingDemands.map((demand) => demand.id));
    const newDemands = pendingDemands.filter(
      (demand) => !this.knownPendingDemandIds.has(demand.id),
    );

    this.knownPendingDemandIds = currentIds;
    this.server.emit('demand:pending:list', pendingDemands);

    for (const demand of newDemands) {
      this.server.emit('demand:pending:new', demand);
    }
  }
}
