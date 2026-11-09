import type { Alerta, NivelRisco, NovoMorador, PontoRisco, RiscoBairro, StatusAlerta } from '../types';
import { somenteDigitos } from '../utils/validacao';

const TEMPO_LIMITE_MS = 8000;

/** Erro de chamada à API, com mensagem já pronta para mostrar ao cidadão. */
export class ApiError extends Error {
  status?: number;
  campos?: Record<string, string>;

  constructor(mensagem: string, status?: number, campos?: Record<string, string>) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos;
  }
}

interface ProblemaApi {
  title?: string;
  detail?: string;
  erros?: Record<string, string>;
  errors?: Record<string, string[]>;
}

async function converterErro(resposta: Response): Promise<ApiError> {
  let problema: ProblemaApi | null = null;
  try {
    problema = (await resposta.json()) as ProblemaApi;
  } catch {
    problema = null;
  }

  // O serviço Java manda "erros" (campo -> mensagem); o C# manda "errors" (campo -> lista).
  let campos: Record<string, string> | undefined = problema?.erros;
  if (!campos && problema?.errors) {
    campos = {};
    for (const [campo, mensagens] of Object.entries(problema.errors)) {
      campos[campo] = mensagens[0] ?? '';
    }
  }

  const padrao: Record<number, string> = {
    400: 'Alguns dados estão inválidos. Confira e tente de novo.',
    404: 'Não encontramos o que você pediu.',
    409: 'Essa informação já está cadastrada.',
  };
  const mensagem =
    problema?.detail ?? padrao[resposta.status] ?? 'O servidor teve um problema. Tente novamente em instantes.';
  return new ApiError(mensagem, resposta.status, campos);
}

async function requisitar<T>(baseUrl: string, caminho: string, init: RequestInit = {}): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  const cabecalhos: Record<string, string> = { Accept: 'application/json' };
  if (init.body) cabecalhos['Content-Type'] = 'application/json';

  try {
    const resposta = await fetch(`${baseUrl.replace(/\/+$/, '')}${caminho}`, {
      ...init,
      headers: cabecalhos,
      signal: controlador.signal,
    });

    if (!resposta.ok) {
      throw await converterErro(resposta);
    }
    if (resposta.status === 204) {
      return undefined as T;
    }
    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof ApiError) throw erro;
    throw new ApiError('Não foi possível conectar ao servidor. Confira a internet e os endereços na tela Perfil.');
  } finally {
    clearTimeout(temporizador);
  }
}

/** Os serviços usam grafias diferentes ("Atencao" no C#, "ATENCAO" no Java): padronizamos em maiúsculas. */
export function normalizarRisco(valor: string | null | undefined): NivelRisco {
  const texto = (valor ?? '').toUpperCase();
  if (texto === 'ALERTA') return 'ALERTA';
  if (texto === 'ATENCAO' || texto === 'ATENÇÃO') return 'ATENCAO';
  return 'NORMAL';
}

// ---------------------------------------------------------------------------------------------
// Serviço de Monitoramento (C#)
// ---------------------------------------------------------------------------------------------

interface PontoApi {
  pontoId: number;
  nome: string;
  risco: string;
  nivelAguaCm: number | null;
  ultimaLeituraEm: string | null;
  desatualizado: boolean;
}

interface RiscoBairroApi {
  bairro: string;
  risco: string;
  orientacao: string;
  algumDadoDesatualizado: boolean;
  pontos: PontoApi[];
}

export async function buscarRiscoBairro(urlMonitoramento: string, bairro: string): Promise<RiscoBairro> {
  const dados = await requisitar<RiscoBairroApi>(
    urlMonitoramento,
    `/api/bairros/${encodeURIComponent(bairro.trim())}/risco`,
  );

  const pontos: PontoRisco[] = dados.pontos.map((ponto) => ({
    pontoId: ponto.pontoId,
    nome: ponto.nome,
    risco: normalizarRisco(ponto.risco),
    nivelAguaCm: ponto.nivelAguaCm,
    ultimaLeituraEm: ponto.ultimaLeituraEm,
    desatualizado: ponto.desatualizado,
  }));

  return {
    bairro: dados.bairro,
    risco: normalizarRisco(dados.risco),
    orientacao: dados.orientacao,
    desatualizado: dados.algumDadoDesatualizado,
    pontos,
    consultadoEm: new Date().toISOString(),
  };
}

export async function testarMonitoramento(urlMonitoramento: string): Promise<void> {
  await requisitar<unknown>(urlMonitoramento, '/api/pontos?tamanho=1');
}

// ---------------------------------------------------------------------------------------------
// Serviço de Cadastro e Alertas (Java)
// ---------------------------------------------------------------------------------------------

interface AlertaApi {
  id: number;
  bairro: string;
  risco: string;
  nivelAguaCm: number;
  mensagem: string;
  prioridade: number;
  status: string;
  criadoEm: string;
  lidoEm: string | null;
}

interface PaginaApi<T> {
  itens: T[];
}

interface MoradorApi {
  id: number;
}

function paraAlerta(alerta: AlertaApi): Alerta {
  return {
    id: alerta.id,
    bairro: alerta.bairro,
    risco: normalizarRisco(alerta.risco),
    nivelAguaCm: alerta.nivelAguaCm,
    mensagem: alerta.mensagem,
    prioridade: alerta.prioridade,
    status: (alerta.status === 'LIDO' ? 'LIDO' : 'PENDENTE') as StatusAlerta,
    criadoEm: alerta.criadoEm,
    lidoEm: alerta.lidoEm,
  };
}

export async function buscarAlertas(urlAlertas: string, moradorId: number): Promise<Alerta[]> {
  const pagina = await requisitar<PaginaApi<AlertaApi>>(
    urlAlertas,
    `/api/moradores/${moradorId}/alertas?pagina=0&tamanho=50`,
  );
  return pagina.itens.map(paraAlerta);
}

export async function marcarAlertaComoLido(urlAlertas: string, alertaId: number): Promise<Alerta> {
  const alerta = await requisitar<AlertaApi>(urlAlertas, `/api/alertas/${alertaId}/lido`, { method: 'PATCH' });
  return paraAlerta(alerta);
}

export async function cadastrarMorador(urlAlertas: string, dados: NovoMorador): Promise<number> {
  const corpo = {
    nome: dados.nome.trim(),
    cpf: somenteDigitos(dados.cpf),
    telefone: somenteDigitos(dados.telefone),
    bairro: dados.bairro.trim(),
    logradouro: dados.logradouro.trim(),
    numero: dados.numero.trim(),
    mobilidadeReduzida: dados.mobilidadeReduzida,
  };
  const morador = await requisitar<MoradorApi>(urlAlertas, '/api/moradores', {
    method: 'POST',
    body: JSON.stringify(corpo),
  });
  return morador.id;
}

export async function excluirMorador(urlAlertas: string, moradorId: number): Promise<void> {
  await requisitar<void>(urlAlertas, `/api/moradores/${moradorId}`, { method: 'DELETE' });
}

export async function testarAlertas(urlAlertas: string): Promise<void> {
  await requisitar<unknown>(urlAlertas, '/api/moradores?tamanho=1');
}
