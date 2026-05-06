import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ActiveDemandList } from '../components/patient/ActiveDemandList';
import { NeedCard } from '../components/patient/NeedCard';
import { PatientHeader } from '../components/patient/PatientHeader';
import { patientNeeds } from '../components/patient/needs';
import { usePatientDemands } from '../hooks/usePatientDemands';

export default function Patient() {
  const { bedId } = useParams();
  const numericBedId = Number(bedId);
  const [now, setNow] = useState(() => new Date());
  const { demands, createDemand, resolveDemand } = usePatientDemands(numericBedId);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!Number.isInteger(numericBedId) || numericBedId <= 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-primary-light/40 p-3 text-primary-dark sm:p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        <PatientHeader bedId={numericBedId} now={now} />

        <ActiveDemandList demands={demands} onResolve={resolveDemand} />

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {patientNeeds.map((need) => (
            <NeedCard
              key={need.label}
              label={need.label}
              icon={need.icon}
              tone={need.tone}
              onClick={() => createDemand(need.label)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
