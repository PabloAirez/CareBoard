import { SinaisVitais } from '../entities/sinais-vitais.entity';

export abstract class SinaisVitaisRepository {
  abstract create(sinaisVitais: SinaisVitais): Promise<SinaisVitais>;

  abstract findAll(): Promise<SinaisVitais[]>;

  abstract findByPacienteId(pacienteId: number): Promise<SinaisVitais[]>;

  abstract findById(id: number): Promise<SinaisVitais | null>;

  abstract update(sinaisVitais: SinaisVitais): Promise<SinaisVitais>;

  abstract delete(id: number): Promise<void>;
}
