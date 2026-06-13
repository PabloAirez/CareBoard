import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';
import { UpdateHospitalDto } from '../../presentation/dto/update-hospital.dto';

@Injectable()
export class UpdateHospitalUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  async execute(id: number, dto: UpdateHospitalDto) {
    const hospital = await this.repository.findById(id);

    if (!hospital) {
      throw new NotFoundException();
    }

    Object.assign(hospital, dto);

    return this.repository.update(hospital);
  }
}
