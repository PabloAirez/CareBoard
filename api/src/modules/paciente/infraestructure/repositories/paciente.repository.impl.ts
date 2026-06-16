import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { PacienteOrmEntity } from '../orm/paciente-orm-entity';

@Injectable()
export class PacienteRepositoryImpl implements PacienteRepository {
  constructor(
    @InjectRepository(PacienteOrmEntity)
    private readonly repository: Repository<PacienteOrmEntity>,
  ) {}

  async create(paciente: Paciente): Promise<Paciente> {
    const entity = this.repository.create({
      nome: paciente.nome,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo,
      temDoencaContagiosa: paciente.temDoencaContagiosa,
    });

    const saved = await this.repository.save(entity);

    return this.toDomain(saved);
  }

  async findAll(): Promise<Paciente[]> {
    const pacientes = await this.repository.find({
      order: { nome: 'ASC' },
    });

    return pacientes.map((paciente) => this.toDomain(paciente));
  }

  async findById(id: number): Promise<Paciente | null> {
    const paciente = await this.repository.findOne({
      where: { id },
    });

    if (!paciente) {
      return null;
    }

    return this.toDomain(paciente);
  }

  async update(paciente: Paciente): Promise<Paciente> {
    if (paciente.id === null) {
      throw new Error('Paciente id is required to update');
    }

    await this.repository.update(paciente.id, {
      nome: paciente.nome,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo,
      temDoencaContagiosa: paciente.temDoencaContagiosa,
    });

    return paciente;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(paciente: PacienteOrmEntity): Paciente {
    return new Paciente(
      paciente.id,
      paciente.nome,
      paciente.dataNascimento ?? null,
      paciente.sexo ?? null,
      paciente.temDoencaContagiosa,
    );
  }
}
