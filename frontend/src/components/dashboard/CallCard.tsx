import { ClipboardList, Clock3, PhoneCall, Pill, ShieldAlert, Utensils } from 'lucide-react';
import type { Call } from '../../types/Dashboard';

export function CallCard({ call }: { call: Call }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergência':
        return {
          bg: 'bg-accent-light/65',
          border: 'border-accent',
          badge: 'bg-accent text-white',
          text: 'text-accent-dark',
        };
      case 'Normal':
        return {
          bg: 'bg-primary-light/65',
          border: 'border-primary',
          badge: 'bg-primary text-white',
          text: 'text-primary-dark',
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-primary-light',
          badge: 'bg-primary-light text-primary-dark',
          text: 'text-primary-dark',
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'assistência':
        return PhoneCall;
      case 'medicação':
        return Pill;
      case 'alimentação':
        return Utensils;
      default:
        return ClipboardList;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}min`;
    }
    return `${diffMins}min`;
  };

  const colors = getPriorityColor(call.priority);
  const TypeIcon = getTypeIcon(call.type);

  return (
    <article className={`${colors.bg} rounded-lg border-l-4 ${colors.border} p-4 shadow-sm ring-1 ring-primary-light/80 transition hover:shadow-md`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-md bg-white ${colors.text}`}>
            {call.priority === 'Emergência' ? <ShieldAlert size={20} /> : <TypeIcon size={20} />}
          </div>
          <div>
            <p className="font-black text-primary-dark">Leito {call.bedId.toString().padStart(2, '0')}</p>
            <p className="text-sm font-medium capitalize text-primary-dark/60">{call.type}</p>
          </div>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-black ${colors.badge}`}>
          {call.priority}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-1 font-medium text-primary-dark/60">
          <Clock3 size={14} />
          Há {getTimeAgo(call.time)}
        </span>
        <button className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary-dark">
          Atender
        </button>
      </div>
    </article>
  );
}
