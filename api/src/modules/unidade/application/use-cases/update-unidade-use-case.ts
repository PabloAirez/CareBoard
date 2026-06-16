import { Injectable, NotFoundException } from '@nestjs/common';
import { Unidade } from '../../domain/entities/unidade.entity';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';
import { UpdateUnidadeDto } from '../../presentation/dto/update-unidade.dto';

@Injectable()
export class UpdateUnidadeUseCase {
  constructor(private readonly repository: UnidadeRepository) {}

  async execute(id: number, dto: UpdateUnidadeDto): Promise<Unidade> {
    const unidade = await this.repository.findById(id);

    if (!unidade) {
      throw new NotFoundException('Unit not found');
    }

    if (dto.name !== undefined) {
      unidade.nome = dto.name;
    }

    if (dto.hospitalId !== undefined) {
      unidade.hospitalId = dto.hospitalId;
    }

    return this.repository.update(unidade);
  }
}
