import { Injectable } from '@nestjs/common';
import { StatusLeito } from '../../domain/entities/status-leito.entity';
import { StatusLeitoRepository } from '../../domain/repositories/status-leito.repository';
import { CreateStatusLeitoDto } from '../../presentation/dto/create-status-leito.dto';

@Injectable()
export class CreateStatusLeitoUseCase {
  constructor(private readonly repository: StatusLeitoRepository) {}

  execute(dto: CreateStatusLeitoDto): Promise<StatusLeito> {
    return this.repository.create(new StatusLeito(null, dto.description));
  }
}
