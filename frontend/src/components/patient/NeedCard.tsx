import type { ElementType } from 'react';

interface NeedCardProps {
  label: string;
  icon: ElementType;
  tone: 'primary' | 'secondary' | 'accent';
  onClick: () => void;
}

const toneStyles = {
  primary: 'border-primary bg-primary-light/55 text-primary-dark',
  secondary: 'border-secondary bg-secondary-light/65 text-secondary-dark',
  accent: 'border-accent bg-accent-light/70 text-accent-dark',
};

export function NeedCard({ label, icon: Icon, tone, onClick }: NeedCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${toneStyles[tone]} flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border-2 bg-white p-4 text-center shadow-sm transition active:scale-[0.98]`}
    >
      <Icon size={54} strokeWidth={1.8} />
      <span className="text-base font-black uppercase leading-tight">{label}</span>
    </button>
  );
}
