import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { ALVO_MINIMO, cores, espaco, fonte } from '../theme/tema';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string | null;
  dica?: string;
}

/** Campo de texto com rótulo visível acima (não só placeholder), mensagem de erro clara e acessível. */
export function Campo({ rotulo, erro, dica, multiline, style, ...resto }: Props) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        {...resto}
        multiline={multiline}
        accessibilityLabel={rotulo}
        accessibilityHint={dica}
        placeholderTextColor="#6B7A86"
        style={[estilos.campo, multiline && estilos.multilinha, erro ? estilos.campoComErro : null, style]}
      />
      {erro ? (
        <Text style={estilos.erro} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { gap: espaco.xs },
  rotulo: { fontSize: fonte.corpo, fontWeight: '600', color: cores.texto },
  campo: {
    minHeight: ALVO_MINIMO,
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: 12,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
    fontSize: fonte.corpo,
    color: cores.texto,
    backgroundColor: cores.superficie,
  },
  multilinha: { minHeight: 110, textAlignVertical: 'top' },
  campoComErro: { borderColor: cores.erro },
  erro: { fontSize: fonte.pequena, color: cores.erro, fontWeight: '600' },
});
