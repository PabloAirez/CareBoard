import { Injectable } from '@nestjs/common';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';

@Injectable()
export class FindAllPacientesUseCase {
  constructor(private readonly repository: PacienteRepository) {}

  execute(): Promise<Paciente[]> {
    return this.repository.findAll();
  }
}
