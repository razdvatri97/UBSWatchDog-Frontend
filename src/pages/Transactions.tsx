import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus } from 'lucide-react';
import { TransactionModal } from '../components/modals/TransactionModal';
import { useIsMobile } from '../components/ui/use-mobile';

export function Transactions() {
  const transactions = useStore((state) => state.transactions);
  const clients = useStore((state) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    clienteId: '',
    dataInicio: '',
    dataFim: '',
  });
  const isMobile = useIsMobile();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesClient = !filters.clienteId || transaction.clienteId === filters.clienteId;
    const transactionDate = new Date(transaction.dataHora);
    const matchesStartDate = !filters.dataInicio || transactionDate >= new Date(filters.dataInicio);
    const matchesEndDate =
      !filters.dataFim || transactionDate <= new Date(filters.dataFim + 'T23:59:59');

    return matchesClient && matchesStartDate && matchesEndDate;
  });

  const getClientName = (clienteId: string) => {
    return clients.find((c) => c.id === clienteId)?.nome || 'Desconhecido';
  };

  const getTypeBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'Depósito':
        return 'bg-green-100 text-green-700';
      case 'Saque':
        return 'bg-red-100 text-red-700';
      case 'Transferência':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 md:p-8 overflow-x-hidden min-w-0">
      <div className={`flex ${isMobile ? 'flex-col gap-6' : 'justify-between items-center'} mb-8`}>
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Transações</h1>
          <p className="text-[#666666] mt-1">Histórico de transações financeiras</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#e60028] hover:bg-[#cc0022] text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="size-5" />
          Registrar Transação
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filtrar por Cliente
            </label>
            <select
              value={filters.clienteId}
              onChange={(e) => setFilters({ ...filters, clienteId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os clientes</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Data Início</label>
            <input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Data Fim</label>
            <input
              type="date"
              value={filters.dataFim}
              onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-w-0">
        <div className="overflow-x-auto overscroll-x-contain max-w-full">
          <table className="min-w-max w-full table-auto whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Cliente
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Tipo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Valor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Moeda</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                  Contraparte
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Data/Hora
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{transaction.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                    {getClientName(transaction.clienteId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(
                        transaction.tipo
                      )}`}
                    >
                      {transaction.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">
                    {transaction.valor.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{transaction.moeda}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{transaction.contraparte}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(transaction.dataHora).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-slate-500">Nenhuma transação encontrada</div>
          )}
        </div>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
