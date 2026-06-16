import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { StatusLeito } from '../../domain/entities/status-leito.entity';
import { StatusLeitoRepository } from '../../domain/repositories/status-leito.repository';

const defaultBedStatuses = [
  'livre',
  'bloqueado',
  'aguardando desocupação',
  'aguardando higienização',
  'em higienização',
  'ocupado',
];

@Injectable()
export class StatusLeitoSeeder implements OnApplicationBootstrap {
  constructor(private readonly repository: StatusLeitoRepository) {}

  async onApplicationBootstrap() {
    for (const descricao of defaultBedStatuses) {
      const existing = await this.repository.findByDescricao(descricao);

      if (!existing) {
        await this.repository.create(new StatusLeito(null, descricao));
      }
    }
  }
}
