import { Injectable } from '@nestjs/common';
import { Internacao } from '../../domain/entities/internacao.entity';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';

@Injectable()
export class FindInternacoesByPacienteIdUseCase {
  constructor(private readonly repository: InternacaoRepository) {}

  execute(pacienteId: number): Promise<Internacao[]> {
    return this.repository.findByPacienteId(pacienteId);
  }
}
