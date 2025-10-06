import { Keyboard } from 'lucide-react';

export function ShortcutsGuide() {
  const shortcuts = [
    {
      key: 'P',
      action: 'Marcar cupón como inválido',
      description: 'Rellena automáticamente el formulario de código inválido con el texto del portapapeles',
    },
    {
      key: 'V',
      action: 'Marcar cupón como válido',
      description: 'Rellena el formulario de código válido con el texto del portapapeles',
    },
    {
      key: 'C',
      action: 'Copiar código',
      description: 'Copia el código actual al portapapeles',
    },
    {
      key: 'N',
      action: 'Siguiente cupón',
      description: 'Avanza al siguiente cupón disponible',
    },
    {
      key: 'Espacio',
      action: 'Verificar cupón',
      description: 'Presiona el botón de verificación manualmente',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 border-b pb-4 mb-4">
        <Keyboard className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">Atajos de Teclado</h2>
      </div>

      <div className="space-y-3">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0">
              <kbd className="px-3 py-1.5 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{shortcut.action}</h3>
              <p className="text-sm text-gray-600 mt-1">{shortcut.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los atajos de teclado funcionan cuando la extensión está activa y los atajos están habilitados.
        </p>
      </div>
    </div>
  );
}
