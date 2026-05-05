import { CheckCircle2 } from 'lucide-react';
import { useCareboardMock } from '../hooks/useCareboardMocks';
import { BedCard } from '../components/dashboard/BedCard';
import { CallCard } from '../components/dashboard/CallCard';
import Header from '../components/dashboard/Header';

export default function Dashboard() {
  const { beds, calls } = useCareboardMock();

  return (
    <div className="min-h-screen bg-primary-light/40 text-primary-dark">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <main className="flex-1 p-4 sm:p-6">
          <Header />

          <section className="mt-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-primary-dark">Mapa de leitos</h2>
                <p className="text-sm font-medium text-primary-dark/60">
                  Monitoramento operacional da unidade
                </p>
              </div>
              <span className="rounded-md bg-white px-3 py-2 text-sm font-bold text-primary shadow-sm ring-1 ring-primary-light">
                {beds.length} leitos
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
              {beds.map(b => (
                <BedCard key={b.id} bed={b} />
              ))}
            </div>
          </section>
        </main>

        <aside className="flex w-full flex-col border-t border-primary-light bg-white shadow-xl lg:w-96 lg:border-l lg:border-t-0">
          <div className="border-b border-primary-light bg-primary p-5 text-white">
            <h2 className="text-xl font-bold">Chamadas ativas</h2>
            <p className="mt-1 text-sm font-medium text-primary-light">
              {calls.length} demanda{calls.length !== 1 ? 's' : ''} pendente{calls.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {calls.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-secondary-light bg-secondary-light/40 px-6 py-12 text-center">
                <CheckCircle2 className="mb-3 text-secondary" size={44} />
                <p className="text-lg font-bold text-secondary-dark">Nenhuma chamada ativa</p>
                <p className="mt-1 text-sm font-medium text-secondary-dark/70">
                  Todas as demandas foram atendidas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {calls.map(c => (
                  <CallCard key={c.id} call={c} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-primary-light bg-primary-light/45 p-4">
            <div className="flex justify-between text-sm font-bold text-primary-dark">
              <span>Emergências: {calls.filter(c => c.priority === 'Emergência').length}</span>
              <span>Normais: {calls.filter(c => c.priority === 'Normal').length}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
