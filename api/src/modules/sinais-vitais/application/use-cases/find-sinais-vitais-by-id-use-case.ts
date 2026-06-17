import { Injectable, NotFoundException } from '@nestjs/common';
import { SinaisVitais } from '../../domain/entities/sinais-vitais.entity';
import { SinaisVitaisRepository } from '../../domain/repositories/sinais-vitais.repository';

@Injectable()
export class FindSinaisVitaisByIdUseCase {
  constructor(private readonly repository: SinaisVitaisRepository) {}

  async execute(id: number): Promise<SinaisVitais> {
    const sinaisVitais = await this.repository.findById(id);

    if (!sinaisVitais) {
      throw new NotFoundException('Vital signs not found');
    }

    return sinaisVitais;
  }
}
