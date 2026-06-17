import { CheckCircle2, Clock3 } from 'lucide-react';
import type { Call } from '../../types/Dashboard';

interface ActiveDemandListProps {
  demands: Call[];
  onComplete: (demandId: string) => void;
}

const getElapsedTime = (time: Date) => {
  const diffMinutes = Math.max(0, Math.floor((Date.now() - time.getTime()) / 60000));
  if (diffMinutes < 60) return `${diffMinutes}min`;

  return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}min`;
};

export function ActiveDemandList({ demands, onComplete }: ActiveDemandListProps) {
  if (demands.length === 0) {
    return (
      <section className="rounded-lg border border-secondary-light bg-white px-4 py-5 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-2 text-secondary" size={38} />
        <p className="text-base font-black text-secondary-dark">Nenhuma demanda ativa</p>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      {demands.map((demand) => (
        <article
          key={demand.id}
          className="flex items-center justify-between gap-3 rounded-lg border-l-4 border-primary bg-white p-3 shadow-sm ring-1 ring-primary-light"
        >
          <div className="min-w-0">
            <p className="truncate text-base font-black text-primary-dark">{demand.type}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-primary-dark/55">
              <Clock3 size={13} />
              {getElapsedTime(demand.time)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onComplete(demand.id)}
            className="shrink-0 rounded-md bg-secondary px-3 py-2 text-xs font-black text-white transition active:scale-[0.98]"
          >
            Atendida
          </button>
        </article>
      ))}
    </section>
  );
}
