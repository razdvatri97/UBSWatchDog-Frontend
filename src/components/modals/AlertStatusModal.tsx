import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Alert } from '../../types';

interface AlertStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
}

export function AlertStatusModal({ isOpen, onClose, alert }: AlertStatusModalProps) {
  const updateAlertStatus = useStore((state) => state.updateAlertStatus);
  const clients = useStore((state) => state.clients);
  const [status, setStatus] = useState<Alert['status']>(alert?.status || 'Novo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alert) {
      updateAlertStatus(alert.id, status);
      onClose();
    }
  };

  if (!isOpen || !alert) return null;

  const client = clients.find((c) => c.id === alert.clienteId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Atualizar Status do Alerta</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">ID do Alerta:</span>
              <span className="text-sm font-medium text-slate-800">{alert.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Cliente:</span>
              <span className="text-sm font-medium text-slate-800">{client?.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Regra:</span>
              <span className="text-sm font-medium text-slate-800">{alert.regra}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Severidade:</span>
              <span
                className={`text-sm font-medium ${
                  alert.severidade === 'Alta'
                    ? 'text-red-600'
                    : alert.severidade === 'Média'
                      ? 'text-amber-600'
                      : 'text-green-600'
                }`}
              >
                {alert.severidade}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-sm text-slate-600">{alert.descricao}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Novo Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Alert['status'])}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Novo">Novo</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Resolvido">Resolvido</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#e60028] text-white rounded-lg hover:bg-[#cc0022] transition-colors"
              >
                Atualizar Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
