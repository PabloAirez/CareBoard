import type { Bed, Call } from '../types/Dashboard';
import type { Vitals } from '../types/Clinical';

const randomVitals = (): Vitals => ({
  paSistolica: 90 + Math.random() * 60,
  paDiastolica: 60 + Math.random() * 30,
  fc: 60 + Math.random() * 80,
  fr: 12 + Math.random() * 20,
  temp: 36 + Math.random() * 2,
  consciencia: 'Alerta'
});

const patientNames = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
  'Luana Pereira', 'Roberto Lima', 'Fernanda Alves', 'Marcos Rodrigues', 'Juliana Gomes',
  'Lucas Carvalho', 'Beatriz Martins', 'Gabriel Souza', 'Camila Ribeiro', 'Rafael Dias',
  'Amanda Castro', 'Thiago Barbosa', 'Larissa Melo', 'Bruno Fernandes', 'Isabela Rocha',
  'Felipe Cardoso', 'Carolina Pinto', 'Diego Moreira', 'Letícia Nunes', 'Vinícius Correia',
  'Sofia Monteiro', 'Gustavo Vieira', 'Manuela Santos', 'Leonardo Ramos', 'Alice Lima',
  'Matheus Costa', 'Laura Ferreira', 'Enzo Oliveira', 'Valentina Pereira', 'Davi Silva',
  'Helena Rodrigues', 'Arthur Gomes', 'Luiza Carvalho', 'Bernardo Martins', 'Sophia Souza'
];

export const generateBeds = (): Bed[] =>
  Array.from({ length: 40 }).map((_, i) => ({
    id: i + 1,
    status: Math.random() > 0.15 ? 'Ocupado' : Math.random() > 0.5 ? 'Livre' : 'Aguardando Limpeza',
    patientName: Math.random() > 0.2 ? patientNames[i % patientNames.length] : undefined,
    vitals: Math.random() > 0.2 ? randomVitals() : undefined,
    admissionDate: new Date(Date.now() - Math.random() * 7 * 86400000) // Até 7 dias atrás
  }));

export const generateCalls = (beds: Bed[]): Call[] => {
  return beds
    .filter(() => Math.random() > 0.8)
    .map((b) => ({
      id: crypto.randomUUID(),
      bedId: b.id,
      type: Math.random() > 0.7 ? 'Assistência' : Math.random() > 0.5 ? 'Medicação' : 'Alimentação',
      priority: Math.random() > 0.8 ? 'Emergência' : 'Normal',
      time: new Date(Date.now() - Math.random() * 3600000) // Última hora
    }));
};