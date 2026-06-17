import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SinaisVitais } from '../../domain/entities/sinais-vitais.entity';
import { SinaisVitaisRepository } from '../../domain/repositories/sinais-vitais.repository';
import { SinaisVitaisOrmEntity } from '../orm/sinais-vitais-orm-entity';

@Injectable()
export class SinaisVitaisRepositoryImpl implements SinaisVitaisRepository {
  constructor(
    @InjectRepository(SinaisVitaisOrmEntity)
    private readonly repository: Repository<SinaisVitaisOrmEntity>,
  ) {}

  async create(sinaisVitais: SinaisVitais): Promise<SinaisVitais> {
    const entity = this.repository.create({
      pacienteId: sinaisVitais.pacienteId,
      dataHora: sinaisVitais.dataHora,
      oximetria: sinaisVitais.oximetria,
      usaSuporteOxigenio: sinaisVitais.usaSuporteOxigenio,
      temperatura: sinaisVitais.temperatura,
      frequenciaCardiaca: sinaisVitais.frequenciaCardiaca,
      frequenciaRespiratoria: sinaisVitais.frequenciaRespiratoria,
      pressaoSistolica: sinaisVitais.pressaoSistolica,
      pressaoDiastolica: sinaisVitais.pressaoDiastolica,
      nivelConsciencia: sinaisVitais.nivelConsciencia,
      mewsScore: sinaisVitais.mewsScore,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async findAll(): Promise<SinaisVitais[]> {
    const sinaisVitais = await this.repository.find({
      order: { dataHora: 'DESC' },
    });

    return sinaisVitais.map((item) => this.toDomain(item));
  }

  async findByPacienteId(pacienteId: number): Promise<SinaisVitais[]> {
    const sinaisVitais = await this.repository.find({
      where: { pacienteId },
      order: { dataHora: 'DESC' },
    });

    return sinaisVitais.map((item) => this.toDomain(item));
  }

  async findById(id: number): Promise<SinaisVitais | null> {
    const sinaisVitais = await this.repository.findOne({
      where: { id },
    });

    if (!sinaisVitais) {
      return null;
    }

    return this.toDomain(sinaisVitais);
  }

  async update(sinaisVitais: SinaisVitais): Promise<SinaisVitais> {
    if (sinaisVitais.id === null) {
      throw new Error('SinaisVitais id is required to update');
    }

    await this.repository.update(sinaisVitais.id, {
      pacienteId: sinaisVitais.pacienteId,
      dataHora: sinaisVitais.dataHora,
      oximetria: sinaisVitais.oximetria,
      usaSuporteOxigenio: sinaisVitais.usaSuporteOxigenio,
      temperatura: sinaisVitais.temperatura,
      frequenciaCardiaca: sinaisVitais.frequenciaCardiaca,
      frequenciaRespiratoria: sinaisVitais.frequenciaRespiratoria,
      pressaoSistolica: sinaisVitais.pressaoSistolica,
      pressaoDiastolica: sinaisVitais.pressaoDiastolica,
      nivelConsciencia: sinaisVitais.nivelConsciencia,
      mewsScore: sinaisVitais.mewsScore,
    });

    return sinaisVitais;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(sinaisVitais: SinaisVitaisOrmEntity): SinaisVitais {
    return new SinaisVitais(
      sinaisVitais.id,
      sinaisVitais.pacienteId,
      sinaisVitais.dataHora,
      sinaisVitais.oximetria ?? null,
      sinaisVitais.usaSuporteOxigenio ?? null,
      sinaisVitais.temperatura ?? null,
      sinaisVitais.frequenciaCardiaca ?? null,
      sinaisVitais.frequenciaRespiratoria ?? null,
      sinaisVitais.pressaoSistolica ?? null,
      sinaisVitais.pressaoDiastolica ?? null,
      sinaisVitais.nivelConsciencia ?? null,
      sinaisVitais.mewsScore ?? null,
    );
  }
}
