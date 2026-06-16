import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';
import { Hospital } from '../../domain/entities/hospital.entity';

@Injectable()
export class FindHospitalByIdUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  async execute(id: number): Promise<Hospital> {
    const hospital = await this.repository.findById(id);

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    return hospital;
  }
}
