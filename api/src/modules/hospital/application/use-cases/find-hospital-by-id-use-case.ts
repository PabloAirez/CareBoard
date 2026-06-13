import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';

@Injectable()
export class FindHospitalByIdUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  execute(id: number) {
    return this.repository.findById(id);
  }
}
