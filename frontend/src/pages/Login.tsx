import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Activity, ArrowRight } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(async () => {
      if (username === 'hrsj' && password === '123456') {
        try {
          const configRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/config/status`);
          if (configRes.ok) {
            const data = await configRes.json();
            if (data.isConfigured) {
              navigate('/select-unit');
            } else {
              navigate('/first-access');
            }
          } else {
            navigate('/first-access');
          }
        } catch (err) {
          navigate('/first-access');
        }
      } else {
        setError('Credenciais inválidas. Tente novamente.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-accent-dark flex items-center justify-center p-4">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4 transition-transform hover:scale-105">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">CareBoard</h1>
          <p className="text-primary-light text-sm mt-2 font-medium">
            Painel Inteligente de Enfermaria
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-4">

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-primary-light group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-primary-light/50 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                placeholder="Usuário"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-primary-light group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-primary-light/50 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                placeholder="Senha"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl shadow-sm text-lg font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            {!loading && (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>


        </form>
      </div>
    </div>
  );
}