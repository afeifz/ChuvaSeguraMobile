import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, fonte } from '../theme/tema';
import type { Gravidade, Ocorrencia } from '../types';
import { formatarDataHora } from '../utils/formatacao';
import { Botao } from './Botao';

export const ROTULO_GRAVIDADE: Record<Gravidade, string> = {
  LEVE: 'Leve',
  MEDIA: 'Média',
  GRAVE: 'Grave',
};

const COR_GRAVIDADE: Record<Gravidade, { fundo: string; texto: string }> = {
  LEVE: { fundo: '#E4F4E6', texto: '#14461A' },
  MEDIA: { fundo: '#FFF4CE', texto: '#5C4400' },
  GRAVE: { fundo: '#FBE3E1', texto: '#8C1D18' },
};

interface Props {
  ocorrencia: Ocorrencia;
  onExcluir: (ocorrencia: Ocorrencia) => void;
}

export function OcorrenciaCard({ ocorrencia, onExcluir }: Props) {
  const cor = COR_GRAVIDADE[ocorrencia.gravidade];
  const quando = formatarDataHora(ocorrencia.criadaEm);

  return (
    <View style={estilos.cartao}>
      <View
        accessible
        accessibilityLabel={`Ocorrência ${ROTULO_GRAVIDADE[ocorrencia.gravidade]} em ${ocorrencia.local}, ${quando}. ${ocorrencia.descricao}`}
        style={estilos.conteudo}
      >
        <View style={estilos.cabecalho}>
          <Text style={[estilos.gravidade, { backgroundColor: cor.fundo, color: cor.texto }]}>
            {ROTULO_GRAVIDADE[ocorrencia.gravidade]}
          </Text>
          <Text style={estilos.quando}>{quando}</Text>
        </View>
        <Text style={estilos.local}>{ocorrencia.local}</Text>
        <Text style={estilos.descricao}>{ocorrencia.descricao}</Text>
      </View>
      <Botao
        titulo="Excluir"
        icone="trash"
        variante="perigo"
        onPress={() => onExcluir(ocorrencia)}
        dica="Apaga esta ocorrência do aparelho"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { backgroundColor: cores.superficie, borderRadius: 16, padding: espaco.md, gap: espaco.md, borderWidth: 1, borderColor: cores.borda },
  conteudo: { gap: espaco.xs },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: espaco.sm },
  gravidade: { fontSize: fonte.pequena, fontWeight: '800', paddingHorizontal: espaco.sm, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
  quando: { fontSize: fonte.pequena, color: cores.textoSuave },
  local: { fontSize: fonte.corpo, fontWeight: '700', color: cores.texto },
  descricao: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 24 },
});
