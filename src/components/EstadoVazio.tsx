import { StyleSheet, Text, View } from 'react-native';
import { Icone } from './Icone';
import { cores, espaco, fonte } from '../theme/tema';
import type { NomeIcone } from '../theme/tema';
import { Botao } from './Botao';

interface Props {
  icone: NomeIcone;
  titulo: string;
  texto?: string;
  acao?: { titulo: string; onPress: () => void };
}

/** Tela de "nada aqui ainda" ou de erro, sempre dizendo o que fazer a seguir. */
export function EstadoVazio({ icone, titulo, texto, acao }: Props) {
  return (
    <View style={estilos.caixa}>
      <Icone nome={icone} tamanho={56} />
      <Text style={estilos.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {texto ? <Text style={estilos.texto}>{texto}</Text> : null}
      {acao ? <Botao titulo={acao.titulo} onPress={acao.onPress} /> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { alignItems: 'center', gap: espaco.md, padding: espaco.lg },
  titulo: { fontSize: fonte.destaque, fontWeight: '700', color: cores.texto, textAlign: 'center' },
  texto: { fontSize: fonte.corpo, color: cores.textoSuave, textAlign: 'center' },
});
