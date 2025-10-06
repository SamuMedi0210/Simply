import { Zap, Info } from 'lucide-react';
import { AutomationControls } from './components/AutomationControls';
import { ShortcutsGuide } from './components/ShortcutsGuide';
import { ActivityLog } from './components/ActivityLog';
import { CouponResults } from './components/CouponResults';
import { AutomationRunner } from './components/AutomationRunner';
import { useAutomation } from './hooks/useAutomation';

function App() {
  const { loading } = useAutomation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando automatización...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AutomationRunner />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Automatización de Extensión SimplyCodes
                </h1>
                <p className="text-gray-600 mt-1">
                  Control automático para verificación de cupones y atajos de teclado
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <strong>Importante:</strong> Esta aplicación controla la extensión SimplyCodes.
                  Asegúrate de que la extensión esté instalada y activa en tu navegador para que
                  la automatización funcione correctamente.
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AutomationControls />
              <ShortcutsGuide />
            </div>

            <div className="space-y-6">
              <CouponResults />
              <ActivityLog />
            </div>
          </div>

          <footer className="mt-8 text-center text-sm text-gray-600">
            <p>Desarrollado para automatizar el flujo de trabajo de verificación de cupones</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
