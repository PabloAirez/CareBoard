import { Activity, Clock3, Repeat2, TrendingUp, Users } from 'lucide-react';
import type { ElementType } from 'react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import type { Bed as BedType } from '../../types/Dashboard';

interface HeaderProps {
  hospitalName?: string;
  unitName?: string;
  beds: BedType[];
}

interface StatCardProps {
  label: string;
  value: string | number;
  tone: 'primary' | 'secondary' | 'accent';
  icon: ElementType;
  progress?: number;
}

const toneStyles = {
  primary: {
    border: 'border-primary',
    bg: 'bg-primary-light',
    text: 'text-primary',
    value: 'text-primary-dark',
    bar: 'bg-primary',
  },
  secondary: {
    border: 'border-secondary',
    bg: 'bg-secondary-light',
    text: 'text-secondary',
    value: 'text-secondary-dark',
    bar: 'bg-secondary',
  },
  accent: {
    border: 'border-accent',
    bg: 'bg-accent-light',
    text: 'text-accent',
    value: 'text-accent-dark',
    bar: 'bg-accent',
  },
};

function StatCard({ label, value, tone, icon: Icon, progress }: StatCardProps) {
  const styles = toneStyles[tone];

  return (
    <div className={`rounded-md border-l-4 ${styles.border} bg-white px-3 py-2 shadow-sm ring-1 ring-primary-light/70`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-primary-dark/55">{label}</p>
          <p className={`mt-0.5 text-xl font-black ${styles.value}`}>{value}</p>
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${styles.bg} ${styles.text}`}>
          <Icon size={17} />
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-light">
          <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export default function Header({
  hospitalName = 'Nome aqui',
  unitName = 'Unidade',
  beds,
}: HeaderProps) {
  const stats = useDashboardStats(beds);

  return (
    <header className="rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-primary-light">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Activity size={21} />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-black text-primary-dark">Careboard</h1>
            <p className="mt-0.5 text-xs font-medium text-primary-dark/60">
              {hospitalName} | {unitName}
            </p>
          </div>
        </div>

        <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Ocupação"
            value={`${stats.occupancy}%`}
            tone="primary"
            icon={TrendingUp}
            progress={stats.occupancy}
          />
          <StatCard label="TMP" value={stats.averageStayDays} tone="secondary" icon={Clock3} />
          <StatCard label="Giro leitos" value={stats.bedTurnoverHours} tone="accent" icon={Repeat2} />
          <StatCard label="Pac./prof." value={stats.patientsPerProfessional} tone="accent" icon={Users} />
        </div>
      </div>
    </header>
  );
}
