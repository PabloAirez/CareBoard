import type { Call } from '../../types/Dashboard';

export function CallCard({ call }: { call: Call }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergência':
        return {
          bg: 'bg-red-50',
          border: 'border-l-4 border-red-500',
          badge: 'bg-red-100 text-red-800',
          icon: '🚨',
          text: 'text-red-700'
        };
      case 'Normal':
        return {
          bg: 'bg-blue-50',
          border: 'border-l-4 border-primary',
          badge: 'bg-primary-light text-primary-dark',
          icon: '📞',
          text: 'text-primary-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-l-4 border-gray-300',
          badge: 'bg-gray-100 text-gray-800',
          icon: '•',
          text: 'text-gray-700'
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'assistência':
        return '🩺';
      case 'medicação':
        return '💊';
      case 'alimentação':
        return '🍽️';
      default:
        return '📋';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}min`;
    }
    return `${diffMins}min`;
  };

  const colors = getPriorityColor(call.priority);

  return (
    <div className={`${colors.bg} ${colors.border} rounded-lg p-4 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTypeIcon(call.type)}</span>
          <div>
            <p className="font-semibold text-gray-900">Leito {call.bedId.toString().padStart(2, '0')}</p>
            <p className="text-sm text-gray-600 capitalize">{call.type}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
          {call.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Há {getTimeAgo(call.time)}</span>
        <button className="bg-primary text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-primary-dark transition-colors">
          Atender
        </button>
      </div>
    </div>
  );
}