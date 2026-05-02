import type { Call } from '../../types/Dashboard';

export function CallList({ calls }: { calls: Call[] }) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'urgent':
        return { bg: 'bg-red-50', border: 'border-l-4 border-red-500', badge: 'bg-red-100 text-red-800', icon: '🚨' };
      case 'high':
        return { bg: 'bg-orange-50', border: 'border-l-4 border-orange-500', badge: 'bg-orange-100 text-orange-800', icon: '⚠️' };
      case 'normal':
        return { bg: 'bg-blue-50', border: 'border-l-4 border-primary', badge: 'bg-primary-light text-primary-dark', icon: '📞' };
      case 'routine':
        return { bg: 'bg-green-50', border: 'border-l-4 border-secondary', badge: 'bg-secondary-light text-secondary-dark', icon: '✓' };
      default:
        return { bg: 'bg-gray-50', border: 'border-l-4 border-gray-300', badge: 'bg-gray-100 text-gray-800', icon: '•' };
    }
  };

  if (calls.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-l-4 border-secondary">
        <p className="text-gray-500 text-lg">✅ Nenhuma chamada ativa</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {calls.map(c => {
        const colors = getTypeColor(c.type);
        return (
          <div 
            key={c.id} 
            className={`${colors.bg} ${colors.border} rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 flex items-center justify-between`}
          >
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-2xl">{colors.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">Leito {c.bedId}</p>
                <p className="text-sm text-gray-600">{c.type}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-xs font-bold ${colors.badge}`}>
              {c.type.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}