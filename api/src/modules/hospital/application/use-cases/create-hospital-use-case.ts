import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';
import { Hospital } from '../../domain/entities/hospital.entity';
import { CreateHospitalDto } from '../../presentation/dto/create-hospital.dto';
@Injectable()
export class CreateHospitalUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  async execute(dto: CreateHospitalDto): Promise<Hospital> {
    const hospital = new Hospital(null, dto.nome, dto.cnpj, dto.endereco);

    return this.repository.create(hospital);
  }
}
