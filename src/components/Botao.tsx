import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Icone } from './Icone';
import { ALVO_MINIMO, cores, espaco, fonte } from '../theme/tema';
import type { NomeIcone } from '../theme/tema';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  icone?: NomeIcone;
  desabilitado?: boolean;
  carregando?: boolean;
  /** Frase extra lida por leitores de tela, explicando o que o botão faz. */
  dica?: string;
}

/** Botão grande (mín. 52 dp), com texto sempre visível e rótulo para leitor de tela. */
export function Botao({ titulo, onPress, variante = 'primario', icone, desabilitado, carregando, dica }: Props) {
  const inativo = Boolean(desabilitado || carregando);
  const corTexto = variante === 'primario' ? cores.primariaTexto : variante === 'perigo' ? cores.erro : cores.primaria;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: inativo, busy: Boolean(carregando) }}
      style={({ pressed }) => [
        estilos.base,
        variante === 'primario' && estilos.primario,
        variante === 'secundario' && estilos.secundario,
        variante === 'perigo' && estilos.perigo,
        inativo && estilos.inativo,
        pressed && estilos.pressionado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <>
          {icone ? <Icone nome={icone} tamanho={22} /> : null}
          <Text style={[estilos.texto, { color: corTexto }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: ALVO_MINIMO,
    borderRadius: 12,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: cores.superficie, borderWidth: 2, borderColor: cores.primaria },
  perigo: { backgroundColor: cores.superficie, borderWidth: 2, borderColor: cores.erro },
  inativo: { opacity: 0.5 },
  pressionado: { opacity: 0.8 },
  texto: { fontSize: fonte.corpo, fontWeight: '700', textAlign: 'center' },
});
