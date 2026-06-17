import {
  Bath,
  Bed,
  Bell,
  Droplet,
  Pill,
  Syringe,
  ThermometerSun,
  Toilet,
  Utensils,
  LucideAirVent,
  LucideGlassWater
} from 'lucide-react';

export const patientNeeds = [
  { label: 'Enfermeira', icon: Bell, tone: 'accent' },
  { label: 'Soro acabou', icon: Droplet, tone: 'accent' },
  { label: 'Termômetro', icon: ThermometerSun, tone: 'primary' },
  { label: 'Medicamento', icon: Pill, tone: 'primary' },
  { label: 'Estou sentindo dor', icon: Syringe, tone: 'accent' },
  { label: 'Frio', icon: LucideAirVent, tone: 'primary' },
  { label: 'Calor', icon: ThermometerSun, tone: 'secondary' },
  { label: 'Banheiro', icon: Toilet, tone: 'secondary' },
  { label: 'Levantar', icon: Bed, tone: 'primary' },
  { label: 'Banho', icon: Bath, tone: 'secondary' },
  { label: 'Comer', icon: Utensils, tone: 'secondary' },
  { label: 'Água', icon: LucideGlassWater, tone: 'primary' },
] as const;