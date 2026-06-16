import { Leito } from '../entities/leito.entity';

export abstract class LeitoRepository {
  abstract create(leito: Leito): Promise<Leito>;

  abstract findAll(): Promise<Leito[]>;

  abstract findByUnidadeId(unidadeId: number): Promise<Leito[]>;

  abstract findById(id: number): Promise<Leito | null>;

  abstract update(leito: Leito): Promise<Leito>;

  abstract delete(id: number): Promise<void>;
}
