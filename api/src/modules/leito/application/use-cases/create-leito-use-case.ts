import { Injectable } from '@nestjs/common';
import { Leito } from '../../domain/entities/leito.entity';
import { LeitoRepository } from '../../domain/repositories/leito.repository';
import { CreateLeitoDto } from '../../presentation/dto/create-leito.dto';

@Injectable()
export class CreateLeitoUseCase {
  constructor(private readonly repository: LeitoRepository) {}

  async execute(dto: CreateLeitoDto): Promise<Leito> {
    const leito = new Leito(null, dto.number, dto.unitId, dto.bedStatusId);

    return this.repository.create(leito);
  }
}
