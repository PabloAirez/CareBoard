import { Injectable } from '@nestjs/common';
import { Internacao } from '../../domain/entities/internacao.entity';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';

@Injectable()
export class FindInternacoesByLeitoIdUseCase {
  constructor(private readonly repository: InternacaoRepository) {}

  execute(leitoId: number): Promise<Internacao[]> {
    return this.repository.findByLeitoId(leitoId);
  }
}
