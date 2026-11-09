import { Platform } from 'react-native';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Configuracoes } from '../types';

/**
 * No emulador Android o "localhost" do computador é 10.0.2.2.
 * Em celular de verdade, troque pelo IP do computador na tela Perfil (ex.: http://192.168.0.10:5080).
 */
const HOST_PADRAO = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const CONFIGURACOES_PADRAO: Configuracoes = {
  bairro: 'Ipiranga',
  urlMonitoramento: `http://${HOST_PADRAO}:5080`,
  urlAlertas: `http://${HOST_PADRAO}:8080`,
  modoDemo: true,
  moradorId: null,
  nomeMorador: null,
};

interface LinhaConfiguracao {
  chave: string;
  valor: string;
}

export async function carregarConfiguracoes(db: SQLiteDatabase): Promise<Configuracoes> {
  const linhas = await db.getAllAsync<LinhaConfiguracao>('SELECT chave, valor FROM configuracoes');
  const mapa = new Map(linhas.map((linha) => [linha.chave, linha.valor]));

  const moradorId = mapa.get('moradorId');

  return {
    bairro: mapa.get('bairro') ?? CONFIGURACOES_PADRAO.bairro,
    urlMonitoramento: mapa.get('urlMonitoramento') ?? CONFIGURACOES_PADRAO.urlMonitoramento,
    urlAlertas: mapa.get('urlAlertas') ?? CONFIGURACOES_PADRAO.urlAlertas,
    modoDemo: mapa.has('modoDemo') ? mapa.get('modoDemo') === 'true' : CONFIGURACOES_PADRAO.modoDemo,
    moradorId: moradorId !== undefined && moradorId !== '' ? Number(moradorId) : null,
    nomeMorador: mapa.get('nomeMorador') ?? null,
  };
}

/** Grava (ou apaga, quando o valor é null) uma configuração. */
export async function gravarConfiguracao(
  db: SQLiteDatabase,
  chave: keyof Configuracoes,
  valor: string | number | boolean | null,
): Promise<void> {
  if (valor === null) {
    await db.runAsync('DELETE FROM configuracoes WHERE chave = ?', [chave]);
    return;
  }
  await db.runAsync('INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES (?, ?)', [chave, String(valor)]);
}
