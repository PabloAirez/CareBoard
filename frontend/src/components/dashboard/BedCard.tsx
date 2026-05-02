import type { Bed } from '../../types/Dashboard';
import { calculateMEWS, getRiskLevel } from '../../services/mews';

export function BedCard({ bed }: { bed: Bed }) {
  const mews = bed.vitals ? calculateMEWS(bed.vitals) : 0;
  const risk = getRiskLevel(mews);

  // Função para anonimizar nome (iniciais)
  const getInitials = (name?: string) => {
    if (!name) return '---';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 3);
  };

  // Função para calcular tempo de permanência
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
        return { bg: 'bg-white', border: 'border-l-4 border-primary', text: 'text-primary' };
      case 'Livre':
        return { bg: 'bg-green-50', border: 'border-l-4 border-secondary', text: 'text-secondary' };
      case 'Aguardando Limpeza':
        return { bg: 'bg-yellow-50', border: 'border-l-4 border-amber-500', text: 'text-amber-600' };
      case 'Em Limpeza':
        return { bg: 'bg-blue-50', border: 'border-l-4 border-blue-500', text: 'text-blue-600' };
      case 'Bloqueado':
        return { bg: 'bg-red-50', border: 'border-l-4 border-red-500', text: 'text-red-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-l-4 border-gray-300', text: 'text-gray-600' };
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'baixo':
        return { badge: 'bg-green-100 text-green-800', bg: 'bg-green-50' };
      case 'moderado':
        return { badge: 'bg-yellow-100 text-yellow-800', bg: 'bg-yellow-50' };
      case 'alto':
        return { badge: 'bg-red-100 text-red-800', bg: 'bg-red-50' };
      default:
        return { badge: 'bg-gray-100 text-gray-800', bg: 'bg-gray-50' };
    }
  };

  const statusColors = getStatusColor(bed.status);
  const riskColors = getRiskColor(risk);

  return (
    <div className={`${statusColors.bg} ${statusColors.border} rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-48`}>
      {/* Header */}
      <div className="bg-white p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900">L{bed.id.toString().padStart(2, '0')}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${riskColors.badge}`}>
            {mews}
          </span>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800 mb-1">{getInitials(bed.patientName)}</div>
          <div className={`text-xs font-medium ${statusColors.text}`}>{bed.status}</div>
        </div>
      </div>

      {/* Vitals */}
      {bed.vitals && (
        <div className="p-2 space-y-1 text-xs">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-center">
              <div className="font-semibold text-gray-700">{Math.round(bed.vitals.paSistolica)}/{Math.round(bed.vitals.paDiastolica)}</div>
              <div className="text-gray-500">PA</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">{Math.round(bed.vitals.fc)}</div>
              <div className="text-gray-500">FC</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="text-center">
              <div className="font-semibold text-gray-700">{Math.round(bed.vitals.fr)}</div>
              <div className="text-gray-500">FR</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">{bed.vitals.temp.toFixed(1)}°</div>
              <div className="text-gray-500">Temp</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 px-2 py-2 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500">Permanência</div>
          <div className="text-sm font-semibold text-gray-700">{getStayDuration(bed.admissionDate)}</div>
        </div>
      </div>
    </div>
  );
}