import type { NivelRisco } from '../types';

export type { NomeIcone } from './icones';
import type { NomeIcone } from './icones';

/** Paleta de alto contraste (texto sobre fundo com razão de contraste acima de 4,5:1). */
export const cores = {
  fundo: '#F4F6F8',
  superficie: '#FFFFFF',
  texto: '#12202B',
  textoSuave: '#4A5A67',
  primaria: '#0B5CAD',
  primariaTexto: '#FFFFFF',
  borda: '#C5D0D9',
  erro: '#B3261E',
  avisoFundo: '#FFF4CE',
  avisoTexto: '#5C4400',
  infoFundo: '#E3F0FB',
  infoTexto: '#0B3D6B',
  sucessoFundo: '#E4F4E6',
  sucessoTexto: '#14461A',
} as const;

export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

/** Tamanhos de fonte generosos: o cidadão real não é especialista e pode ter baixa visão. */
export const fonte = { pequena: 15, corpo: 17, destaque: 20, titulo: 24, enorme: 34 } as const;

export const ALVO_MINIMO = 52; // altura mínima de botões e áreas tocáveis (dp)

interface VisualRisco {
  rotulo: string;
  icone: NomeIcone;
  fundo: string;
  texto: string;
}

/** O risco nunca depende só da cor: sempre há texto e ícone. */
export const VISUAL_RISCO: Record<NivelRisco, VisualRisco> = {
  NORMAL: { rotulo: 'SEM RISCO', icone: 'checkmark-circle', fundo: '#1B5E20', texto: '#FFFFFF' },
  ATENCAO: { rotulo: 'ATENÇÃO', icone: 'warning', fundo: '#FFC107', texto: '#1A1A1A' },
  ALERTA: { rotulo: 'ALERTA', icone: 'alert-circle', fundo: '#B71C1C', texto: '#FFFFFF' },
};
