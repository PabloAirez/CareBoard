import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Internacao } from '../../domain/entities/internacao.entity';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';
import { InternacaoOrmEntity } from '../orm/internacao-orm-entity';

@Injectable()
export class InternacaoRepositoryImpl implements InternacaoRepository {
  constructor(
    @InjectRepository(InternacaoOrmEntity)
    private readonly repository: Repository<InternacaoOrmEntity>,
  ) {}

  async create(internacao: Internacao): Promise<Internacao> {
    const entity = this.repository.create({
      pacienteId: internacao.pacienteId,
      leitoId: internacao.leitoId,
      dataEntrada: internacao.dataEntrada,
      dataSaida: internacao.dataSaida,
      statusInternacaoId: internacao.statusInternacaoId,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async findAll(): Promise<Internacao[]> {
    const internacoes = await this.repository.find({
      order: { dataEntrada: 'DESC' },
    });

    return internacoes.map((internacao) => this.toDomain(internacao));
  }

  async findByPacienteId(pacienteId: number): Promise<Internacao[]> {
    const internacoes = await this.repository.find({
      where: { pacienteId },
      order: { dataEntrada: 'DESC' },
    });

    return internacoes.map((internacao) => this.toDomain(internacao));
  }

  async findByLeitoId(leitoId: number): Promise<Internacao[]> {
    const internacoes = await this.repository.find({
      where: { leitoId },
      order: { dataEntrada: 'DESC' },
    });

    return internacoes.map((internacao) => this.toDomain(internacao));
  }

  async findById(id: number): Promise<Internacao | null> {
    const internacao = await this.repository.findOne({
      where: { id },
    });

    if (!internacao) {
      return null;
    }

    return this.toDomain(internacao);
  }

  async update(internacao: Internacao): Promise<Internacao> {
    if (internacao.id === null) {
      throw new Error('Internacao id is required to update');
    }

    await this.repository.update(internacao.id, {
      pacienteId: internacao.pacienteId,
      leitoId: internacao.leitoId,
      dataEntrada: internacao.dataEntrada,
      dataSaida: internacao.dataSaida,
      statusInternacaoId: internacao.statusInternacaoId,
    });

    return internacao;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(internacao: InternacaoOrmEntity): Internacao {
    return new Internacao(
      internacao.id,
      internacao.pacienteId,
      internacao.leitoId,
      internacao.dataEntrada,
      internacao.dataSaida ?? null,
      internacao.statusInternacaoId,
    );
  }
}
