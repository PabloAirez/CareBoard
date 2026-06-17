import { useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import type { Call, CallPriority } from '../types/Dashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface PendingDemand {
  id: number;
  admissionId: number;
  bedId: number | null;
  bedNumber: string | null;
  type: string;
  priority: CallPriority;
  requestedAt: string;
}

const toCall = (demand: PendingDemand): Call => ({
  id: String(demand.id),
  bedId: demand.bedId ?? 0,
  bedNumber: demand.bedNumber,
  type: demand.type,
  priority: demand.priority,
  time: new Date(demand.requestedAt),
});

export function usePatientDemands(admissionId?: number, bedId?: number) {
  const [demands, setDemands] = useState<PendingDemand[]>([]);

  useEffect(() => {
    const socket = io(API_URL);

    socket.on('demand:pending:list', (pendingDemands: PendingDemand[]) => {
      setDemands(pendingDemands);
    });

    socket.on('demand:pending:new', (pendingDemand: PendingDemand) => {
      setDemands((currentDemands) => {
        if (currentDemands.some((demand) => demand.id === pendingDemand.id)) {
          return currentDemands;
        }

        return [pendingDemand, ...currentDemands];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const activeDemands = useMemo(() => {
    return demands
      .filter((demand) => {
        if (admissionId) return demand.admissionId === admissionId;
        if (bedId) return demand.bedId === bedId;
        return false;
      })
      .map(toCall);
  }, [admissionId, bedId, demands]);

  const createDemand = useCallback(async (type: string) => {
    if (!admissionId) return false;

    const hasActiveDemand = activeDemands.some((demand) => demand.type === type);
    if (hasActiveDemand) return false;

    const response = await fetch(`${API_URL}/api/demands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ admissionId, type }),
    });

    return response.ok;
  }, [activeDemands, admissionId]);

  const completeDemand = useCallback(async (demandId: string) => {
    const response = await fetch(`${API_URL}/api/demands/${demandId}/complete`, {
      method: 'PATCH',
    });

    return response.ok;
  }, []);

  return {
    demands: activeDemands,
    createDemand,
    completeDemand,
  };
}
