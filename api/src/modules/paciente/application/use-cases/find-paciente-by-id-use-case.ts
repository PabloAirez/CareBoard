import { Injectable, NotFoundException } from '@nestjs/common';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';

@Injectable()
export class FindPacienteByIdUseCase {
  constructor(private readonly repository: PacienteRepository) {}

  async execute(id: number): Promise<Paciente> {
    const paciente = await this.repository.findById(id);

    if (!paciente) {
      throw new NotFoundException('Patient not found');
    }

    return paciente;
  }
}
