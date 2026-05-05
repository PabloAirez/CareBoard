import type { Bed } from '../../types/Dashboard';
import { calculateMEWS, getRiskLevel } from '../../services/mews';

export function BedCard({ bed }: { bed: Bed }) {
  const isOccupied = bed.status === 'Ocupado';
  const hasPatientData = isOccupied && Boolean(bed.patientName || bed.vitals || bed.admissionDate);
  const mews = hasPatientData && bed.vitals ? calculateMEWS(bed.vitals) : 0;
  const risk = getRiskLevel(mews);

  const getInitials = (name?: string) => {
    if (!name) return '---';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 3);
  };

  const getStayDays = (admissionDate?: Date) => {
    if (!admissionDate) return '--';
    const diffMs = Date.now() - admissionDate.getTime();
    return `${Math.max(0, Math.floor(diffMs / 86400000))}d`;
  };

  const getConsciousnessLabel = (consciousness: string) => {
    switch (consciousness) {
      case 'Alerta':
        return 'Alerta';
      case 'Voz':
        return 'Voz';
      case 'Dor':
        return 'Dor';
      case 'Inconsciente':
        return 'Inconsc';
      default:
        return consciousness;
    }
  };

  const getStatusMeta = (status: string) => {
    switch (status) {
      case 'Ocupado':
        return { label: 'OCUPADO', bg: 'bg-white', border: 'border-primary', text: 'text-primary' };
      case 'Livre':
        return { label: 'LIVRE', bg: 'bg-secondary-light/55', border: 'border-secondary', text: 'text-secondary-dark' };
      case 'Aguardando Limpeza':
        return { label: 'AG. LIMP', bg: 'bg-primary-light/65', border: 'border-primary-dark', text: 'text-primary-dark' };
      case 'Em Limpeza':
        return { label: 'LIMPEZA', bg: 'bg-primary-light/65', border: 'border-primary-dark', text: 'text-primary-dark' };
      case 'Bloqueado':
        return { label: 'BLOQ', bg: 'bg-accent-light/65', border: 'border-accent', text: 'text-accent-dark' };
      default:
        return { label: status, bg: 'bg-white', border: 'border-primary-light', text: 'text-primary-dark/65' };
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'baixo':
        return 'bg-secondary text-white';
      case 'moderado':
        return 'bg-primary text-white';
      case 'alto':
        return 'bg-accent text-white';
      default:
        return 'bg-primary-light text-primary-dark';
    }
  };

  const status = getStatusMeta(bed.status);

  return (
    <article
      title={isOccupied ? `${bed.status} | MEWS ${mews} (${risk})` : bed.status}
      className={`${status.bg} flex min-h-[118px] flex-col rounded-md border-l-4 ${status.border} px-2 py-1.5 shadow-sm ring-1 ring-primary-light/80`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-black leading-4 text-primary-dark">
          L{bed.id.toString().padStart(2, '0')}
        </span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-black leading-3 ${isOccupied ? getRiskColor(risk) : 'bg-white text-primary-dark/50 ring-1 ring-primary-light'}`}>
          {isOccupied ? `M${mews}` : '--'}
        </span>
      </div>

      <div className="min-h-8 text-center">
        <div className="truncate text-lg font-black leading-5 text-primary-dark">
          {isOccupied ? getInitials(bed.patientName) : status.label}
        </div>
        <div className={`text-[9px] font-black leading-3 ${status.text}`}>
          {isOccupied ? status.label : 'SEM PACIENTE'}
        </div>
      </div>

      {isOccupied && bed.vitals ? (
        <div className="grid grid-cols-3 gap-1 text-center text-[9px]">
          <Vital
            label="PA"
            value={`${Math.round(bed.vitals.paSistolica)}/${Math.round(bed.vitals.paDiastolica)}`}
            wide
          />
          <Vital label="FC" value={Math.round(bed.vitals.fc)} />
          <Vital label="FR" value={Math.round(bed.vitals.fr)} />
          <Vital label="T" value={bed.vitals.temp.toFixed(1)} />
          <Vital label="Cons." value={getConsciousnessLabel(bed.vitals.consciencia)} />
          <Vital label="PERM" value={getStayDays(bed.admissionDate)} />
        </div>
      ) : (
        <div className="mt-auto rounded bg-white/70 px-2 py-2 text-center text-[10px] font-black text-primary-dark/45 ring-1 ring-primary-light/70">
          {isOccupied ? 'Sem sinais vitais' : 'Leito sem paciente'}
        </div>
      )}
    </article>
  );
}

function Vital({ label, value, wide = false }: { label: string; value: string | number; wide?: boolean }) {
  return (
    <div className={`${wide ? 'col-span-2' : ''} min-w-0 rounded bg-white/85 px-1 py-0.5 ring-1 ring-primary-light/70`}>
      <div className="whitespace-nowrap font-black leading-3 text-primary-dark">{value}</div>
      <div className="font-bold leading-3 text-primary-dark/45">{label}</div>
    </div>
  );
}
