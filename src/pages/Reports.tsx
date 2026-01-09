import { useState } from 'react';
import { useStore } from '../store/useStore';
import { FileDown, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Report } from '../types';

export function Reports() {
  const clients = useStore((state) => state.clients);
  const transactions = useStore((state) => state.transactions);
  const alerts = useStore((state) => state.alerts);
  
  const [filters, setFilters] = useState({
    clienteId: '',
    dataInicio: '',
    dataFim: '',
  });
  
  const [report, setReport] = useState<Report | null>(null);

  const generateReport = () => {
    if (!filters.clienteId || !filters.dataInicio || !filters.dataFim) {
      alert('Por favor, preencha todos os filtros');
      return;
    }

    const client = clients.find((c) => c.id === filters.clienteId);
    if (!client) return;

    const startDate = new Date(filters.dataInicio);
    const endDate = new Date(filters.dataFim + 'T23:59:59');

    const clientTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.dataHora);
      return (
        t.clienteId === filters.clienteId &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });

    const clientAlerts = alerts.filter((a) => {
      const alertDate = new Date(a.dataHora);
      return (
        a.clienteId === filters.clienteId &&
        alertDate >= startDate &&
        alertDate <= endDate
      );
    });

    const totalMovimentado = clientTransactions.reduce((sum, t) => sum + t.valor, 0);

    setReport({
      clienteId: client.id,
      nomeCliente: client.nome,
      totalMovimentado,
      numeroAlertas: clientAlerts.length,
      transacoes: clientTransactions,
    });
  };

  const exportToJSON = () => {
    if (!report) return;

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `relatorio_${report.nomeCliente.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToCSV = () => {
    if (!report) return;

    const csvRows = [
      ['Relatório de Cliente'],
      ['Nome', report.nomeCliente],
      ['Total Movimentado', report.totalMovimentado.toString()],
      ['Número de Alertas', report.numeroAlertas.toString()],
      [''],
      ['Transações'],
      ['ID', 'Tipo', 'Valor', 'Moeda', 'Contraparte', 'Data/Hora'],
      ...report.transacoes.map((t) => [
        t.id,
        t.tipo,
        t.valor.toString(),
        t.moeda,
        t.contraparte,
        t.dataHora,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `relatorio_${report.nomeCliente.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const transactionsByType = report
    ? [
        {
          tipo: 'Depósito',
          count: report.transacoes.filter((t) => t.tipo === 'Depósito').length,
          valor: report.transacoes
            .filter((t) => t.tipo === 'Depósito')
            .reduce((sum, t) => sum + t.valor, 0),
        },
        {
          tipo: 'Saque',
          count: report.transacoes.filter((t) => t.tipo === 'Saque').length,
          valor: report.transacoes
            .filter((t) => t.tipo === 'Saque')
            .reduce((sum, t) => sum + t.valor, 0),
        },
        {
          tipo: 'Transferência',
          count: report.transacoes.filter((t) => t.tipo === 'Transferência').length,
          valor: report.transacoes
            .filter((t) => t.tipo === 'Transferência')
            .reduce((sum, t) => sum + t.valor, 0),
        },
      ]
    : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">Relatórios</h1>
        <p className="text-[#666666] mt-1">Análise detalhada de clientes e transações</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Gerar Relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Selecionar Cliente
            </label>
            <select
              value={filters.clienteId}
              onChange={(e) => setFilters({ ...filters, clienteId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Escolha um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data Início
            </label>
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

        <button
          onClick={generateReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <BarChart3 className="size-5" />
          Gerar Relatório
        </button>
      </div>

      {/* Report Results */}
      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Cliente</p>
              <p className="text-2xl font-bold text-slate-800">{report.nomeCliente}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Total Movimentado</p>
              <p className="text-2xl font-bold text-green-600">
                {report.totalMovimentado.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-1">Número de Alertas</p>
              <p className="text-2xl font-bold text-red-600">{report.numeroAlertas}</p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={exportToJSON}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FileDown className="size-5" />
              Exportar JSON
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FileDown className="size-5" />
              Exportar CSV
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Transações por Tipo (Quantidade)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Transações por Tipo (Valor)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valor" fill="#10b981" name="Valor Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">
                Histórico de Transações ({report.transacoes.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Tipo
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Valor
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Moeda
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Contraparte
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Data/Hora
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.transacoes.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600">{transaction.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{transaction.tipo}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {transaction.valor.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{transaction.moeda}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {transaction.contraparte}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(transaction.dataHora).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {report.transacoes.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  Nenhuma transação encontrada no período selecionado
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!report && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <BarChart3 className="size-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">
            Selecione um cliente e período para gerar o relatório
          </p>
        </div>
      )}
    </div>
  );
}