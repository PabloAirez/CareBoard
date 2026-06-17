import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusLeito } from '../../domain/entities/status-leito.entity';
import { StatusLeitoRepository } from '../../domain/repositories/status-leito.repository';

@Injectable()
export class FindStatusLeitoByIdUseCase {
  constructor(private readonly repository: StatusLeitoRepository) {}

  async execute(id: number): Promise<StatusLeito> {
    const statusLeito = await this.repository.findById(id);

    if (!statusLeito) {
      throw new NotFoundException('Bed status not found');
    }

    return statusLeito;
  }
}
