import { Activity, Bed, Brush, ShieldAlert, TrendingUp } from 'lucide-react';
import type { ElementType } from 'react';
import { useCareboardMock } from '../../hooks/useCareboardMocks';
import { useDashboardStats } from '../../hooks/useDashboardStats';

interface HeaderProps {
  hospitalName?: string;
  unitName?: string;
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
    <div className={`rounded-lg border-l-4 ${styles.border} bg-white p-4 shadow-sm ring-1 ring-primary-light/70`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary-dark/55">{label}</p>
          <p className={`mt-1 text-2xl font-black ${styles.value}`}>{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${styles.bg} ${styles.text}`}>
          <Icon size={20} />
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-light">
          <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export default function Header({
  hospitalName = 'Nome aqui',
  unitName = 'Unidade',
}: HeaderProps) {
  const { beds } = useCareboardMock();
  const stats = useDashboardStats(beds);

  return (
    <header className="rounded-lg bg-white px-5 py-4 shadow-sm ring-1 ring-primary-light">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Activity size={24} />
          </div>

          <div className="leading-tight">
            <h1 className="text-2xl font-black text-primary-dark">Careboard</h1>
            <p className="mt-1 text-sm font-medium text-primary-dark/60">
              {hospitalName} | {unitName}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Ocupação"
            value={`${stats.occupancy}%`}
            tone="primary"
            icon={TrendingUp}
            progress={stats.occupancy}
          />
          <StatCard label="Limpeza" value={stats.cleaning} tone="secondary" icon={Brush} />
          <StatCard label="Bloqueados" value={stats.blocked} tone="accent" icon={Bed} />
          <StatCard label="Críticos" value={stats.highMews} tone="accent" icon={ShieldAlert} />
        </div>
      </div>
    </header>
  );
}
