import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusLeitoRepository } from '../../domain/repositories/status-leito.repository';

@Injectable()
export class DeleteStatusLeitoUseCase {
  constructor(private readonly repository: StatusLeitoRepository) {}

  async execute(id: number): Promise<void> {
    const statusLeito = await this.repository.findById(id);

    if (!statusLeito) {
      throw new NotFoundException('Bed status not found');
    }

    await this.repository.delete(id);
  }
}
