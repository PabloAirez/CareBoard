import { Injectable, NotFoundException } from '@nestjs/common';
import { InternacaoRepository } from '../../domain/repositories/internacao.repository';

@Injectable()
export class DeleteInternacaoUseCase {
  constructor(private readonly repository: InternacaoRepository) {}

  async execute(id: number): Promise<void> {
    const internacao = await this.repository.findById(id);

    if (!internacao) {
      throw new NotFoundException('Admission not found');
    }

    await this.repository.delete(id);
  }
}
