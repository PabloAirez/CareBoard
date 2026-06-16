import { StatusLeito } from '../entities/status-leito.entity';

export abstract class StatusLeitoRepository {
  abstract create(statusLeito: StatusLeito): Promise<StatusLeito>;

  abstract findAll(): Promise<StatusLeito[]>;

  abstract findById(id: number): Promise<StatusLeito | null>;

  abstract findByDescricao(descricao: string): Promise<StatusLeito | null>;

  abstract update(statusLeito: StatusLeito): Promise<StatusLeito>;

  abstract delete(id: number): Promise<void>;
}
