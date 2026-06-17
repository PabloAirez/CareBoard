import { Injectable } from '@nestjs/common';
import { Internacao } from '../../domain/entities/internacao.entity';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';

@Injectable()
export class FindAllInternacoesUseCase {
  constructor(private readonly repository: InternacaoRepository) {}

  execute(): Promise<Internacao[]> {
    return this.repository.findAll();
  }
}
