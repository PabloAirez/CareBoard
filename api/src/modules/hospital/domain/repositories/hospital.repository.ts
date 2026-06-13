import { Hospital } from '../entities/hospital.entity';

export abstract class HospitalRepository {
  abstract create(hospital: Hospital): Promise<Hospital>;

  abstract findAll(): Promise<Hospital[]>;

  abstract findById(id: number): Promise<Hospital | null>;

  abstract update(hospital: Hospital): Promise<Hospital>;

  abstract delete(id: number): Promise<void>;
}
