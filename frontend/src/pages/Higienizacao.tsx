import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  LogOut,
  Building2,
  RefreshCw,
  UserCheck,
  AlertCircle,
  Home,
  Check,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface CleaningBed {
  id: number;
  number: string;
  unitId: number;
  unitName?: string;
  status: string;
  statusLeitoId: number;
  lastDischargeDate?: string | Date | null;
  cleaningStartedAt?: string | Date | null;
  cleaningEndedAt?: string | Date | null;
  cleanedByUserId?: number | null;
}

interface Unit {
  id: number;
  name: string;
}

export default function Higienizacao() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [beds, setBeds] = useState<CleaningBed[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'esperando' | 'higienizando' | 'livre'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchUnits = async () => {
    try {
      const res = await fetch(`${API_URL}/api/units`);
      if (res.ok) {
        const data = await res.json();
        setUnits(data);
      }
    } catch {
      // Ignora erro de fetch unidades
    }
  };

  const fetchBeds = async () => {
    try {
      const query = selectedUnitId !== 'all' ? `?unitId=${selectedUnitId}` : '';
      const res = await fetch(`${API_URL}/api/higienizacao/leitos${query}`);
      if (res.ok) {
        const data = await res.json();
        setBeds(data);
      } else {
        toast.error('Erro ao carregar lista de leitos para higienização');
      }
    } catch {
      toast.error('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    fetchBeds();
  }, [selectedUnitId]);

  useEffect(() => {
    const socket = io(API_URL);

    socket.on('leitos:atualizado', () => {
      fetchBeds();
    });

    socket.on('sigh:sync-complete', () => {
      fetchBeds();
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUnitId]);

  const handleStartCleaning = async (bedId: number) => {
    setActionLoadingId(bedId);
    try {
      const res = await fetch(`${API_URL}/api/higienizacao/leitos/${bedId}/iniciar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: user?.id }),
      });

      if (!res.ok) throw new Error('Falha ao iniciar higienização');

      toast.info('Higienização iniciada com sucesso!');
      await fetchBeds();
    } catch {
      toast.error('Não foi possível alterar o status do leito');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleFinishCleaning = async (bedId: number) => {
    setActionLoadingId(bedId);
    try {
      const res = await fetch(`${API_URL}/api/higienizacao/leitos/${bedId}/concluir`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: user?.id }),
      });

      if (!res.ok) throw new Error('Falha ao concluir higienização');

      toast.success('Leito pronto e marcado como livre!');
      await fetchBeds();
    } catch {
      toast.error('Não foi possível finalizar a higienização');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRegisterDischarge = async (bedId: number) => {
    setActionLoadingId(bedId);
    try {
      const res = await fetch(`${API_URL}/api/higienizacao/leitos/${bedId}/alta`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Falha ao registrar alta');

      toast.warning('Alta registrada! Leito aguardando higienização.');
      await fetchBeds();
    } catch {
      toast.error('Erro ao simular alta no leito');
    } finally {
      setActionLoadingId(null);
    }
  };

  const waitingCount = beds.filter((b) => b.status === 'Esperando Higienização').length;
  const inProgressCount = beds.filter((b) => b.status === 'Em Higienização').length;
  const freeCount = beds.filter((b) => b.status === 'Livre').length;

  const filteredBeds = beds.filter((b) => {
    if (statusFilter === 'esperando') return b.status === 'Esperando Higienização';
    if (statusFilter === 'higienizando') return b.status === 'Em Higienização';
    if (statusFilter === 'livre') return b.status === 'Livre';
    return true;
  });

  const formatDate = (dateStr?: string | Date | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navigation Bar */}
      <header className="bg-primary-dark text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                CareBoard
                <span className="text-xs bg-teal-500/30 text-teal-200 border border-teal-400/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Módulo Higienização
                </span>
              </h1>
              <p className="text-xs text-primary-light/80">Gestão e controle de limpeza dos leitos pós-alta</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <UserCheck className="w-4 h-4 text-teal-300" />
              <span>
                Operador: <strong className="text-white">{user?.name ?? 'Higienização'}</strong>
              </span>
            </div>

            <button
              onClick={() => navigate('/select-unit')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
              title="Voltar para Unidades"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Painel</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/80 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Metric Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Leitos</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{beds.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className={`bg-white p-4 rounded-2xl border ${waitingCount > 0 ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'} shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Esperando Higienização</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{waitingCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Em Higienização</p>
              <p className="text-2xl font-black text-blue-700 mt-1">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Leitos Livres</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{freeCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-primary-dark text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({beds.length})
            </button>
            <button
              onClick={() => setStatusFilter('esperando')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'esperando'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Esperando Higienização ({waitingCount})
            </button>
            <button
              onClick={() => setStatusFilter('higienizando')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'higienizando'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              Em Higienização ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter('livre')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'livre'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Leito Livre ({freeCount})
            </button>
          </div>

          <div className="flex items-center gap-3">
            {units.length > 0 && (
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todas as Unidades</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => {
                setLoading(true);
                fetchBeds();
              }}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Leitos Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-2 text-teal-600" />
            <p className="text-sm font-semibold">Carregando leitos para higienização...</p>
          </div>
        ) : filteredBeds.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-bold text-gray-600">Nenhum leito encontrado</p>
            <p className="text-xs text-gray-400 mt-1">Não há leitos no filtro selecionado no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBeds.map((bed) => {
              const isWaiting = bed.status === 'Esperando Higienização';
              const isCleaning = bed.status === 'Em Higienização';
              const isFree = bed.status === 'Livre';
              const isOccupied = bed.status === 'Ocupado';

              const isActionLoading = actionLoadingId === bed.id;

              return (
                <div
                  key={bed.id}
                  className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                    isWaiting
                      ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/20'
                      : isCleaning
                      ? 'border-blue-300 ring-1 ring-blue-200 bg-blue-50/20'
                      : isFree
                      ? 'border-emerald-200'
                      : 'border-gray-200'
                  }`}
                >
                  <div>
                    {/* Top row: Bed Number and Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center shadow-sm">
                          L{bed.number.padStart(2, '0')}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            {bed.unitName ?? 'Unidade'}
                          </p>
                        </div>
                      </div>

                      {isWaiting && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Esperando Higienização
                        </span>
                      )}

                      {isCleaning && (
                        <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
                          Em Higienização
                        </span>
                      )}

                      {isFree && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Leito Livre
                        </span>
                      )}

                      {isOccupied && (
                        <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          Ocupado
                        </span>
                      )}
                    </div>

                    {/* Timeline Info */}
                    <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs border border-gray-100 mb-4">
                      {bed.lastDischargeDate && (
                        <div className="flex justify-between text-gray-600">
                          <span className="font-medium">Alta registrada:</span>
                          <span className="font-bold text-gray-800">{formatDate(bed.lastDischargeDate)}</span>
                        </div>
                      )}

                      {bed.cleaningStartedAt && (
                        <div className="flex justify-between text-blue-700">
                          <span className="font-medium">Início Higienização:</span>
                          <span className="font-bold">{formatDate(bed.cleaningStartedAt)}</span>
                        </div>
                      )}

                      {bed.cleaningEndedAt && (
                        <div className="flex justify-between text-emerald-700">
                          <span className="font-medium">Pronto às:</span>
                          <span className="font-bold">{formatDate(bed.cleaningEndedAt)}</span>
                        </div>
                      )}

                      {!bed.lastDischargeDate && !bed.cleaningStartedAt && (
                        <p className="text-[11px] text-gray-400 italic">Sem histórico recente de higienização</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-gray-100">
                    {isWaiting && (
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleStartCleaning(bed.id)}
                        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 fill-white" />
                        )}
                        <span>Iniciar Higienização</span>
                      </button>
                    )}

                    {isCleaning && (
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleFinishCleaning(bed.id)}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 stroke-[3]" />
                        )}
                        <span>Marcar como Pronto (Leito livre)</span>
                      </button>
                    )}

                    {isFree && (
                      <div className="flex items-center justify-between text-xs text-emerald-700 font-bold px-1 py-1.5">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Pronto para uso
                        </span>
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleRegisterDischarge(bed.id)}
                          className="text-[10px] text-gray-400 hover:text-amber-600 underline font-normal"
                          title="Simular alta para enviar leito para higienização"
                        >
                          Simular Alta
                        </button>
                      </div>
                    )}

                    {isOccupied && (
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleRegisterDischarge(bed.id)}
                        className="w-full py-2 px-3 bg-gray-100 hover:bg-amber-50 text-gray-700 hover:text-amber-700 font-semibold text-xs rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Registrar Alta (Encaminhar)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
