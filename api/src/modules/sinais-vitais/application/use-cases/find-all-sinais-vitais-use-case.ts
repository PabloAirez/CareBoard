import { Injectable } from '@nestjs/common';
import { SinaisVitais } from '../../domain/entities/sinais-vitais.entity';
import { SinaisVitaisRepository } from '../../domain/repositories/sinais-vitais.repository';

@Injectable()
export class FindAllSinaisVitaisUseCase {
  constructor(private readonly repository: SinaisVitaisRepository) {}

  execute(): Promise<SinaisVitais[]> {
    return this.repository.findAll();
  }
}
