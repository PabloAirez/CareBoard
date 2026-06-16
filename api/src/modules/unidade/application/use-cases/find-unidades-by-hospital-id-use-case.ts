import { Injectable } from '@nestjs/common';
import { Unidade } from '../../domain/entities/unidade.entity';
import { UnidadeRepository } from '../../domain/repositories/unidade.repository';

@Injectable()
export class FindUnidadesByHospitalIdUseCase {
  constructor(private readonly repository: UnidadeRepository) {}

  execute(hospitalId: number): Promise<Unidade[]> {
    return this.repository.findByHospitalId(hospitalId);
  }
}
