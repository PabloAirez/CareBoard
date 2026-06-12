import type { Vitals, RiskLevel } from '../types/Clinical';

export const calculateMEWS = (v: Vitals): number => {
  let score = 0;

  if (v.fc < 40) score += 2;
  else if (v.fc <= 50) score += 1;
  else if (v.fc <= 100) score += 0;
  else if (v.fc <= 110) score += 1;
  else if (v.fc <= 129) score += 2;
  else score += 3;

  if (v.paSistolica < 70) score += 3;
  else if (v.paSistolica <= 80) score += 2;
  else if (v.paSistolica <= 100) score += 1;

  if (v.fr < 9) score += 2;
  else if (v.fr <= 20) score += 1;
  else if (v.fr <= 29) score += 2;
  else score += 3;

  if (v.temp > 38.4 || v.temp < 35) score += 2;

  if (v.consciencia === 'Voz') score += 1;
  if (v.consciencia === 'Dor') score += 2;
  if (v.consciencia === 'Inconsciente') score += 3;

  return score;
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 5) return 'Alto';
  if (score >= 3) return 'Moderado';
  return 'Baixo';
};