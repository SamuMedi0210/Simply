import { Settings, Play, Pause, Trash2, RefreshCw } from 'lucide-react';
import { useAutomation } from '../hooks/useAutomation';

export function AutomationControls() {
  const { config, updateConfig, clearLogs } = useAutomation();

  if (!config) return null;

  const toggleAutoVerify = async () => {
    await updateConfig({ auto_verify_enabled: !config.auto_verify_enabled });
  };

  const toggleShortcuts = async () => {
    await updateConfig({ shortcuts_enabled: !config.shortcuts_enabled });
  };

  const updateInterval = async (interval: number) => {
    await updateConfig({ verify_interval: interval });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Controles de Automatización</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">Auto-verificación de Cupones</h3>
            <p className="text-sm text-gray-600 mt-1">
              Presiona automáticamente el botón "Verificar cupón"
            </p>
          </div>
          <button
            onClick={toggleAutoVerify}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              config.auto_verify_enabled
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {config.auto_verify_enabled ? (
              <>
                <Pause className="w-4 h-4" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Iniciar
              </>
            )}
          </button>
        </div>

        {config.auto_verify_enabled && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de verificación (segundos)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="30"
                value={config.verify_interval}
                onChange={(e) => updateInterval(Number(e.target.value))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-semibold text-blue-600 min-w-[3rem] text-center">
                {config.verify_interval}s
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">Atajos de Teclado</h3>
            <p className="text-sm text-gray-600 mt-1">
              Habilita atajos para rellenar formularios rápidamente
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.shortcuts_enabled}
              onChange={toggleShortcuts}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <button
          onClick={() => {
            if (confirm('¿Estás seguro de que quieres limpiar todos los registros?')) {
              clearLogs();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Limpiar Registros
        </button>
      </div>
    </div>
  );
}
