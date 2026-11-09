import type { Alerta, Configuracoes, NovoMorador, RiscoBairro } from '../types';
import {
  buscarAlertas,
  buscarRiscoBairro,
  cadastrarMorador,
  excluirMorador,
  marcarAlertaComoLido,
} from './api';
import { alertasMockLista, marcarAlertaMockComoLido, riscoBairroMock } from './mock';

/**
 * Fachada de dados: as telas pedem "o risco do bairro" ou "os alertas" e não precisam saber
 * se vieram das APIs reais ou do modo demonstração.
 */

export async function obterRiscoBairro(config: Configuracoes): Promise<RiscoBairro> {
  if (config.modoDemo) return riscoBairroMock(config.bairro);
  return buscarRiscoBairro(config.urlMonitoramento, config.bairro);
}

export async function obterAlertas(config: Configuracoes): Promise<Alerta[]> {
  if (config.modoDemo) return alertasMockLista();
  if (config.moradorId === null) return [];
  return buscarAlertas(config.urlAlertas, config.moradorId);
}

export async function lerAlerta(config: Configuracoes, alertaId: number): Promise<Alerta> {
  if (config.modoDemo) return marcarAlertaMockComoLido(alertaId);
  return marcarAlertaComoLido(config.urlAlertas, alertaId);
}

export async function cadastrar(config: Configuracoes, dados: NovoMorador): Promise<number> {
  if (config.modoDemo) return 1;
  return cadastrarMorador(config.urlAlertas, dados);
}

export async function excluirCadastro(config: Configuracoes, moradorId: number): Promise<void> {
  if (config.modoDemo) return;
  await excluirMorador(config.urlAlertas, moradorId);
}
