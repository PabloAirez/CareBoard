import { Injectable, NotFoundException } from '@nestjs/common';
import { Leito } from '../../domain/entities/leito.entity';
import { LeitoRepository } from '../../domain/repositories/leito.repository';
import { UpdateLeitoDto } from '../../presentation/dto/update-leito.dto';

@Injectable()
export class UpdateLeitoUseCase {
  constructor(private readonly repository: LeitoRepository) {}

  async execute(id: number, dto: UpdateLeitoDto): Promise<Leito> {
    const leito = await this.repository.findById(id);

    if (!leito) {
      throw new NotFoundException('Bed not found');
    }

    if (dto.number !== undefined) {
      leito.numero = dto.number;
    }

    if (dto.unitId !== undefined) {
      leito.unidadeId = dto.unitId;
    }

    if (dto.bedStatusId !== undefined) {
      leito.statusLeitoId = dto.bedStatusId;
    }

    return this.repository.update(leito);
  }
}
