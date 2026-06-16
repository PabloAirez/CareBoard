import { Injectable } from '@nestjs/common';
import { StatusLeito } from '../../domain/entities/status-leito.entity';
import { StatusLeitoRepository } from '../../domain/repositories/status-leito.repository';

@Injectable()
export class FindAllStatusLeitoUseCase {
  constructor(private readonly repository: StatusLeitoRepository) {}

  execute(): Promise<StatusLeito[]> {
    return this.repository.findAll();
  }
}
