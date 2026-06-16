import { Injectable } from '@nestjs/common';
import { Unidade } from '../../domain/entities/unidade.entity';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';
import { CreateUnidadeDto } from '../../presentation/dto/create-unidade.dto';

@Injectable()
export class CreateUnidadeUseCase {
  constructor(private readonly repository: UnidadeRepository) {}

  async execute(dto: CreateUnidadeDto): Promise<Unidade> {
    const unidade = new Unidade(null, dto.name, dto.hospitalId);

    return this.repository.create(unidade);
  }
}
