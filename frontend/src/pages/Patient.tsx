import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ActiveDemandList } from '../components/patient/ActiveDemandList';
import { NeedCard } from '../components/patient/NeedCard';
import { PatientHeader } from '../components/patient/PatientHeader';
import { patientNeeds } from '../components/patient/needs';
import { usePatientDemands } from '../hooks/usePatientDemands';

const DEMAND_COOLDOWN_MS = 3 * 60 * 1000;
const getCooldownStorageKey = (bedId: number) => `careboard:patient-demand-cooldown:${bedId}`;

const formatCooldown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export default function Patient() {
  const { bedId } = useParams();
  const numericBedId = Number(bedId);
  const [now, setNow] = useState(() => new Date());
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const { demands, createDemand, resolveDemand } = usePatientDemands(numericBedId);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!Number.isInteger(numericBedId) || numericBedId <= 0) return;

    const storedCooldown = Number(localStorage.getItem(getCooldownStorageKey(numericBedId)));
    setCooldownUntil(Number.isFinite(storedCooldown) ? storedCooldown : 0);
  }, [numericBedId]);

  if (!Number.isInteger(numericBedId) || numericBedId <= 0) {
    return <Navigate to="/" replace />;
  }

  const cooldownRemaining = Math.max(0, cooldownUntil - now.getTime());
  const isCooldownActive = cooldownRemaining > 0;

  const handleCreateDemand = (type: string) => {
    if (isCooldownActive) return;

    const wasCreated = createDemand(type);
    if (!wasCreated) return;

    const clickedAt = Date.now();
    const nextCooldownUntil = clickedAt + DEMAND_COOLDOWN_MS;
    localStorage.setItem(getCooldownStorageKey(numericBedId), String(nextCooldownUntil));
    setNow(new Date(clickedAt));
    setCooldownUntil(nextCooldownUntil);
  };

  return (
    <main className="min-h-screen bg-primary-light/40 p-3 text-primary-dark sm:p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        <PatientHeader bedId={numericBedId} now={now} />

        <ActiveDemandList demands={demands} onResolve={resolveDemand} />

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {patientNeeds.map((need) => {
            const hasActiveDemand = demands.some((demand) => demand.type === need.label);
            const statusText = isCooldownActive ? `Aguarde ${formatCooldown(cooldownRemaining)}` : hasActiveDemand ? 'Pedido ativo' : undefined;

            return (
              <NeedCard
                key={need.label}
                label={need.label}
                icon={need.icon}
                tone={need.tone}
                disabled={isCooldownActive || hasActiveDemand}
                statusText={statusText}
                onClick={() => handleCreateDemand(need.label)}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}
