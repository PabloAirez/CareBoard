import { Injectable } from '@nestjs/common';
import { SinaisVitais } from '../../domain/entities/sinais-vitais.entity';
import { SinaisVitaisRepository } from '../../domain/repositories/sinais-vitais.repository';

@Injectable()
export class FindSinaisVitaisByPacienteIdUseCase {
  constructor(private readonly repository: SinaisVitaisRepository) {}

  execute(pacienteId: number): Promise<SinaisVitais[]> {
    return this.repository.findByPacienteId(pacienteId);
  }
}
