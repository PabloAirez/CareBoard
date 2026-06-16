import { Injectable } from '@nestjs/common';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { CreatePacienteDto } from '../../presentation/dto/create-paciente.dto';

@Injectable()
export class CreatePacienteUseCase {
  constructor(private readonly repository: PacienteRepository) {}

  execute(dto: CreatePacienteDto): Promise<Paciente> {
    const paciente = new Paciente(
      null,
      dto.name,
      dto.birthDate ? new Date(dto.birthDate) : null,
      dto.sex ?? null,
      dto.hasContagiousDisease ?? false,
    );

    return this.repository.create(paciente);
  }
}
