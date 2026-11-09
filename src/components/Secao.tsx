import { StyleSheet, Text } from 'react-native';
import { cores, espaco, fonte } from '../theme/tema';

export function Secao({ titulo }: { titulo: string }) {
  return (
    <Text style={estilos.titulo} accessibilityRole="header">
      {titulo}
    </Text>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: fonte.destaque, fontWeight: '700', color: cores.texto, marginTop: espaco.sm },
});
