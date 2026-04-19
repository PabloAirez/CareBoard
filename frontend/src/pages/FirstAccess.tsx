import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Activity, Hospital } from 'lucide-react';
import { toast } from 'react-toastify';
import SighConfigure from './../components/SighConfigure';

export default function FirstAccess() {
  const [hospitalName, setHospitalName] = useState('');
  const [system, setSystem] = useState('SIGH');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/config/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hospitalName, system, ...data })
      });

      if (res.ok) {
        navigate('/select-unit');
      } else {
        toast.error('Erro ao configurar sistema.');
      }
    } catch {
      toast.error('Erro de conexão com o servidor.');
    } finally {
      toast.info('Simulando que tudo deu certo. Redirecionando...', { autoClose: 2000 });
      navigate('/select-unit');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row overflow-hidden">

        {/* LEFT */}
        <div className="md:w-1/3 bg-gradient-to-br from-primary to-accent p-10 text-white hidden md:flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black mb-4">Configuração Inicial</h2>
            <p className="text-primary-light">
              Configure a integração com o sistema hospitalar para iniciar o CareBoard.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary-light" />
              <span className="text-sm font-bold">Status</span>
            </div>
            <p className="text-xs text-primary-light">
              Aguardando configuração do sistema.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-10">

          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Hospital className="w-5 h-5 text-primary" />
              Primeiro Acesso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome do Hospital"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />

              <select
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="SIGH">SIGH</option>
                <option value="TASY">TASY</option>

              </select>
            </div>
          </div>

          {/* Renderização dinâmica */}
          {system === 'SIGH' && (
            <SighConfigure onSubmit={handleSubmit} loading={loading} />
          )}

        </div>
      </div>
    </div>
  );
}