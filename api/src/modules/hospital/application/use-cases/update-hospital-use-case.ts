import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';
import { UpdateHospitalDto } from '../../presentation/dto/update-hospital.dto';
import { Hospital } from '../../domain/entities/hospital.entity';

@Injectable()
export class UpdateHospitalUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  async execute(id: number, dto: UpdateHospitalDto): Promise<Hospital> {
    const hospital = await this.repository.findById(id);

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    Object.assign(hospital, dto);

    return this.repository.update(hospital);
  }
}
