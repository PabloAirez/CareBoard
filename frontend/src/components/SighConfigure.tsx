import React, { useState } from 'react';
import { Database, Server, Key, User, Activity } from 'lucide-react';

type Props = {
  onSubmit: (data: any) => void;
  loading: boolean;
};

export default function SighConfigure({ onSubmit, loading }: Props) {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('5432');
  const [dbName, setDbName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ host, port, dbName, dbUser, dbPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Database className="w-5 h-5 text-accent" />
        Integração SIGH
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          placeholder="Host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none"
        />

        <input
          placeholder="Porta"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none"
        />

        <input
          placeholder="Banco"
          value={dbName}
          onChange={(e) => setDbName(e.target.value)}
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none md:col-span-2"
        />

        <input
          placeholder="Usuário"
          value={dbUser}
          onChange={(e) => setDbUser(e.target.value)}
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none"
        />

        <input
          type="password"
          placeholder="Senha"
          value={dbPassword}
          onChange={(e) => setDbPassword(e.target.value)}
          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent outline-none"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            Salvando <Activity className="animate-spin w-5 h-5" />
          </>
        ) : (
          'Salvar Configuração'
        )}
      </button>
    </form>
  );
}