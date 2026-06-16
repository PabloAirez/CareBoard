import { Injectable, NotFoundException } from '@nestjs/common';
import { LeitoRepository } from '../../domain/repositories/leito.repository';

@Injectable()
export class DeleteLeitoUseCase {
  constructor(private readonly repository: LeitoRepository) {}

  async execute(id: number): Promise<void> {
    const leito = await this.repository.findById(id);

    if (!leito) {
      throw new NotFoundException('Bed not found');
    }

    await this.repository.delete(id);
  }
}
