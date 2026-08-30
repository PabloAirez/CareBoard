import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ActiveDemandList } from '../components/patient/ActiveDemandList';
import { NeedCard } from '../components/patient/NeedCard';
import { PatientHeader } from '../components/patient/PatientHeader';
import { patientNeeds } from '../components/patient/Needs';
import { useAuth } from '../contexts/AuthContext';
import { usePatientDemands } from '../hooks/usePatientDemands';

const DEMAND_COOLDOWN_MS = 3 * 60 * 1000;
const getCooldownStorageKey = (admissionId?: number | null, bedId?: number | null) =>
  `careboard:patient-demand-cooldown:${admissionId ?? bedId ?? 0}`;

const formatCooldown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export default function Patient() {
  const { user } = useAuth();
  const [now, setNow] = useState(() => new Date());
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const { demands, createDemand, completeDemand } = usePatientDemands(
    user?.admissionId ?? undefined,
    user?.bedId ?? undefined,
    user?.bedNumber ?? user?.name ?? undefined,
  );

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) return;

    const key = getCooldownStorageKey(user.admissionId, user.bedId);
    const storedCooldown = Number(localStorage.getItem(key));
    setCooldownUntil(Number.isFinite(storedCooldown) ? storedCooldown : 0);
  }, [user]);

  const isBedUser = user?.role === 'leito' || user?.role === 'paciente';

  if (!user || !isBedUser) {
    return <Navigate to="/" replace />;
  }

  const cooldownRemaining = Math.max(0, cooldownUntil - now.getTime());
  const isCooldownActive = cooldownRemaining > 0;

  const handleCreateDemand = async (type: string) => {
    if (isCooldownActive) return;

    const wasCreated = await createDemand(type);
    if (!wasCreated) return;

    const clickedAt = Date.now();
    const nextCooldownUntil = clickedAt + DEMAND_COOLDOWN_MS;
    const key = getCooldownStorageKey(user.admissionId, user.bedId);
    localStorage.setItem(key, String(nextCooldownUntil));
    setNow(new Date(clickedAt));
    setCooldownUntil(nextCooldownUntil);
  };

  const handleCompleteDemand = async (demandId: string) => {
    await completeDemand(demandId);
  };

  return (
    <main className="min-h-screen bg-primary-light/40 p-3 text-primary-dark sm:p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        <PatientHeader
          bedNumber={user.bedNumber ?? user.name}
          patientName={user.patientName}
          now={now}
        />

        <ActiveDemandList demands={demands} onComplete={(demandId) => void handleCompleteDemand(demandId)} />

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {patientNeeds.map((need) => {
            const hasActiveDemand = demands.some((demand) => demand.type === need.label);
            const statusText = isCooldownActive
              ? `Aguarde ${formatCooldown(cooldownRemaining)}`
              : hasActiveDemand
                ? 'Pedido ativo'
                : undefined;

            return (
              <NeedCard
                key={need.label}
                label={need.label}
                icon={need.icon}
                tone={need.tone}
                disabled={isCooldownActive || hasActiveDemand}
                statusText={statusText}
                onClick={() => void handleCreateDemand(need.label)}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}
