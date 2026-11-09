import { Text } from 'react-native';
import { ICONES } from '../theme/icones';
import type { NomeIcone } from '../theme/icones';

interface Props {
  nome: NomeIcone;
  tamanho?: number;
}

/** Ícone decorativo: o significado sempre está no texto ao lado, então o leitor de tela o ignora. */
export function Icone({ nome, tamanho = 22 }: Props) {
  return (
    <Text
      allowFontScaling={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{ fontSize: tamanho, lineHeight: Math.round(tamanho * 1.3) }}
    >
      {ICONES[nome]}
    </Text>
  );
}
