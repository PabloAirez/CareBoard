import type { Call } from '../types/Dashboard';

const PATIENT_DEMANDS_STORAGE_KEY = 'careboard:patient-demands';

type StoredPatientDemand = Omit<Call, 'time'> & {
  time: string;
};

const readStoredDemands = (): StoredPatientDemand[] => {
  try {
    const raw = localStorage.getItem(PATIENT_DEMANDS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredDemands = (demands: StoredPatientDemand[]) => {
  localStorage.setItem(PATIENT_DEMANDS_STORAGE_KEY, JSON.stringify(demands));
  window.dispatchEvent(new Event('careboard:patient-demands-updated'));
};

export const getPatientDemands = (): Call[] => {
  return readStoredDemands().map((demand) => ({
    ...demand,
    time: new Date(demand.time),
  }));
};

export const addPatientDemand = (bedId: number, type: string) => {
  const demands = readStoredDemands();
  const newDemand: StoredPatientDemand = {
    id: crypto.randomUUID(),
    bedId,
    type,
    priority: type === 'Dor' || type === 'Enfermeira' ? 'Emergência' : 'Normal',
    time: new Date().toISOString(),
    source: 'patient',
  };

  writeStoredDemands([newDemand, ...demands]);

  return {
    ...newDemand,
    time: new Date(newDemand.time),
  };
};

export const resolvePatientDemand = (demandId: string) => {
  writeStoredDemands(readStoredDemands().filter((demand) => demand.id !== demandId));
};
