import { ClipboardList, Clock3, PhoneCall, Pill, ShieldAlert, Utensils } from 'lucide-react';
import type { Call } from '../../types/Dashboard';

export function CallCard({ call }: { call: Call }) {
  const isEmergency = call.priority === 'Emergência';

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

    if (diffHours > 0) return `${diffHours}h`;
    return `${diffMins}min`;
  };

  const TypeIcon = getTypeIcon(call.type);
  const tone = isEmergency
    ? 'border-accent bg-accent-light/65 text-accent-dark'
    : 'border-primary bg-primary-light/65 text-primary-dark';

  return (
    <article className={`rounded-md border-l-4 ${tone} px-2.5 py-2 shadow-sm ring-1 ring-primary-light/80`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white">
            {isEmergency ? <ShieldAlert size={17} /> : <TypeIcon size={17} />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-primary-dark">
              L{call.bedId.toString().padStart(2, '0')} | {call.type}
            </p>
            <p className="flex items-center gap-1 text-[11px] font-bold text-primary-dark/60">
              <Clock3 size={12} />
              {getTimeAgo(call.time)}
            </p>
          </div>
        </div>
        <span className={`shrink-0 rounded px-1.5 py-1 text-[10px] font-black ${isEmergency ? 'bg-accent text-white' : 'bg-primary text-white'}`}>
          {call.source === 'patient' ? 'PAC' : isEmergency ? 'URG' : 'OK'}
        </span>
      </div>
    </article>
  );
}
