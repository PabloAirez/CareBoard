import { Injectable } from '@nestjs/common';
import { Leito } from '../../domain/entities/leito.entity';
import { LeitoRepository } from '../../domain/repositories/leito.repository';

@Injectable()
export class FindLeitosByUnidadeIdUseCase {
  constructor(private readonly repository: LeitoRepository) {}

  execute(unidadeId: number): Promise<Leito[]> {
    return this.repository.findByUnidadeId(unidadeId);
  }
}
