export type Consciousness = 'Alerta' | 'Voz' | 'Dor' | 'Inconsciente';

export interface Vitals {
  paSistolica: number;
  paDiastolica: number;
  fc: number;
  fr: number;
  temp: number;
  consciencia: Consciousness;
  dataHora?: string | Date | null;
}

export type RiskLevel = 'Baixo' | 'Moderado' | 'Alto';
