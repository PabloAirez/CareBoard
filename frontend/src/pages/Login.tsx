import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Activity, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPatientBedId = (value: string) => {
    const match = value.trim().toLowerCase().match(/^(?:leito|l)?\s*0*(\d+)$/);
    if (!match) return undefined;

    const bedId = Number(match[1]);
    return bedId > 0 ? bedId : undefined;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      const patientBedId = getPatientBedId(username);

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
        } catch {
          navigate('/first-access');
        }
      } else if (password === '123456' && patientBedId) {
        navigate(`/patient/${patientBedId}`);
      } else {
        toast.error('Credenciais inválidas. Tente novamente.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-accent-dark p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 transition-transform hover:scale-105">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">CareBoard</h1>
          <p className="mt-2 text-sm font-medium text-primary-light">
            Painel Inteligente de Enfermaria
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-primary-light transition-colors group-focus-within:text-primary" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-11 pr-4 text-white outline-none transition-all placeholder:text-primary-light/50 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary"
                placeholder="Usuário ou leito"
                required
              />
            </div>

            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-primary-light transition-colors group-focus-within:text-primary" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-11 pr-4 text-white outline-none transition-all placeholder:text-primary-light/50 focus:border-primary focus:bg-white/10 focus:ring-1 focus:ring-primary"
                placeholder="Senha"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-lg font-bold text-white shadow-sm transition-all hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            {!loading && (
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
