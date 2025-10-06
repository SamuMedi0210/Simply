import { Tag, CheckCircle2, XCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { useAutomation } from '../hooks/useAutomation';

export function CouponResults() {
  const { results, refreshResults } = useAutomation();

  const validCount = results.filter((r) => r.is_valid).length;
  const invalidCount = results.filter((r) => !r.is_valid).length;
  const successRate = results.length > 0
    ? ((validCount / results.length) * 100).toFixed(1)
    : '0';

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-800">Resultados de Cupones</h2>
        </div>
        <button
          onClick={refreshResults}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualizar resultados"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Válidos</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{validCount}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Inválidos</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{invalidCount}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Éxito</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{successRate}%</p>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay resultados de cupones</p>
          </div>
        ) : (
          results.map((result) => (
            <div
              key={result.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                result.is_valid
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.is_valid ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-mono font-semibold text-gray-800 truncate">
                  {result.coupon_code}
                </p>
                {result.discount_amount && (
                  <p className="text-sm text-gray-600">{result.discount_amount}</p>
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTime(result.tested_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
