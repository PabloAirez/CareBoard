import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from '../../domain/repositories/hospital.repository';

@Injectable()
export class DeleteHospitalUseCase {
  constructor(private readonly repository: HospitalRepository) {}

  async execute(id: number) {
    const hospital = await this.repository.findById(id);

    if (!hospital) {
      throw new NotFoundException();
    }

    await this.repository.delete(id);
  }
}
