import { CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useCareboardMock } from '../hooks/useCareboardMocks';
import { BedCard } from '../components/dashboard/BedCard';
import { CallCard } from '../components/dashboard/CallCard';
import Header from '../components/dashboard/Header';

const BEDS_PER_PAGE = 40;
const BED_ROTATION_INTERVAL_MS = 30000;

export default function Dashboard() {
  const { beds, calls } = useCareboardMock();
  const [currentBedPage, setCurrentBedPage] = useState(0);

  const bedPages = useMemo(() => {
    const pages = [];

    for (let index = 0; index < beds.length; index += BEDS_PER_PAGE) {
      pages.push(beds.slice(index, index + BEDS_PER_PAGE));
    }

    return pages;
  }, [beds]);

  const pageCount = bedPages.length || 1;
  const visibleBeds = bedPages[currentBedPage] ?? bedPages[0] ?? [];
  const visibleStart = currentBedPage * BEDS_PER_PAGE + 1;
  const visibleEnd = currentBedPage * BEDS_PER_PAGE + visibleBeds.length;

  useEffect(() => {
    setCurrentBedPage(0);
  }, [beds]);

  useEffect(() => {
    if (pageCount <= 1) return;

    const interval = setInterval(() => {
      setCurrentBedPage(page => (page + 1) % pageCount);
    }, BED_ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [pageCount]);

  useEffect(() => {
    if (pageCount <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrentBedPage(page => (page + 1) % pageCount);
      }

      if (event.key === 'ArrowLeft') {
        setCurrentBedPage(page => (page - 1 + pageCount) % pageCount);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageCount]);

  return (
    <div className="h-screen overflow-hidden bg-primary-light/40 text-primary-dark">
      <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-2.5 sm:p-3">
          <Header beds={beds} />

          <section className="mt-2.5 min-h-0 flex-1 overflow-hidden">
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-primary-dark">Mapa de leitos</h2>
                <p className="text-xs font-medium text-primary-dark/60">
                  Monitoramento operacional da unidade
                </p>
              </div>
              <div className="flex items-center gap-2">
                {pageCount > 1 && (
                  <span className="rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-primary-dark shadow-sm ring-1 ring-primary-light">
                    {visibleStart}-{visibleEnd} de {beds.length}
                  </span>
                )}
                <span className="rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-primary shadow-sm ring-1 ring-primary-light">
                  Página {currentBedPage + 1}/{pageCount}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(104px,1fr))] gap-1.5">
              {visibleBeds.map(b => (
                <BedCard key={b.id} bed={b} />
              ))}
            </div>
          </section>
        </main>

        <aside className="flex w-full shrink-0 flex-col border-t border-primary-light bg-white shadow-xl lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-l lg:border-t-0">
          <div className="border-b border-primary-light bg-primary p-3 text-white">
            <h2 className="text-base font-bold">Chamadas ativas</h2>
            <p className="mt-1 text-xs font-medium text-primary-light">
              {calls.length} demanda{calls.length !== 1 ? 's' : ''} pendente{calls.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5">
            {calls.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-secondary-light bg-secondary-light/40 px-6 py-12 text-center">
                <CheckCircle2 className="mb-3 text-secondary" size={44} />
                <p className="text-lg font-bold text-secondary-dark">Nenhuma chamada ativa</p>
                <p className="mt-1 text-sm font-medium text-secondary-dark/70">
                  Todas as demandas foram atendidas
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {calls.map(c => (
                  <CallCard key={c.id} call={c} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-primary-light bg-primary-light/45 p-2.5">
            <div className="flex justify-between text-[11px] font-bold text-primary-dark">
              <span>Emergências: {calls.filter(c => c.priority === 'Emergência').length}</span>
              <span>Normais: {calls.filter(c => c.priority === 'Normal').length}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
