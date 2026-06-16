import { Injectable, NotFoundException } from '@nestjs/common';
import { Leito } from '../../domain/entities/leito.entity';
import { LeitoRepository } from '../../domain/repositories/leito.repository';

@Injectable()
export class FindLeitoByIdUseCase {
  constructor(private readonly repository: LeitoRepository) {}

  async execute(id: number): Promise<Leito> {
    const leito = await this.repository.findById(id);

    if (!leito) {
      throw new NotFoundException('Bed not found');
    }

    return leito;
  }
}
