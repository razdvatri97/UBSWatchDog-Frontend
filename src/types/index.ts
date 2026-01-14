export interface Client {
  id: string;
  nome: string;
  pais: string;
  nivelRisco: 'Baixo' | 'Médio' | 'Alto';
  kycStatus: 'Pendente' | 'Aprovado' | 'Rejeitado';
  dataCadastro: string;
}

export interface Transaction {
  id: string;
  clienteId: string;
  tipo: 'Depósito' | 'Saque' | 'Transferência';
  valor: number;
  moeda: string;
  contraparte: string;
  dataHora: string;
}

export interface Alert {
  id: string;
  clienteId: string;
  transacaoId: string;
  regra: string;
  severidade: 'Baixa' | 'Média' | 'Alta';
  status: 'Novo' | 'Em Análise' | 'Resolvido';
  dataHora: string;
  descricao: string;
}

export interface Report {
  clienteId: string;
  nomeCliente: string;
  totalMovimentado: number;
  numeroAlertas: number;
  transacoes: Transaction[];
}

export interface User {
  username: string;
  name: string;
}
