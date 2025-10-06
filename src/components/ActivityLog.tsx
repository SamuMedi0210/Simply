import { Activity, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useAutomation } from '../hooks/useAutomation';

export function ActivityLog() {
  const { logs, refreshLogs } = useAutomation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      auto_click: 'Auto-verificación',
      shortcut: 'Atajo de teclado',
      manual_verify: 'Verificación manual',
      form_fill: 'Rellenado de formulario',
      clipboard_copy: 'Copia al portapapeles',
    };
    return labels[actionType] || actionType;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Registro de Actividad</h2>
        </div>
        <button
          onClick={refreshLogs}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualizar registros"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay actividad registrada</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="mt-0.5">{getStatusIcon(log.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {getActionLabel(log.action_type)}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatTime(log.created_at)}
                  </span>
                </div>
                {log.details && Object.keys(log.details).length > 0 && (
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {JSON.stringify(log.details)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
