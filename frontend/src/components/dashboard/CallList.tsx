import { CheckCircle2, ClipboardList, PhoneCall, ShieldAlert } from 'lucide-react';
import type { Call } from '../../types/Dashboard';

export function CallList({ calls }: { calls: Call[] }) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'urgent':
      case 'emergência':
        return { bg: 'bg-accent-light/65', border: 'border-accent', badge: 'bg-accent text-white', icon: ShieldAlert };
      case 'normal':
        return { bg: 'bg-primary-light/65', border: 'border-primary', badge: 'bg-primary text-white', icon: PhoneCall };
      case 'routine':
        return { bg: 'bg-secondary-light/65', border: 'border-secondary', badge: 'bg-secondary text-white', icon: CheckCircle2 };
      default:
        return { bg: 'bg-white', border: 'border-primary-light', badge: 'bg-primary-light text-primary-dark', icon: ClipboardList };
    }
  };

  if (calls.length === 0) {
    return (
      <div className="rounded-lg border-l-4 border-secondary bg-white p-8 text-center shadow-sm ring-1 ring-secondary-light">
        <CheckCircle2 className="mx-auto mb-3 text-secondary" size={36} />
        <p className="text-lg font-bold text-secondary-dark">Nenhuma chamada ativa</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {calls.map(c => {
        const colors = getTypeColor(c.priority);
        const Icon = colors.icon;
        return (
          <div
            key={c.id}
            className={`${colors.bg} rounded-lg border-l-4 ${colors.border} p-4 shadow-sm ring-1 ring-primary-light/80 transition hover:shadow-md`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-primary">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-black text-primary-dark">Leito {c.bedId}</p>
                  <p className="text-sm font-medium text-primary-dark/60">{c.type}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${colors.badge}`}>
                {c.priority.toUpperCase()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
