/** Níveis de risco, no mesmo padrão usado pelos serviços (C# e Java). */
export type NivelRisco = 'NORMAL' | 'ATENCAO' | 'ALERTA';
export type StatusAlerta = 'PENDENTE' | 'LIDO';
export type Gravidade = 'LEVE' | 'MEDIA' | 'GRAVE';

export interface PontoRisco {
  pontoId: number;
  nome: string;
  risco: NivelRisco;
  nivelAguaCm: number | null;
  ultimaLeituraEm: string | null;
  desatualizado: boolean;
}

export interface RiscoBairro {
  bairro: string;
  risco: NivelRisco;
  orientacao: string;
  desatualizado: boolean;
  pontos: PontoRisco[];
  /** Quando o app buscou este dado (ISO). */
  consultadoEm: string;
}

export interface Alerta {
  id: number;
  bairro: string;
  risco: NivelRisco;
  nivelAguaCm: number;
  mensagem: string;
  /** 1 = morador com mobilidade reduzida (prioritário); 2 = demais. */
  prioridade: number;
  status: StatusAlerta;
  criadoEm: string;
  lidoEm: string | null;
}

export interface Ocorrencia {
  id: number;
  local: string;
  descricao: string;
  gravidade: Gravidade;
  criadaEm: string;
}

export interface Configuracoes {
  bairro: string;
  urlMonitoramento: string;
  urlAlertas: string;
  modoDemo: boolean;
  moradorId: number | null;
  nomeMorador: string | null;
}

export interface NovoMorador {
  nome: string;
  cpf: string;
  telefone: string;
  bairro: string;
  logradouro: string;
  numero: string;
  mobilidadeReduzida: boolean;
}
