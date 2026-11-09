import { StyleSheet, Text, View } from 'react-native';
import { Icone } from './Icone';
import { espaco, fonte, VISUAL_RISCO } from '../theme/tema';
import type { NivelRisco } from '../types';
import { formatarHora } from '../utils/formatacao';

interface Props {
  risco: NivelRisco;
  bairro: string;
  orientacao: string;
  consultadoEm: string;
  desatualizado: boolean;
}

/** Cartão principal da tela inicial: o risco do bairro em texto grande, com ícone e orientação simples. */
export function RiscoCard({ risco, bairro, orientacao, consultadoEm, desatualizado }: Props) {
  const visual = VISUAL_RISCO[risco];
  const rodape = desatualizado
    ? 'Atenção: os sensores estão sem leitura recente.'
    : `Atualizado às ${formatarHora(consultadoEm)}`;

  return (
    <View
      style={[estilos.cartao, { backgroundColor: visual.fundo }]}
      accessible
      accessibilityRole="summary"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Risco de alagamento no bairro ${bairro}: ${visual.rotulo}. ${orientacao}. ${rodape}`}
    >
      <Icone nome={visual.icone} tamanho={72} />
      <Text style={[estilos.bairro, { color: visual.texto }]}>{bairro}</Text>
      <Text style={[estilos.rotulo, { color: visual.texto }]}>{visual.rotulo}</Text>
      <Text style={[estilos.orientacao, { color: visual.texto }]}>{orientacao}</Text>
      <Text style={[estilos.rodape, { color: visual.texto }]}>{rodape}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { borderRadius: 20, padding: espaco.lg, alignItems: 'center', gap: espaco.sm },
  bairro: { fontSize: fonte.destaque, fontWeight: '600' },
  rotulo: { fontSize: fonte.enorme, fontWeight: '800', letterSpacing: 1 },
  orientacao: { fontSize: fonte.destaque, textAlign: 'center', fontWeight: '500' },
  rodape: { fontSize: fonte.pequena, marginTop: espaco.xs, fontWeight: '600' },
});
