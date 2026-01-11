import { create } from 'zustand';
import { Client, Transaction, Alert, User } from '../types';

// Base API URL from environment variable
const API_BASE = (import.meta as any).env.VITE_API_BASE || 'http://localhost:8080';

interface AppState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  clients: Client[];
  transactions: Transaction[];
  alerts: Alert[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addClient: (client: Omit<Client, 'id' | 'dataCadastro'>) => void;
  createClient: (client: Omit<Client, 'id' | 'dataCadastro'>) => Promise<boolean>;
  createTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<boolean>;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  fetchClients: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchAllData: () => Promise<void>;
}

const fetchFromAPI = async (endpoint: string, options: RequestInit = {}) => {
  const { accessToken, tokenType } = useStore.getState();
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && tokenType ? { 'Authorization': `${tokenType} ${accessToken}` } : {}),
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, mergedOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  expiresIn: null,
  clients: [],
  transactions: [],
  alerts: [],

  login: async (email: string, password: string) => {
    // Mock authentication for demonstration
    if (email === 'admin@example.com' && password === 'admin') {
      set({ 
        user: { email: 'admin@example.com', name: 'Analista de Compliance [DEMO]' },
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      });
      return true;
    }

    const data = await fetchFromAPI('login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }) 
    });
    
    if (data) {
      set({ 
        user: { 
          email: data.email || email, 
          name: data.name || 'User',
        },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType,
        expiresIn: data.expiresIn,
      });
      
      console.log('Login successful:', data.email || email);
      return true;
    } else {
      return false;
    }
  },

  logout: () => set({ 
    user: null, 
    accessToken: null, 
    refreshToken: null, 
    tokenType: null, 
    expiresIn: null 
  }),

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

  createClient: async (clientData) => {
    const data = await fetchFromAPI('api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
    if (data) {
      // Assuming the API returns the full client object with id and dataCadastro
      set((state) => ({
        clients: [...state.clients, data],
      }));
      return true;
    }
    return false;
  },

  createTransaction: async (transactionData) => {
    const apiData = await fetchFromAPI('api/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
    
    if (!apiData) {
      return false;
    }

    set((state) => {
      const newTransaction: Transaction = {
        ...transactionData,
        id: apiData.id || Date.now().toString(),
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
    });

    return true;
  },

  updateAlertStatus: (id, status) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, status } : alert
      ),
    })),

  fetchClients: async () => {
    const data = await fetchFromAPI('api/clients');
    if (data) set({ clients: data });
  },

  fetchTransactions: async () => {
    const data = await fetchFromAPI('api/transactions');
    if (data) set({ transactions: data });
  },

  fetchAlerts: async () => {
    const data = await fetchFromAPI('api/alerts');
    if (data) set({ alerts: data });
  },

  fetchAllData: async () => {
    await get().fetchClients();
    await get().fetchTransactions();
    await get().fetchAlerts();
  },
}));
