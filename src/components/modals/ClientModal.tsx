import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClientModal({ isOpen, onClose }: ClientModalProps) {
  const addClient = useStore((state) => state.addClient);
  const [formData, setFormData] = useState({
    nome: '',
    pais: '',
    nivelRisco: 'Baixo' as 'Baixo' | 'Médio' | 'Alto',
    kycStatus: 'Pendente' as 'Pendente' | 'Aprovado' | 'Rejeitado',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(formData);
    setFormData({
      nome: '',
      pais: '',
      nivelRisco: 'Baixo',
      kycStatus: 'Pendente',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Cadastrar Cliente</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome do cliente"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">País</label>
            <input
              type="text"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o país"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nível de Risco
            </label>
            <select
              value={formData.nivelRisco}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nivelRisco: e.target.value as 'Baixo' | 'Médio' | 'Alto',
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Baixo">Baixo</option>
              <option value="Médio">Médio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              KYC Status
            </label>
            <select
              value={formData.kycStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kycStatus: e.target.value as 'Pendente' | 'Aprovado' | 'Rejeitado',
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pendente">Pendente</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Rejeitado">Rejeitado</option>
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
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}