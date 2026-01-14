import { create } from 'zustand';
import { Client, Transaction, Alert, User } from '../types';

// Base API
const API_BASE = "https://r3s6m368-5083.brs.devtunnels.ms/api";

interface AppState {
    countries: { id: string; name: string }[];
    fetchCountries: () => Promise<void>;
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

export const fetchFromAPI = async (endpoint: string, options: RequestInit = {}) => {
  const { accessToken, tokenType } = useStore.getState();

  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && tokenType ? { Authorization: `${tokenType} ${accessToken}` } : {}),
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, mergedOptions);
    if (!response.ok) {
      let errorBody: unknown = null;
      try {
        errorBody = await response.json();
      } catch {
        // ignore JSON parse errors
      }
      console.error(`HTTP error when calling ${endpoint}:`, response.status, errorBody);
      if (errorBody && typeof errorBody === 'object') {
        try {
          console.error('Validation details:', JSON.stringify(errorBody, null, 2));
        } catch {
          // ignore stringify errors
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as unknown;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

// Generic helper to fetch and merge all pages from a paginated endpoint.
// It understands plain arrays, { data: [...] }, { data: { items, page, totalPages } }, and { items, page, totalPages }.
const fetchAllPages = async (endpointBase: string): Promise<any[]> => {
  const fetchPage = async (page?: number) => {
    const endpoint = page ? `${endpointBase}?page=${page}` : endpointBase;
    const response = (await fetchFromAPI(endpoint)) as
      | { success?: boolean; data?: { items?: any[]; page?: number; totalPages?: number; pageSize?: number } | any[] }
      | { items?: any[]; page?: number; totalPages?: number; pageSize?: number }
      | any[]
      | null;

    let items: any[] = [];
    let currentPage = page ?? 1;
    let totalPages = 1;

    if (Array.isArray(response)) {
      items = response;
    } else if (response && typeof response === 'object') {
      const anyResponse: any = response as any;
      const data = anyResponse.data ?? anyResponse;

      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.items)) {
        items = data.items;
        currentPage = typeof data.page === 'number' ? data.page : currentPage;
        totalPages = typeof data.totalPages === 'number' ? data.totalPages : totalPages;
      } else if (Array.isArray(anyResponse.items)) {
        items = anyResponse.items;
        currentPage = typeof anyResponse.page === 'number' ? anyResponse.page : currentPage;
        totalPages = typeof anyResponse.totalPages === 'number' ? anyResponse.totalPages : totalPages;
      }
    }

    return { items, currentPage, totalPages };
  };

  const firstPage = await fetchPage();
  const allItems: any[] = [...firstPage.items];

  if (firstPage.totalPages > firstPage.currentPage) {
    for (let page = firstPage.currentPage + 1; page <= firstPage.totalPages; page += 1) {
      const nextPage = await fetchPage(page);
      allItems.push(...nextPage.items);
    }
  }

  return allItems;
};

export const useStore = create<AppState>((set, get) => ({
  countries: [],
  fetchCountries: async () => {
      const allItems = await fetchAllPages('countries');

      const countries = allItems.map((item) => ({
        id: item.id,
        name: item.name ?? item.countryName ?? item.isoCode ?? item.code ?? '',
      })).filter((c) => c.id && c.name);

      set({ countries });
    },
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
      body: JSON.stringify({ email, password }),
    }) as { email?: string; name?: string; accessToken: string; refreshToken: string; tokenType: string; expiresIn: number } | null;

    console.log('Login API response:', data);

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

  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresIn: null,
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
    const riskLevelMap: Record<string, number> = { Baixo: 0, Médio: 1, Alto: 2 };
    const kycStatusMap: Record<string, number> = { Pendente: 0, Aprovado: 1, Rejeitado: 2 };

    const payload = {
      name: clientData.nome,
      accountNumber: (clientData as any).accountNumber ?? '',
      bankCode: (clientData as any).bankCode ?? '',
      swiftOrBic: (clientData as any).swiftOrBic ?? '',
      riskLevel: riskLevelMap[clientData.nivelRisco] ?? 0,
      kycStatus: kycStatusMap[clientData.kycStatus] ?? 0,
      countryId: (clientData as any).countryId,
    };

    const response = await fetchFromAPI('clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    }) as any;

    if (response) {
      const newClient: Client = {
        id:
          response?.id ||
          response?.data?.id ||
          response?.data?.clientId ||
          Date.now().toString(),
        nome: clientData.nome,
        pais: (clientData as any).pais ?? '',
        nivelRisco: clientData.nivelRisco,
        kycStatus: clientData.kycStatus,
        dataCadastro: new Date().toISOString().split('T')[0],
      };

      set((state) => ({
        clients: [...state.clients, newClient],
      }));

      console.log('Client created successfully', newClient);
      console.log('Backend response: ', response);
      return true;
    }

    return false;
  },

  createTransaction: async (transactionData) => {
    const typeMap: Record<Transaction['tipo'], number> = {
      Depósito: 0,
      Saque: 1,
      Transferência: 2,
    };

    // Basic client-side validation to avoid obvious 400s
    if (!transactionData.clienteId) {
      console.error('createTransaction validation error: clienteId is required', transactionData);
      return false;
    }

    if (transactionData.valor == null || Number.isNaN(transactionData.valor) || transactionData.valor <= 0) {
      console.error('createTransaction validation error: valor must be a positive number', transactionData);
      return false;
    }

    const payload = {
      clientId: transactionData.clienteId,
      // No separate counterparty entity yet; backend can adjust later if needed
      counterpartyId: transactionData.clienteId,
      type: typeMap[transactionData.tipo] ?? 0,
      amount: transactionData.valor,
      // Align with GET /transactions response, which exposes currencyIsoCode
      currencyIsoCode: transactionData.moeda,
      // Align with GET /transactions response, which uses counterpartyName
      counterpartyName: transactionData.contraparte,
      occurredAt: new Date(transactionData.dataHora).toISOString(),
    };

    const response = await fetchFromAPI('transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response) {
      console.log('Transaction created successfully: ', payload);
      await get().fetchTransactions();
      return true;
    }

    return false;
  },

  updateAlertStatus: (id, status) =>
    set((state) => ({
      alerts: state.alerts.map((alert) => (alert.id === id ? { ...alert, status } : alert)),
    })),

  fetchClients: async () => {
    const allItems = await fetchAllPages('clients');

    const mappedClients: Client[] = allItems.map((item) => {
      const riskLevelMap: Record<number, Client['nivelRisco']> = {
        0: 'Baixo',
        1: 'Médio',
        2: 'Alto',
      };

      const kycStatusMap: Record<number, Client['kycStatus']> = {
        0: 'Pendente',
        1: 'Aprovado',
        2: 'Rejeitado',
      };

      return {
        id: item.id,
        nome: item.name,
        pais: item.countryName,
        nivelRisco: riskLevelMap[item.riskLevel] ?? 'Baixo',
        kycStatus: kycStatusMap[item.kycStatus] ?? 'Pendente',
        dataCadastro: new Date().toISOString().split('T')[0],
      };
    });

    set({ clients: mappedClients });
  },

  fetchTransactions: async () => {
    const allItems = await fetchAllPages('transactions');

    const mappedTransactions: Transaction[] = allItems.map((item) => {
      const typeMap: Record<number, Transaction['tipo']> = {
        0: 'Depósito',
        1: 'Saque',
        2: 'Transferência',
      };

      return {
        id: item.id,
        clienteId: item.clientId,
        tipo: typeMap[item.type] ?? 'Transferência',
        valor: item.amount,
        moeda: item.currencyIsoCode || item.currency,
        contraparte: item.counterpartyName,
        dataHora: item.occurredAt,
      };
    });

    set({ transactions: mappedTransactions });
  },

  fetchAlerts: async () => {
    const allItems = await fetchAllPages('alerts');

    const mappedAlerts: Alert[] = allItems.map((item) => {
      const severityMap: Record<number, Alert['severidade']> = {
        0: 'Baixa',
        1: 'Média',
        2: 'Alta',
      };

      const statusMap: Record<number, Alert['status']> = {
        0: 'Novo',
        1: 'Em Análise',
        2: 'Resolvido',
      };

      return {
        id: item.id,
        clienteId: item.clientId,
        transacaoId: item.transactionId,
        regra: item.alertPolicyName || item.alertTemplateName,
        severidade: severityMap[item.severity] ?? 'Média',
        status: statusMap[item.status] ?? 'Novo',
        dataHora: item.createdAt,
        descricao: item.notes || item.ruleSnapshot || '',
      };
    });

    set({ alerts: mappedAlerts });
  },

  fetchAllData: async () => {
    await get().fetchClients();
    await get().fetchTransactions();
    await get().fetchAlerts();
  },
}));