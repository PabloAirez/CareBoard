export interface PendingDemandDto {
  id: number;
  admissionId: number;
  bedId: number | null;
  bedNumber: string | null;
  unitId?: number | null;
  patientId: number | null;
  patientName: string | null;
  type: string;
  status: string;
  requestedAt: Date;
  priority: 'Normal' | 'Emergência';
}
