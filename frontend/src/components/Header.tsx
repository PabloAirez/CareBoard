import { Activity, Bed, Percent } from 'lucide-react';

interface HeaderProps {
  hospitalName?: string;
  unitName?: string;
  occupancyRate: number; // %
}

export default function Header({
  hospitalName = "Nome aqui",
  unitName = "Unidade",
  occupancyRate
}: HeaderProps) {

  const getOccupancyColor = () => {
    if (occupancyRate >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (occupancyRate >= 75) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

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
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${getOccupancyColor()}`}>
          
          <div className="p-2 rounded-lg bg-white/60">
            <Bed size={18} />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Ocupação
            </span>
            <span className="text-lg font-black leading-none">
              {occupancyRate}%
            </span>
          </div>
        </div>



      </div>
    </header>
  );
}