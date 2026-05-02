import { Activity, Bed, Percent } from 'lucide-react';
import { useCareboardMock } from '../../hooks/useCareboardMocks';
import { useDashboardStats } from '../../hooks/useDashboardStats';

interface HeaderProps {
  hospitalName?: string;
  unitName?: string;
}

export default function Header({
  hospitalName = "Nome aqui",
  unitName = "Unidade"
}: HeaderProps) {

    const { beds, calls } = useCareboardMock();
  const stats = useDashboardStats(beds);


  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      
      {/* 🔹 Lado esquerdo: Identificação */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md">
          <Activity size={22} />
        </div>

        <div className="leading-tight">
          <h1 className="text-xl font-black text-slate-800">
            Careboard
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {hospitalName} • {unitName}
          </p>
        </div>
      </div>

      {/* 🔹 Lado direito: Indicadores */}
      <div className="flex items-center gap-6">

        {/* Taxa de ocupação */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border`}>
          
          <div className="p-2 rounded-lg bg-white/60">
            <Bed size={18} />
          </div>

          


           {/* Ocupação */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Ocupação</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.occupancy}%</p>
              </div>
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                <span className="text-primary text-xl">📊</span>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full"
                style={{ width: `${stats.occupancy}%` }}
              ></div>
            </div>
          </div>

          {/* Limpeza */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Limpeza</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.cleaning}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-light rounded-lg flex items-center justify-center">
                <span className="text-secondary text-xl">🧹</span>
              </div>
            </div>
          </div>

          {/* Bloqueados */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bloqueados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.blocked}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 text-xl">⛔</span>
              </div>
            </div>
          </div>

          {/* Críticos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Críticos</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.highMews}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">🚨</span>
              </div>
            </div>
          </div>
        </div>



      </div>
    </header>
  );
}