import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';
import { Hospital } from '../../domain/entities/hospital.entity';

@Injectable()
export class FindAllHospitalsUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  execute(): Promise<Hospital[]> {
    return this.repository.findAll();
  }
}
