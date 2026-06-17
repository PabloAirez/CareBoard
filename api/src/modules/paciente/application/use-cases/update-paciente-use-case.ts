import { Injectable, NotFoundException } from '@nestjs/common';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { UpdatePacienteDto } from '../../presentation/dto/update-paciente.dto';

@Injectable()
export class UpdatePacienteUseCase {
  constructor(private readonly repository: PacienteRepository) {}

  async execute(id: number, dto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.repository.findById(id);

    if (!paciente) {
      throw new NotFoundException('Patient not found');
    }

    if (dto.name !== undefined) {
      paciente.nome = dto.name;
    }

    if (dto.birthDate !== undefined) {
      paciente.dataNascimento = dto.birthDate ? new Date(dto.birthDate) : null;
    }

    if (dto.sex !== undefined) {
      paciente.sexo = dto.sex;
    }

    if (dto.hasContagiousDisease !== undefined) {
      paciente.temDoencaContagiosa = dto.hasContagiousDisease;
    }

    return this.repository.update(paciente);
  }
}
