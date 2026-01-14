import { create } from 'zustand';
import { Client, Transaction, Alert, User } from '../types';

// Base API URL from environment variable
const API_BASE = (import.meta as any).env.VITE_API_BASE || 'http://localhost:8080';

interface AppState {
  user: User | null;
  clients: Client[];
  transactions: Transaction[];
  alerts: Alert[];
  sidebarOpen: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addClient: (client: Omit<Client, 'id' | 'dataCadastro'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

// Mock data for demonstration purposes
const mockClients: Client[] = [
  {
    id: '1',
    nome: 'João Silva',
    pais: 'Brasil',
    nivelRisco: 'Baixo',
    kycStatus: 'Aprovado',
    dataCadastro: '2024-01-15',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    pais: 'Portugal',
    nivelRisco: 'Médio',
    kycStatus: 'Aprovado',
    dataCadastro: '2024-02-20',
  },
  {
    id: '3',
    nome: 'Peter Mueller',
    pais: 'Alemanha',
    nivelRisco: 'Baixo',
    kycStatus: 'Aprovado',
    dataCadastro: '2024-03-10',
  },
  {
    id: '4',
    nome: 'Carlos Rodriguez',
    pais: 'Panamá',
    nivelRisco: 'Alto',
    kycStatus: 'Pendente',
    dataCadastro: '2024-11-05',
  },
  {
    id: '5',
    nome: 'Anna Kowalski',
    pais: 'Polônia',
    nivelRisco: 'Médio',
    kycStatus: 'Aprovado',
    dataCadastro: '2024-09-12',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    clienteId: '1',
    tipo: 'Depósito',
    valor: 15000,
    moeda: 'BRL',
    contraparte: 'Conta Salário',
    dataHora: '2025-01-05T10:30:00',
  },
  {
    id: '2',
    clienteId: '1',
    tipo: 'Transferência',
    valor: 8000,
    moeda: 'BRL',
    contraparte: 'Maria Santos',
    dataHora: '2025-01-06T14:20:00',
  },
  {
    id: '3',
    clienteId: '2',
    tipo: 'Saque',
    valor: 5000,
    moeda: 'EUR',
    contraparte: 'ATM Lisboa',
    dataHora: '2025-01-05T16:45:00',
  },
  {
    id: '4',
    clienteId: '4',
    tipo: 'Transferência',
    valor: 45000,
    moeda: 'USD',
    contraparte: 'Offshore Corp',
    dataHora: '2025-01-06T09:15:00',
  },
  {
    id: '5',
    clienteId: '4',
    tipo: 'Transferência',
    valor: 38000,
    moeda: 'USD',
    contraparte: 'Foreign Account',
    dataHora: '2025-01-06T11:30:00',
  },
  {
    id: '6',
    clienteId: '3',
    tipo: 'Depósito',
    valor: 12000,
    moeda: 'EUR',
    contraparte: 'Salário',
    dataHora: '2025-01-04T08:00:00',
  },
  {
    id: '7',
    clienteId: '1',
    tipo: 'Transferência',
    valor: 3500,
    moeda: 'BRL',
    contraparte: 'Fornecedor A',
    dataHora: '2025-01-07T10:00:00',
  },
  {
    id: '8',
    clienteId: '1',
    tipo: 'Transferência',
    valor: 3200,
    moeda: 'BRL',
    contraparte: 'Fornecedor B',
    dataHora: '2025-01-07T11:00:00',
  },
  {
    id: '9',
    clienteId: '1',
    tipo: 'Transferência',
    valor: 3800,
    moeda: 'BRL',
    contraparte: 'Fornecedor C',
    dataHora: '2025-01-07T15:00:00',
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    clienteId: '4',
    transacaoId: '4',
    regra: 'Transferência Internacional para País de Risco',
    severidade: 'Alta',
    status: 'Novo',
    dataHora: '2025-01-06T09:20:00',
    descricao: 'Transferência de USD 45.000 para país de alto risco (Panamá)',
  },
  {
    id: '2',
    clienteId: '4',
    transacaoId: '5',
    regra: 'Limite Diário Excedido',
    severidade: 'Alta',
    status: 'Novo',
    dataHora: '2025-01-06T11:35:00',
    descricao: 'Total de transações diárias ultrapassou USD 50.000',
  },
  {
    id: '3',
    clienteId: '1',
    transacaoId: '7',
    regra: 'Possível Fracionamento',
    severidade: 'Média',
    status: 'Em Análise',
    dataHora: '2025-01-07T15:05:00',
    descricao: 'Múltiplas transferências pequenas detectadas no mesmo dia (3 transações)',
  },
  {
    id: '4',
    clienteId: '2',
    transacaoId: '3',
    regra: 'Limite Diário Excedido',
    severidade: 'Baixa',
    status: 'Resolvido',
    dataHora: '2025-01-05T16:50:00',
    descricao: 'Saque próximo ao limite diário permitido',
  },
];

export const useStore = create<AppState>((set) => ({
  user: null,
  clients: mockClients,
  transactions: mockTransactions,
  alerts: mockAlerts,
  sidebarOpen: false,

  login: async (username: string, password: string) => {
    // Mock authentication for demonstration
    if (username === 'admin' && password === 'admin') {
      set({ user: { username: 'admin', 
            name: 'Analista de Compliance [DEMO]' } });
      return true;
    }

    // HTTP request to backend endpoint
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Update user state with response data
      set({ 
        user: { 
          username: data.username, 
          name: data.name,
        } 
      });
      
      console.log('Login successful:', data.username);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => set({ user: null }),

  addClient: (clientData) =>
    set((state) => ({
      clients: [
        ...state.clients,
        {
          ...clientData,
          id: Date.now().toString(),
          dataCadastro: new Date().toISOString().split('T')[0],
        },
      ],
    })),

  addTransaction: (transactionData) =>
    set((state) => {
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
      };

      // Check compliance rules and create alerts
      const newAlerts: Alert[] = [];
      const client = state.clients.find((c) => c.id === transactionData.clienteId);

      // Rule 1: Daily limit check (example: BRL 20000, USD 50000, EUR 40000)
      const limits: Record<string, number> = { BRL: 20000, USD: 50000, EUR: 40000 };
      const today = new Date().toISOString().split('T')[0];
      const todayTransactions = [
        ...state.transactions.filter(
          (t) =>
            t.clienteId === transactionData.clienteId &&
            t.dataHora.startsWith(today) &&
            t.moeda === transactionData.moeda
        ),
        newTransaction,
      ];
      const totalToday = todayTransactions.reduce((sum, t) => sum + t.valor, 0);
      
      if (limits[transactionData.moeda] && totalToday > limits[transactionData.moeda]) {
        newAlerts.push({
          id: `alert-${Date.now()}-1`,
          clienteId: transactionData.clienteId,
          transacaoId: newTransaction.id,
          regra: 'Limite Diário Excedido',
          severidade: 'Alta',
          status: 'Novo',
          dataHora: new Date().toISOString(),
          descricao: `Total de transações diárias ultrapassou ${transactionData.moeda} ${limits[transactionData.moeda].toLocaleString()}`,
        });
      }

      // Rule 2: High risk country transfer
      const highRiskCountries = ['Panamá', 'Ilhas Cayman', 'Bahamas', 'Malta'];
      if (
        transactionData.tipo === 'Transferência' &&
        client &&
        highRiskCountries.includes(client.pais)
      ) {
        newAlerts.push({
          id: `alert-${Date.now()}-2`,
          clienteId: transactionData.clienteId,
          transacaoId: newTransaction.id,
          regra: 'Transferência Internacional para País de Risco',
          severidade: 'Alta',
          status: 'Novo',
          dataHora: new Date().toISOString(),
          descricao: `Transferência para país de alto risco (${client.pais})`,
        });
      }

      // Rule 3: Structuring detection (multiple small transactions)
      const recentTransactions = todayTransactions.filter((t) => t.tipo === 'Transferência');
      if (recentTransactions.length >= 3 && transactionData.tipo === 'Transferência') {
        newAlerts.push({
          id: `alert-${Date.now()}-3`,
          clienteId: transactionData.clienteId,
          transacaoId: newTransaction.id,
          regra: 'Possível Fracionamento',
          severidade: 'Média',
          status: 'Novo',
          dataHora: new Date().toISOString(),
          descricao: `Múltiplas transferências detectadas no mesmo dia (${recentTransactions.length} transações)`,
        });
      }

      return {
        transactions: [...state.transactions, newTransaction],
        alerts: [...state.alerts, ...newAlerts],
      };
    }),

  updateAlertStatus: (id, status) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, status } : alert
      ),
    })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
