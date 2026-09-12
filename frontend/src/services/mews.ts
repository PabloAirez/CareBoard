import type { Vitals, RiskLevel } from '../types/Clinical';

export interface MewsBreakdown {
  score: number;
  pasPoints: number;
  fcPoints: number;
  frPoints: number;
  tempPoints: number;
  conscienciaPoints: number;
  mostAltered: { name: string; points: number }[];
}

export const calculateMEWSBreakdown = (v: Vitals): MewsBreakdown => {
  let pasPoints = 0;
  let fcPoints = 0;
  let frPoints = 0;
  let tempPoints = 0;
  let conscienciaPoints = 0;

  // PAS
  if (v.paSistolica > 0) {
    if (v.paSistolica <= 70) pasPoints = 3;
    else if (v.paSistolica <= 80) pasPoints = 2;
    else if (v.paSistolica <= 100) pasPoints = 1;
    else if (v.paSistolica <= 199) pasPoints = 0;
    else pasPoints = 2; // >= 200
  }

  // FC
  if (v.fc > 0) {
    if (v.fc <= 40) fcPoints = 3;
    else if (v.fc <= 50) fcPoints = 1;
    else if (v.fc <= 100) fcPoints = 0;
    else if (v.fc <= 110) fcPoints = 1;
    else if (v.fc <= 129) fcPoints = 2;
    else fcPoints = 3; // >= 130
  }

  // FR
  if (v.fr > 0) {
    if (v.fr <= 8) frPoints = 2;
    else if (v.fr <= 14) frPoints = 1;
    else if (v.fr <= 20) frPoints = 0;
    else if (v.fr <= 29) frPoints = 1;
    else frPoints = 3; // >= 30
  }

  // Temp
  if (v.temp > 0) {
    if (v.temp <= 35.0) tempPoints = 2;
    else if (v.temp >= 38.5) tempPoints = 1;
    else tempPoints = 0; // 35.0 - 38.4
  }

  // Consciência
  if (v.consciencia) {
    const cons = v.consciencia.toLowerCase();
    if (cons.includes('voz')) conscienciaPoints = 1;
    else if (cons.includes('dor')) conscienciaPoints = 2;
    else if (cons.includes('inconsc')) conscienciaPoints = 3;
    else conscienciaPoints = 0;
  }

  const score = pasPoints + fcPoints + frPoints + tempPoints + conscienciaPoints;

  const altered: { name: string; points: number }[] = [];
  if (pasPoints > 0) altered.push({ name: 'PA', points: pasPoints });
  if (fcPoints > 0) altered.push({ name: 'FC', points: fcPoints });
  if (frPoints > 0) altered.push({ name: 'FR', points: frPoints });
  if (tempPoints > 0) altered.push({ name: 'Temp', points: tempPoints });
  if (conscienciaPoints > 0) altered.push({ name: 'Consciência', points: conscienciaPoints });

  altered.sort((a, b) => b.points - a.points);

  return {
    score,
    pasPoints,
    fcPoints,
    frPoints,
    tempPoints,
    conscienciaPoints,
    mostAltered: altered,
  };
};

export const calculateMEWS = (v: Vitals): number => {
  return calculateMEWSBreakdown(v).score;
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 5) return 'Alto';
  if (score >= 3) return 'Moderado';
  return 'Baixo';
};
