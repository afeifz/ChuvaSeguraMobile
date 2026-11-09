import { StyleSheet, Text, View } from 'react-native';
import { Icone } from './Icone';
import { cores, espaco, fonte, VISUAL_RISCO } from '../theme/tema';
import type { Alerta } from '../types';
import { formatarNivel, tempoRelativo } from '../utils/formatacao';
import { Botao } from './Botao';

interface Props {
  alerta: Alerta;
  onMarcarLido: (id: number) => void;
}

export function AlertaCard({ alerta, onMarcarLido }: Props) {
  const visual = VISUAL_RISCO[alerta.risco];
  const nova = alerta.status === 'PENDENTE';
  const quando = tempoRelativo(alerta.criadoEm);

  return (
    <View style={[estilos.cartao, nova && estilos.cartaoNovo]}>
      <View
        accessible
        accessibilityLabel={`${nova ? 'Alerta novo' : 'Alerta lido'}. ${visual.rotulo}, ${quando}. ${
          alerta.prioridade === 1 ? 'Prioritário. ' : ''
        }${alerta.mensagem}`}
        style={estilos.conteudo}
      >
        <View style={estilos.cabecalho}>
          <View style={[estilos.selo, { backgroundColor: visual.fundo }]}>
            <Icone nome={visual.icone} tamanho={20} />
            <Text style={[estilos.seloTexto, { color: visual.texto }]}>{visual.rotulo}</Text>
          </View>
          <Text style={estilos.quando}>{quando}</Text>
        </View>

        <Text style={estilos.mensagem}>{alerta.mensagem}</Text>

        <View style={estilos.rodape}>
          <Text style={estilos.meta}>Água em {formatarNivel(alerta.nivelAguaCm)}</Text>
          {alerta.prioridade === 1 ? <Text style={estilos.prioridade}>Prioritário</Text> : null}
          <Text style={[estilos.status, nova ? estilos.statusNovo : estilos.statusLido]}>{nova ? 'Nova' : 'Lida'}</Text>
        </View>
      </View>

      {nova ? (
        <Botao
          titulo="Marcar como lida"
          icone="checkmark-done"
          variante="secundario"
          onPress={() => onMarcarLido(alerta.id)}
          dica="Avisa que você já viu este alerta"
        />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: espaco.md,
    gap: espaco.md,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  cartaoNovo: { borderWidth: 2, borderColor: cores.primaria },
  conteudo: { gap: espaco.sm },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: espaco.sm },
  selo: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs, paddingHorizontal: espaco.sm, paddingVertical: espaco.xs, borderRadius: 20 },
  seloTexto: { fontSize: fonte.pequena, fontWeight: '800' },
  quando: { fontSize: fonte.pequena, color: cores.textoSuave },
  mensagem: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 24 },
  rodape: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: espaco.sm },
  meta: { fontSize: fonte.pequena, color: cores.textoSuave },
  prioridade: { fontSize: fonte.pequena, fontWeight: '700', color: cores.infoTexto, backgroundColor: cores.infoFundo, paddingHorizontal: espaco.sm, paddingVertical: 2, borderRadius: 8 },
  status: { fontSize: fonte.pequena, fontWeight: '700', paddingHorizontal: espaco.sm, paddingVertical: 2, borderRadius: 8 },
  statusNovo: { color: cores.primariaTexto, backgroundColor: cores.primaria },
  statusLido: { color: cores.textoSuave, backgroundColor: cores.fundo },
});
