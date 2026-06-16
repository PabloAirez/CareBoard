import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leito } from '../../domain/entities/leito.entity';
import { LeitoRepository } from '../../domain/repositories/leito.repository';
import { LeitoOrmEntity } from '../orm/leito-orm-entity';

@Injectable()
export class LeitoRepositoryImpl implements LeitoRepository {
  constructor(
    @InjectRepository(LeitoOrmEntity)
    private readonly repository: Repository<LeitoOrmEntity>,
  ) {}

  async create(leito: Leito): Promise<Leito> {
    const entity = this.repository.create({
      numero: leito.numero,
      unidadeId: leito.unidadeId,
      statusLeitoId: leito.statusLeitoId,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async findAll(): Promise<Leito[]> {
    const leitos = await this.repository.find({
      order: { numero: 'ASC' },
    });

    return leitos.map((leito) => this.toDomain(leito));
  }

  async findByUnidadeId(unidadeId: number): Promise<Leito[]> {
    const leitos = await this.repository.find({
      where: { unidadeId },
      order: { numero: 'ASC' },
    });

    return leitos.map((leito) => this.toDomain(leito));
  }

  async findById(id: number): Promise<Leito | null> {
    const leito = await this.repository.findOne({
      where: { id },
    });

    if (!leito) {
      return null;
    }

    return this.toDomain(leito);
  }

  async update(leito: Leito): Promise<Leito> {
    if (leito.id === null) {
      throw new Error('Leito id is required to update');
    }

    await this.repository.update(leito.id, {
      numero: leito.numero,
      unidadeId: leito.unidadeId,
      statusLeitoId: leito.statusLeitoId,
    });

    return leito;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(leito: LeitoOrmEntity): Leito {
    return new Leito(
      leito.id,
      leito.numero,
      leito.unidadeId,
      leito.statusLeitoId,
    );
  }
}
