import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Call } from '../types/Dashboard';
import { addPatientDemand, getPatientDemands, resolvePatientDemand } from '../services/patientDemands';

export function usePatientDemands(bedId?: number) {
  const [demands, setDemands] = useState<Call[]>(() => getPatientDemands());

  const refreshDemands = useCallback(() => {
    setDemands(getPatientDemands());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'careboard:patient-demands') {
        refreshDemands();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('careboard:patient-demands-updated', refreshDemands);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('careboard:patient-demands-updated', refreshDemands);
    };
  }, [refreshDemands]);

  const activeDemands = useMemo(() => {
    if (!bedId) return demands;
    return demands.filter((demand) => demand.bedId === bedId);
  }, [bedId, demands]);

  const createDemand = useCallback((type: string) => {
    if (!bedId) return;
    addPatientDemand(bedId, type);
    refreshDemands();
  }, [bedId, refreshDemands]);

  const resolveDemand = useCallback((demandId: string) => {
    resolvePatientDemand(demandId);
    refreshDemands();
  }, [refreshDemands]);

  return {
    demands: activeDemands,
    createDemand,
    resolveDemand,
  };
}
