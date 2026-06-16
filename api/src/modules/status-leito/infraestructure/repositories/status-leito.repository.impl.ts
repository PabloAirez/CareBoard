import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusLeito } from '../../domain/entities/status-leito.entity';
import { StatusLeitoRepository } from '../../domain/repositories/status-leito.repository';
import { StatusLeitoOrmEntity } from '../orm/status-leito-orm-entity';

@Injectable()
export class StatusLeitoRepositoryImpl implements StatusLeitoRepository {
  constructor(
    @InjectRepository(StatusLeitoOrmEntity)
    private readonly repository: Repository<StatusLeitoOrmEntity>,
  ) {}

  async create(statusLeito: StatusLeito): Promise<StatusLeito> {
    const entity = this.repository.create({
      descricao: statusLeito.descricao,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async findAll(): Promise<StatusLeito[]> {
    const statuses = await this.repository.find({
      order: { id: 'ASC' },
    });

    return statuses.map((status) => this.toDomain(status));
  }

  async findById(id: number): Promise<StatusLeito | null> {
    const status = await this.repository.findOne({
      where: { id },
    });

    if (!status) {
      return null;
    }

    return this.toDomain(status);
  }

  async findByDescricao(descricao: string): Promise<StatusLeito | null> {
    const status = await this.repository.findOne({
      where: { descricao },
    });

    if (!status) {
      return null;
    }

    return this.toDomain(status);
  }

  async update(statusLeito: StatusLeito): Promise<StatusLeito> {
    if (statusLeito.id === null) {
      throw new Error('StatusLeito id is required to update');
    }

    await this.repository.update(statusLeito.id, {
      descricao: statusLeito.descricao,
    });

    return statusLeito;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(statusLeito: StatusLeitoOrmEntity): StatusLeito {
    return new StatusLeito(statusLeito.id, statusLeito.descricao);
  }
}
