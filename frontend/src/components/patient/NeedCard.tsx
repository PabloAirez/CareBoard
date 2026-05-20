import type { ElementType } from 'react';

interface NeedCardProps {
  label: string;
  icon: ElementType;
  tone: 'primary' | 'secondary' | 'accent';
  onClick: () => void;
  disabled?: boolean;
  statusText?: string;
}

const toneStyles = {
  primary: 'border-primary bg-primary-light/55 text-primary-dark',
  secondary: 'border-secondary bg-secondary-light/65 text-secondary-dark',
  accent: 'border-accent bg-accent-light/70 text-accent-dark',
};

export function NeedCard({ label, icon: Icon, tone, onClick, disabled = false, statusText }: NeedCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${toneStyles[tone]} flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border-2 bg-white p-4 text-center shadow-sm transition enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55`}
    >
      <Icon size={54} strokeWidth={1.8} />
      <span className="text-base font-black uppercase leading-tight">{label}</span>
      {statusText ? (
        <span className="min-h-5 text-xs font-black uppercase leading-tight opacity-75">{statusText}</span>
      ) : null}
    </button>
  );
}
