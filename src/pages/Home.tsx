import { useStore } from '../store/useStore';
import { Users, ArrowLeftRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function Home() {
  const clients = useStore((state) => state.clients);
  const transactions = useStore((state) => state.transactions);
  const alerts = useStore((state) => state.alerts);

  const totalClients = clients.length;
  const totalTransactions = transactions.length;
  const totalAlerts = alerts.length;
  const severeAlerts = alerts.filter((a) => a.severidade === 'Alta').length;

  // Data for charts
  const alertsBySeverity = [
    { name: 'Baixa', value: alerts.filter((a) => a.severidade === 'Baixa').length },
    { name: 'Média', value: alerts.filter((a) => a.severidade === 'Média').length },
    { name: 'Alta', value: alerts.filter((a) => a.severidade === 'Alta').length },
  ];

  const transactionsByType = [
    { tipo: 'Depósito', count: transactions.filter((t) => t.tipo === 'Depósito').length },
    { tipo: 'Saque', count: transactions.filter((t) => t.tipo === 'Saque').length },
    { tipo: 'Transferência', count: transactions.filter((t) => t.tipo === 'Transferência').length },
  ];

  const alertsByStatus = [
    { status: 'Novo', count: alerts.filter((a) => a.status === 'Novo').length },
    { status: 'Em Análise', count: alerts.filter((a) => a.status === 'Em Análise').length },
    { status: 'Resolvido', count: alerts.filter((a) => a.status === 'Resolvido').length },
  ];

  const COLORS = {
    Baixa: '#10b981',
    Média: '#f59e0b',
    Alta: '#ef4444',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">Dashboard</h1>
        <p className="text-[#666666] mt-1">Visão geral do sistema de compliance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666] mb-1">Total de Clientes</p>
              <p className="text-3xl font-bold text-[#333333]">{totalClients}</p>
            </div>
            <div className="bg-[#f5f5f5] p-3 rounded-lg">
              <Users className="size-8 text-[#666666]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666] mb-1">Total de Transações</p>
              <p className="text-3xl font-bold text-[#333333]">{totalTransactions}</p>
            </div>
            <div className="bg-[#f5f5f5] p-3 rounded-lg">
              <ArrowLeftRight className="size-8 text-[#666666]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666] mb-1">Total de Alertas</p>
              <p className="text-3xl font-bold text-[#333333]">{totalAlerts}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <AlertTriangle className="size-8 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666] mb-1">Alertas Severos</p>
              <p className="text-3xl font-bold text-[#e60028]">{severeAlerts}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <ShieldAlert className="size-8 text-[#e60028]" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transações por Tipo */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#333333] mb-4">Transações por Tipo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#e60028" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alertas por Severidade */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#333333] mb-4">Alertas por Severidade</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertsBySeverity}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {alertsBySeverity.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status dos Alertas */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-[#333333] mb-4">Status dos Alertas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={alertsByStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#333333" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}