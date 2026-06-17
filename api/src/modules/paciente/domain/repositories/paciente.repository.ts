import { Paciente } from '../entities/paciente.entity';

export abstract class PacienteRepository {
  abstract create(paciente: Paciente): Promise<Paciente>;

  abstract findAll(): Promise<Paciente[]>;

  abstract findById(id: number): Promise<Paciente | null>;

  abstract update(paciente: Paciente): Promise<Paciente>;

  abstract delete(id: number): Promise<void>;
}
