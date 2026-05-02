import { useEffect, useState } from 'react';
import type { Bed, Call } from '../types/Dashboard';
import { generateBeds, generateCalls } from '../mocks/mockData';

export function useCareboardMock() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBeds = generateBeds();
      const newCalls = generateCalls(newBeds);

      setBeds(newBeds);
      setCalls(newCalls);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { beds, calls };
}