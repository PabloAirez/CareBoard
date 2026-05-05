import type { Bed } from '../../types/Dashboard';
import { calculateMEWS, getRiskLevel } from '../../services/mews';

export function BedCard({ bed }: { bed: Bed }) {
  const mews = bed.vitals ? calculateMEWS(bed.vitals) : 0;
  const risk = getRiskLevel(mews);

  const getInitials = (name?: string) => {
    if (!name) return '---';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 3);
  };

  const getStayDuration = (admissionDate?: Date) => {
    if (!admissionDate) return '--';
    const now = new Date();
    const diffMs = now.getTime() - admissionDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    }
    return `${diffHours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ocupado':
        return { bg: 'bg-white', border: 'border-primary', text: 'text-primary' };
      case 'Livre':
        return { bg: 'bg-secondary-light/55', border: 'border-secondary', text: 'text-secondary-dark' };
      case 'Aguardando Limpeza':
      case 'Em Limpeza':
        return { bg: 'bg-primary-light/65', border: 'border-primary-dark', text: 'text-primary-dark' };
      case 'Bloqueado':
        return { bg: 'bg-accent-light/65', border: 'border-accent', text: 'text-accent-dark' };
      default:
        return { bg: 'bg-white', border: 'border-primary-light', text: 'text-primary-dark/65' };
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'baixo':
        return 'bg-secondary-light text-secondary-dark';
      case 'moderado':
        return 'bg-primary-light text-primary-dark';
      case 'alto':
        return 'bg-accent-light text-accent-dark';
      default:
        return 'bg-primary-light text-primary-dark';
    }
  };

  const statusColors = getStatusColor(bed.status);

  return (
    <article className={`${statusColors.bg} rounded-lg border-l-4 ${statusColors.border} shadow-sm ring-1 ring-primary-light/80 transition hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="border-b border-primary-light/80 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-black text-primary-dark">L{bed.id.toString().padStart(2, '0')}</span>
          <span className={`rounded-full px-2 py-1 text-xs font-black ${getRiskColor(risk)}`}>
            MEWS {mews}
          </span>
        </div>
        <div className="text-center">
          <div className="mb-1 text-lg font-black text-primary-dark">{getInitials(bed.patientName)}</div>
          <div className={`text-xs font-bold ${statusColors.text}`}>{bed.status}</div>
        </div>
      </div>

      {bed.vitals && (
        <div className="grid grid-cols-2 gap-2 p-3 text-center text-xs">
          <Vital label="PA" value={`${Math.round(bed.vitals.paSistolica)}/${Math.round(bed.vitals.paDiastolica)}`} />
          <Vital label="FC" value={Math.round(bed.vitals.fc)} />
          <Vital label="FR" value={Math.round(bed.vitals.fr)} />
          <Vital label="Temp" value={`${bed.vitals.temp.toFixed(1)}°`} />
        </div>
      )}

      <div className="border-t border-primary-light/80 bg-white/70 px-3 py-2 text-center">
        <div className="text-xs font-medium text-primary-dark/55">Permanência</div>
        <div className="text-sm font-black text-primary-dark">{getStayDuration(bed.admissionDate)}</div>
      </div>
    </article>
  );
}

function Vital({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-white/80 px-2 py-1 ring-1 ring-primary-light/70">
      <div className="font-black text-primary-dark">{value}</div>
      <div className="font-medium text-primary-dark/55">{label}</div>
    </div>
  );
}
