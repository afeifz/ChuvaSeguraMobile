import { StyleSheet, Text, View } from 'react-native';
import { Icone } from './Icone';
import { cores, espaco, fonte } from '../theme/tema';
import type { NomeIcone } from '../theme/tema';

interface Props {
  tipo: 'info' | 'aviso' | 'sucesso';
  texto: string;
  icone?: NomeIcone;
}

const PALETA = {
  info: { fundo: cores.infoFundo, texto: cores.infoTexto, icone: 'information-circle' as NomeIcone },
  aviso: { fundo: cores.avisoFundo, texto: cores.avisoTexto, icone: 'cloud-offline' as NomeIcone },
  sucesso: { fundo: cores.sucessoFundo, texto: cores.sucessoTexto, icone: 'checkmark-circle' as NomeIcone },
};

/** Faixa de aviso (modo demonstração, sem conexão etc.). Sempre com ícone e texto. */
export function Aviso({ tipo, texto, icone }: Props) {
  const paleta = PALETA[tipo];
  return (
    <View style={[estilos.caixa, { backgroundColor: paleta.fundo }]} accessible accessibilityLabel={texto}>
      <Icone nome={icone ?? paleta.icone} tamanho={24} />
      <Text style={[estilos.texto, { color: paleta.texto }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, padding: espaco.md, borderRadius: 12 },
  texto: { flex: 1, fontSize: fonte.pequena + 1, fontWeight: '600' },
});
