import { Injectable, NotFoundException } from '@nestjs/common';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';

@Injectable()
export class DeletePacienteUseCase {
  constructor(private readonly repository: PacienteRepository) {}

  async execute(id: number): Promise<void> {
    const paciente = await this.repository.findById(id);

    if (!paciente) {
      throw new NotFoundException('Patient not found');
    }

    await this.repository.delete(id);
  }
}
