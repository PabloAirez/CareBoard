import { useEffect, useState } from 'react';
import type { Bed, Call } from '../types/Dashboard';
import { generateBeds, generateCalls } from '../mocks/mockData';

const MOCK_REFRESH_INTERVAL_MS = 120000;

const createMockSnapshot = () => {
  const beds = generateBeds();
  const calls = generateCalls(beds);

  return { beds, calls };
};

export function useCareboardMock() {
  const [mockData, setMockData] = useState<{ beds: Bed[]; calls: Call[] }>(() => createMockSnapshot());

  useEffect(() => {
    const interval = setInterval(() => {
      setMockData(createMockSnapshot());
    }, MOCK_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return mockData;
}
