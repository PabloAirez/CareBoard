import type { Vitals } from './Clinical';

export type BedStatus =
  | 'Livre'
  | 'Ocupado'
  | 'Aguardando Limpeza'
  | 'Em Limpeza'
  | 'Bloqueado';

export type CareLevel =
  | 'Mínimo'
  | 'Intermediário'
  | 'Alta dependência'
  | 'Semi-intensivo'
  | 'Intensivo';

export interface Bed {
  id: number;
  number?: string;
  status: BedStatus;
  admissionId?: number | null;
  patientName?: string | null;
  vitals?: Vitals | null;
  admissionDate?: Date | string | null;
  careLevel?: CareLevel;
  turnoverStartedAt?: Date;
}

export type CallPriority = 'Normal' | 'Emergência';

export interface Call {
  id: string;
  bedId: number;
  bedNumber?: string | null;
  type: string;
  priority: CallPriority;
  time: Date;
}
