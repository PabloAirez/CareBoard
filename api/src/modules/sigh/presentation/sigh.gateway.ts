import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SighGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SighGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Cliente WebSocket conectado ao SIGH Gateway: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente WebSocket desconectado do SIGH Gateway: ${client.id}`);
  }

  notifySyncComplete(summary: { unidades: number; leitos: number; pacientes: number; internacoes: number; sinaisVitais: number }) {
    this.logger.log('Emitindo evento WebSocket de sincronizacao SIGH completa');
    if (this.server) {
      this.server.emit('sigh:sync-complete', summary);
      this.server.emit('unidades:atualizado', { timestamp: new Date() });
      this.server.emit('leitos:atualizado', { timestamp: new Date() });
      this.server.emit('internacoes:atualizado', { timestamp: new Date() });
      this.server.emit('sinais-vitais:atualizado', { timestamp: new Date() });
    }
  }
}
