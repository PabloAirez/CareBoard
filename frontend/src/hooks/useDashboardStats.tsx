import { useMemo } from 'react';
import type { Bed } from '../types/Dashboard';
import { calculateMEWS } from '../services/mews';

export function useDashboardStats(beds: Bed[]) {
  return useMemo(() => {
    const occupied = beds.filter(b => b.status === 'Ocupado').length;

    return {
      occupancy: beds.length ? Math.round((occupied / beds.length) * 100) : 0,
      cleaning: beds.filter(b => b.status.includes('Limpeza')).length,
      blocked: beds.filter(b => b.status === 'Bloqueado').length,
      highMews: beds.filter(b => b.vitals && calculateMEWS(b.vitals) >= 5).length
    };
  }, [beds]);
}