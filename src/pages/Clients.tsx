import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Search } from 'lucide-react';
import { ClientModal } from '../components/modals/ClientModal';
import { useIsMobile } from '../components/ui/use-mobile';

export function Clients() {
  const clients = useStore((state) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    pais: '',
    nivelRisco: '',
    kycStatus: '',
  });
  const isMobile = useIsMobile();

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPais = !filters.pais || client.pais === filters.pais;
    const matchesRisco = !filters.nivelRisco || client.nivelRisco === filters.nivelRisco;
    const matchesKyc = !filters.kycStatus || client.kycStatus === filters.kycStatus;

    return matchesSearch && matchesPais && matchesRisco && matchesKyc;
  });

  const uniquePaises = Array.from(new Set(clients.map((c) => c.pais)));

  const getRiskBadgeColor = (risco: string) => {
    switch (risco) {
      case 'Baixo':
        return 'bg-green-100 text-green-700';
      case 'Médio':
        return 'bg-amber-100 text-amber-700';
      case 'Alto':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getKycBadgeColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-700';
      case 'Pendente':
        return 'bg-amber-100 text-amber-700';
      case 'Rejeitado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 md:p-8 overflow-x-hidden min-w-0">
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'} mb-8`}>
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Clientes</h1>
          <p className="text-[#666666] mt-1">Gestão de clientes cadastrados no sistema</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#e60028] hover:bg-[#cc0022] text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="size-5" />
          Cadastrar Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filters.pais}
            onChange={(e) => setFilters({ ...filters, pais: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os países</option>
            {uniquePaises.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>

          <select
            value={filters.nivelRisco}
            onChange={(e) => setFilters({ ...filters, nivelRisco: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os níveis de risco</option>
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>

          <select
            value={filters.kycStatus}
            onChange={(e) => setFilters({ ...filters, kycStatus: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status KYC</option>
            <option value="Pendente">Pendente</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain max-w-full">
          <table className="min-w-max w-full table-auto whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Nome
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  País
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Nível de Risco
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  KYC Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Data Cadastro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{client.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                    {client.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{client.pais}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(
                        client.nivelRisco
                      )}`}
                    >
                      {client.nivelRisco}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getKycBadgeColor(
                        client.kycStatus
                      )}`}
                    >
                      {client.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(client.dataCadastro).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nenhum cliente encontrado
            </div>
          )}
        </div>
      </div>

      <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}