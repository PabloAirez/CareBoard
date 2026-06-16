import { Injectable, NotFoundException } from '@nestjs/common';
import { Unidade } from '../../domain/entities/unidade.entity';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';

@Injectable()
export class FindUnidadeByIdUseCase {
  constructor(private readonly repository: UnidadeRepository) {}

  async execute(id: number): Promise<Unidade> {
    const unidade = await this.repository.findById(id);

    if (!unidade) {
      throw new NotFoundException('Unit not found');
    }

    return unidade;
  }
}
