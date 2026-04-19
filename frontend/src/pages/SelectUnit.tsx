import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// 🔥 Mock fallback
const mockUnits = [
  { id: 1, name: 'UTI Adulto' },
  { id: 2, name: 'Clínica Médica' },
  { id: 3, name: 'Pediatria' },
  { id: 4, name: 'Centro Cirúrgico' },
  { id: 5, name: 'Emergência' },
];

interface Unit {
  id: number;
  name: string;
}

export default function SelectUnit() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';

    if (useMock) {
      setUnits(mockUnits);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/units`)
      .then(async (r) => {
        if (!r.ok) {
          throw new Error('Erro ao buscar unidades');
        }
        return r.json();
      })
      .then((data) => {
        setUnits(data);
        setLoading(false);
      })
      .catch((e) => {
        console.warn('Fallback para mock:', e.message);

        // 🔥 fallback automático
        setUnits(mockUnits);

        // aviso leve (não bloqueia)
        setError('Modo offline: exibindo unidades locais');

        setLoading(false);
      });
  }, []);

  const selectUnit = (id: number) => {
    navigate(`/dashboard?unit=${id}`);
  };

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/30">
            <Building2 size={32} />
          </div>

          <h1 className="text-3xl font-black text-gray-800">
            Painel Inteligente
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Selecione sua Unidade de Internação
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-primary">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="font-semibold text-gray-500">
              Sincronizando com sistema...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Aviso leve */}
            {error && (
              <div className="col-span-full flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                <AlertTriangle className="w-5 h-5 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Lista */}
            {units.length > 0 ? (
              units.map((u, i) => (
                <motion.button
                  key={u.id}
                  data-cy={`unit-${u.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => selectUnit(u.id)}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm
                  hover:border-primary hover:ring-2 hover:ring-primary-light
                  transition-all group flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-xl font-bold text-gray-700 group-hover:text-primary transition-colors">
                      {u.name}
                    </h2>
                    <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-widest">
                      Acessar Painel
                    </p>
                  </div>

                  <ArrowRight className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                Nenhuma unidade disponível.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}