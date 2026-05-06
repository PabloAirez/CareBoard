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
  status: BedStatus;
  patientName?: string;
  vitals?: Vitals;
  admissionDate?: Date;
  careLevel?: CareLevel;
  turnoverStartedAt?: Date;
}

export type CallPriority = 'Normal' | 'Emergência';

export interface Call {
  id: string;
  bedId: number;
  type: string;
  priority: CallPriority;
  time: Date;
  source?: 'mock' | 'patient';
}
