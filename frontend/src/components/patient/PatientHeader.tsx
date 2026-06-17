interface PatientHeaderProps {
  bedNumber: string;
  patientName?: string | null;
  now: Date;
}

export function PatientHeader({ bedNumber, patientName, now }: PatientHeaderProps) {
  return (
    <header className="rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-primary-light">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary-dark/55">Leito</p>
          <h1 className="text-3xl font-black leading-8 text-primary-dark">
            L{bedNumber.padStart(2, '0')}
          </h1>
          {patientName ? (
            <p className="mt-1 text-sm font-bold text-primary-dark/60">{patientName}</p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-primary-dark/60">
            {now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
          </p>
          <p className="text-2xl font-black text-primary">
            {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </header>
  );
}
