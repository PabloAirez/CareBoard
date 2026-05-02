import { useCareboardMock } from '../hooks/useCareboardMocks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { BedCard } from '../components/dashboard/BedCard';
import { CallCard } from '../components/dashboard/CallCard';
import Header from '../components/dashboard/Header';

export default function Dashboard() {
  const { beds, calls } = useCareboardMock();
  const stats = useDashboardStats(beds);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/*Header*/}
         <Header></Header>

        {/* Beds Section */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
            {beds.map(b => (
              <BedCard key={b.id} bed={b} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Calls */}
      <div className="w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold mb-2">Chamadas Ativas</h2>
          <p className="text-primary-light text-sm">{calls.length} demanda{calls.length !== 1 ? 's' : ''} pendente{calls.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Calls List */}
        <div className="flex-1 overflow-y-auto p-4">
          {calls.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-gray-500 text-lg font-medium">Nenhuma chamada ativa</p>
              <p className="text-gray-400 text-sm mt-2">Todas as demandas foram atendidas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {calls.map(c => (
                <CallCard key={c.id} call={c} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Emergências: {calls.filter(c => c.priority === 'Emergência').length}</span>
            <span>Normais: {calls.filter(c => c.priority === 'Normal').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}