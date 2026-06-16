import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidade } from '../../domain/entities/unidade.entity';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';
import { UnidadeOrmEntity } from '../orm/unidade-orm-entity';

@Injectable()
export class UnidadeRepositoryImpl implements UnidadeRepository {
  constructor(
    @InjectRepository(UnidadeOrmEntity)
    private readonly repository: Repository<UnidadeOrmEntity>,
  ) {}

  async create(unidade: Unidade): Promise<Unidade> {
    const entity = this.repository.create({
      nome: unidade.nome,
      hospitalId: unidade.hospitalId,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async findAll(): Promise<Unidade[]> {
    const unidades = await this.repository.find({
      order: { nome: 'ASC' },
    });

    return unidades.map((unidade) => this.toDomain(unidade));
  }

  async findById(id: number): Promise<Unidade | null> {
    const unidade = await this.repository.findOne({
      where: { id },
    });

    if (!unidade) {
      return null;
    }

    return this.toDomain(unidade);
  }

  async update(unidade: Unidade): Promise<Unidade> {
    if (unidade.id === null) {
      throw new Error('Unidade id is required to update');
    }

    await this.repository.update(unidade.id, {
      nome: unidade.nome,
      hospitalId: unidade.hospitalId,
    });

    return unidade;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(unidade: UnidadeOrmEntity): Unidade {
    return new Unidade(unidade.id, unidade.nome, unidade.hospitalId);
  }
}
