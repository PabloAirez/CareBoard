import { Injectable } from '@nestjs/common';
import { Leito } from '../../domain/entities/leito.entity';
import { LeitoRepository } from '../../domain/repositories/leito.repository';

@Injectable()
export class FindAllLeitosUseCase {
  constructor(private readonly repository: LeitoRepository) {}

  execute(): Promise<Leito[]> {
    return this.repository.findAll();
  }
}
