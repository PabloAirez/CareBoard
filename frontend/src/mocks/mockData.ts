import type { Bed, BedStatus, Call } from '../types/Dashboard';
import type { Vitals } from '../types/Clinical';

const randomVitals = (): Vitals => ({
  paSistolica: 90 + Math.random() * 60,
  paDiastolica: 60 + Math.random() * 30,
  fc: 60 + Math.random() * 80,
  fr: 12 + Math.random() * 20,
  temp: 36 + Math.random() * 2,
  consciencia: 'Alerta',
});

const patientNames = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
  'Luana Pereira', 'Roberto Lima', 'Fernanda Alves', 'Marcos Rodrigues', 'Juliana Gomes',
  'Lucas Carvalho', 'Beatriz Martins', 'Gabriel Souza', 'Camila Ribeiro', 'Rafael Dias',
  'Amanda Castro', 'Thiago Barbosa', 'Larissa Melo', 'Bruno Fernandes', 'Isabela Rocha',
  'Felipe Cardoso', 'Carolina Pinto', 'Diego Moreira', 'Letícia Nunes', 'Vinícius Correia',
  'Sofia Monteiro', 'Gustavo Vieira', 'Manuela Santos', 'Leonardo Ramos', 'Alice Lima',
  'Matheus Costa', 'Laura Ferreira', 'Enzo Oliveira', 'Valentina Pereira', 'Davi Silva',
  'Helena Rodrigues', 'Arthur Gomes', 'Luiza Carvalho', 'Bernardo Martins', 'Sophia Souza',
];

const randomBedStatus = (): BedStatus => {
  const roll = Math.random();

  if (roll < 0.72) return 'Ocupado';
  if (roll < 0.84) return 'Livre';
  if (roll < 0.93) return 'Aguardando Limpeza';
  if (roll < 0.98) return 'Em Limpeza';
  return 'Bloqueado';
};

export const generateBeds = (): Bed[] =>
  Array.from({ length: 40 }).map((_, i) => {
    const status = randomBedStatus();

    if (status !== 'Ocupado') {
      return {
        id: i + 1,
        status,
      };
    }

    return {
      id: i + 1,
      status,
      patientName: patientNames[i % patientNames.length],
      vitals: randomVitals(),
      admissionDate: new Date(Date.now() - Math.random() * 12 * 86400000),
    };
  });

export const generateCalls = (beds: Bed[]): Call[] => {
  return beds
    .filter((bed) => bed.status === 'Ocupado')
    .filter(() => Math.random() > 0.8)
    .map((bed) => ({
      id: crypto.randomUUID(),
      bedId: bed.id,
      type: Math.random() > 0.7 ? 'Assistência' : Math.random() > 0.5 ? 'Medicação' : 'Alimentação',
      priority: Math.random() > 0.8 ? 'Emergência' : 'Normal',
      time: new Date(Date.now() - Math.random() * 3600000),
    }));
};
