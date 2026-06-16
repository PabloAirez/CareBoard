import { Injectable, NotFoundException } from '@nestjs/common';
import { Internacao } from '../../domain/entities/internacao.entity';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';

@Injectable()
export class FindInternacaoByIdUseCase {
  constructor(private readonly repository: InternacaoRepository) {}

  async execute(id: number): Promise<Internacao> {
    const internacao = await this.repository.findById(id);

    if (!internacao) {
      throw new NotFoundException('Admission not found');
    }

    return internacao;
  }
}
