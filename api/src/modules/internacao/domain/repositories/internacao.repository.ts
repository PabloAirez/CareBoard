import { Internacao } from '../entities/internacao.entity';

export abstract class InternacaoRepository {
  abstract create(internacao: Internacao): Promise<Internacao>;

  abstract findAll(): Promise<Internacao[]>;

  abstract findByPacienteId(pacienteId: number): Promise<Internacao[]>;

  abstract findByLeitoId(leitoId: number): Promise<Internacao[]>;

  abstract findById(id: number): Promise<Internacao | null>;

  abstract update(internacao: Internacao): Promise<Internacao>;

  abstract delete(id: number): Promise<void>;
}
