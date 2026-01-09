import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Edit } from 'lucide-react';
import { AlertStatusModal } from '../components/modals/AlertStatusModal';
import { Alert } from '../types';

export function Alerts() {
  const alerts = useStore((state) => state.alerts);
  const clients = useStore((state) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filters, setFilters] = useState({
    severidade: '',
    status: '',
  });

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = !filters.severidade || alert.severidade === filters.severidade;
    const matchesStatus = !filters.status || alert.status === filters.status;

    return matchesSeverity && matchesStatus;
  });

  const getClientName = (clienteId: string) => {
    return clients.find((c) => c.id === clienteId)?.nome || 'Desconhecido';
  };

  const getSeverityBadgeColor = (severidade: string) => {
    switch (severidade) {
      case 'Baixa':
        return 'bg-green-100 text-green-700';
      case 'Média':
        return 'bg-amber-100 text-amber-700';
      case 'Alta':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Novo':
        return 'bg-blue-100 text-blue-700';
      case 'Em Análise':
        return 'bg-amber-100 text-amber-700';
      case 'Resolvido':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">Alertas de Compliance</h1>
        <p className="text-[#666666] mt-1">Monitoramento de atividades suspeitas</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filtrar por Severidade
            </label>
            <select
              value={filters.severidade}
              onChange={(e) => setFilters({ ...filters, severidade: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as severidades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filtrar por Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              <option value="Novo">Novo</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Resolvido">Resolvido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-red-600 mb-1">Alertas de Alta Severidade</p>
          <p className="text-3xl font-bold text-red-700">
            {alerts.filter((a) => a.severidade === 'Alta').length}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-sm text-amber-600 mb-1">Em Análise</p>
          <p className="text-3xl font-bold text-amber-700">
            {alerts.filter((a) => a.status === 'Em Análise').length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-600 mb-1">Novos Alertas</p>
          <p className="text-3xl font-bold text-blue-700">
            {alerts.filter((a) => a.status === 'Novo').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Cliente
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Regra
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Descrição
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Severidade
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Data/Hora
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{alert.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {getClientName(alert.clienteId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{alert.regra}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                    {alert.descricao}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getSeverityBadgeColor(
                        alert.severidade
                      )}`}
                    >
                      {alert.severidade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        alert.status
                      )}`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(alert.dataHora).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditAlert(alert)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Edit className="size-4" />
                      <span className="text-sm">Atualizar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nenhum alerta encontrado
            </div>
          )}
        </div>
      </div>

      <AlertStatusModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        alert={selectedAlert}
      />
    </div>
  );
}