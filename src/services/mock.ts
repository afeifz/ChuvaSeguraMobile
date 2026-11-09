import type { Alerta, NivelRisco, PontoRisco, RiscoBairro } from '../types';

/**
 * Dados de EXEMPLO (fictícios) usados no modo demonstração, quando as APIs não estão no ar.
 * Permite mostrar o app funcionando e simular os três níveis de risco.
 */

const SEQUENCIA: NivelRisco[] = ['NORMAL', 'ATENCAO', 'ALERTA'];
let nivelSimulado: NivelRisco = 'NORMAL';

export function proximoNivelSimulado(): NivelRisco {
  const indice = SEQUENCIA.indexOf(nivelSimulado);
  nivelSimulado = SEQUENCIA[(indice + 1) % SEQUENCIA.length];
  return nivelSimulado;
}

const NIVEL_AGUA: Record<NivelRisco, number> = { NORMAL: 12, ATENCAO: 40, ALERTA: 65 };

const ORIENTACAO: Record<NivelRisco, string> = {
  NORMAL: 'Sem risco de alagamento no momento. Continue acompanhando.',
  ATENCAO: 'O nível da água está subindo. Fique atento e prepare-se.',
  ALERTA: 'Risco alto de alagamento. Proteja seus pertences e evite sair pela rua.',
};

export function riscoBairroMock(bairro: string): RiscoBairro {
  const agora = new Date().toISOString();
  const nivel = nivelSimulado;
  const pontos: PontoRisco[] = [
    {
      pontoId: 1,
      nome: 'Ponto Ipiranga 01 (simulado)',
      risco: nivel,
      nivelAguaCm: NIVEL_AGUA[nivel],
      ultimaLeituraEm: agora,
      desatualizado: false,
    },
    {
      pontoId: 2,
      nome: 'Ponto Ipiranga 02 (simulado)',
      risco: 'NORMAL',
      nivelAguaCm: 8,
      ultimaLeituraEm: agora,
      desatualizado: false,
    },
  ];
  return {
    bairro: bairro.trim() || 'Ipiranga',
    risco: nivel,
    orientacao: ORIENTACAO[nivel],
    desatualizado: false,
    pontos,
    consultadoEm: agora,
  };
}

function minutosAtras(minutos: number): string {
  return new Date(Date.now() - minutos * 60000).toISOString();
}

let alertasMock: Alerta[] = [
  {
    id: 1,
    bairro: 'Ipiranga',
    risco: 'ALERTA',
    nivelAguaCm: 65,
    mensagem:
      'ALERTA de alagamento no Ipiranga: a água chegou a 65 cm. Proteja seus pertences e evite sair de casa. ' +
      'Se precisar de ajuda para sair, peça apoio a um vizinho ou ligue 199 (Defesa Civil).',
    prioridade: 1,
    status: 'PENDENTE',
    criadoEm: minutosAtras(12),
    lidoEm: null,
  },
  {
    id: 2,
    bairro: 'Ipiranga',
    risco: 'ATENCAO',
    nivelAguaCm: 40,
    mensagem: 'ATENÇÃO no Ipiranga: a água está subindo (40 cm). Prepare-se e fique atento.',
    prioridade: 1,
    status: 'LIDO',
    criadoEm: minutosAtras(95),
    lidoEm: minutosAtras(90),
  },
];

export function alertasMockLista(): Alerta[] {
  return alertasMock.map((alerta) => ({ ...alerta }));
}

export function marcarAlertaMockComoLido(id: number): Alerta {
  alertasMock = alertasMock.map((alerta) =>
    alerta.id === id && alerta.status === 'PENDENTE'
      ? { ...alerta, status: 'LIDO', lidoEm: new Date().toISOString() }
      : alerta,
  );
  const encontrado = alertasMock.find((alerta) => alerta.id === id);
  if (!encontrado) {
    throw new Error('Alerta de exemplo não encontrado.');
  }
  return { ...encontrado };
}
