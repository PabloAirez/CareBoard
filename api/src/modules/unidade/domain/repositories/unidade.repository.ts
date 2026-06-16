import { Unidade } from '../entities/unidade.entity';

export abstract class UnidadeRepository {
  abstract create(unidade: Unidade): Promise<Unidade>;

  abstract findAll(): Promise<Unidade[]>;

  abstract findById(id: number): Promise<Unidade | null>;

  abstract update(unidade: Unidade): Promise<Unidade>;

  abstract delete(id: number): Promise<void>;
}
