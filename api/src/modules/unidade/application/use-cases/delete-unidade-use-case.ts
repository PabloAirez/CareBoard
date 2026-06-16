import { Injectable, NotFoundException } from '@nestjs/common';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';

@Injectable()
export class DeleteUnidadeUseCase {
  constructor(private readonly repository: UnidadeRepository) {}

  async execute(id: number): Promise<void> {
    const unidade = await this.repository.findById(id);

    if (!unidade) {
      throw new NotFoundException('Unit not found');
    }

    await this.repository.delete(id);
  }
}
