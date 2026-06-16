import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusLeito } from '../../domain/entities/status-leito.entity';
import { StatusLeitoRepository } from '../../domain/repositories/status-leito.repository';
import { UpdateStatusLeitoDto } from '../../presentation/dto/update-status-leito.dto';

@Injectable()
export class UpdateStatusLeitoUseCase {
  constructor(private readonly repository: StatusLeitoRepository) {}

  async execute(id: number, dto: UpdateStatusLeitoDto): Promise<StatusLeito> {
    const statusLeito = await this.repository.findById(id);

    if (!statusLeito) {
      throw new NotFoundException('Bed status not found');
    }

    if (dto.description !== undefined) {
      statusLeito.descricao = dto.description;
    }

    return this.repository.update(statusLeito);
  }
}
