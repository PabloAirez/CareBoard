import { useMemo } from 'react';
import type { Bed, CareLevel } from '../types/Dashboard';

const IST = 1.15;

const patientsPerProfessionalByCareLevel: Record<CareLevel, number> = {
  Mínimo: 6,
  Intermediário: 4,
  'Alta dependência': 2.4,
  'Semi-intensivo': 2.4,
  Intensivo: 1.3,
};

const formatNumber = (value: number, digits = 1) => {
  if (!Number.isFinite(value)) return '0';
  return value.toFixed(digits).replace('.', ',');
};

export function useDashboardStats(beds: Bed[]) {
  return useMemo(() => {
    const occupiedBeds = beds.filter(b => b.status === 'Ocupado');
    const turnoverBeds = beds.filter(b => b.status !== 'Ocupado' && b.status !== 'Bloqueado' && b.turnoverStartedAt);

    const stayDaysTotal = occupiedBeds.reduce((total, bed) => {
      if (!bed.admissionDate) return total;
      return total + Math.max(0, (Date.now() - bed.admissionDate.getTime()) / 86400000);
    }, 0);

    const turnoverHoursTotal = turnoverBeds.reduce((total, bed) => {
      if (!bed.turnoverStartedAt) return total;
      return total + Math.max(0, (Date.now() - bed.turnoverStartedAt.getTime()) / 3600000);
    }, 0);

    const requiredProfessionals = occupiedBeds.reduce((total, bed) => {
      const careLevel = bed.careLevel ?? 'Intermediário';
      const patientsPerProfessional = patientsPerProfessionalByCareLevel[careLevel];
      return total + (1 / patientsPerProfessional);
    }, 0) * IST;

    const patientsPerProfessional = requiredProfessionals
      ? occupiedBeds.length / requiredProfessionals
      : 0;

    return {
      occupancy: beds.length ? Math.round((occupiedBeds.length / beds.length) * 100) : 0,
      averageStayDays: `${formatNumber(occupiedBeds.length ? stayDaysTotal / occupiedBeds.length : 0)}d`,
      bedTurnoverHours: `${formatNumber(turnoverBeds.length ? turnoverHoursTotal / turnoverBeds.length : 0)}h`,
      patientsPerProfessional: `${formatNumber(patientsPerProfessional)} p/p`,
    };
  }, [beds]);
}
