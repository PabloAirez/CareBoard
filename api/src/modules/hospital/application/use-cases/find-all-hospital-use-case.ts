import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';

@Injectable()
export class FindAllHospitalsUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  execute() {
    return this.repository.findAll();
  }
}
