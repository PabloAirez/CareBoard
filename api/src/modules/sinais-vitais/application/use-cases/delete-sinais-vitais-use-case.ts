import { Injectable, NotFoundException } from '@nestjs/common';
import { SinaisVitaisRepository } from '../../domain/repositories/sinais-vitais.repository';

@Injectable()
export class DeleteSinaisVitaisUseCase {
  constructor(private readonly repository: SinaisVitaisRepository) {}

  async execute(id: number): Promise<void> {
    const sinaisVitais = await this.repository.findById(id);

    if (!sinaisVitais) {
      throw new NotFoundException('Vital signs not found');
    }

    await this.repository.delete(id);
  }
}
