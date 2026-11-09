import { StyleSheet, Text, View } from 'react-native';
import { Icone } from './Icone';
import { cores, espaco, fonte, VISUAL_RISCO } from '../theme/tema';
import type { PontoRisco } from '../types';
import { formatarHora, formatarNivel } from '../utils/formatacao';

export function PontoItem({ ponto }: { ponto: PontoRisco }) {
  const visual = VISUAL_RISCO[ponto.risco];
  const leitura = ponto.ultimaLeituraEm ? `última leitura às ${formatarHora(ponto.ultimaLeituraEm)}` : 'sem leitura ainda';

  return (
    <View
      style={estilos.linha}
      accessible
      accessibilityLabel={`${ponto.nome}. Água em ${formatarNivel(ponto.nivelAguaCm)}. Risco: ${visual.rotulo}. ${leitura}`}
    >
      <View style={[estilos.selo, { backgroundColor: visual.fundo }]}>
        <Icone nome={visual.icone} tamanho={26} />
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.nome}>{ponto.nome}</Text>
        <Text style={estilos.detalhe}>
          Água em {formatarNivel(ponto.nivelAguaCm)} · {visual.rotulo}
        </Text>
        <Text style={estilos.detalhe}>{leitura}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    backgroundColor: cores.superficie,
    borderRadius: 12,
    padding: espaco.md,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  selo: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1, gap: 2 },
  nome: { fontSize: fonte.corpo, fontWeight: '700', color: cores.texto },
  detalhe: { fontSize: fonte.pequena, color: cores.textoSuave },
});
