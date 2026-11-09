import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Botao } from '@/components/Botao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { OcorrenciaCard } from '@/components/OcorrenciaCard';
import { listarOcorrencias, removerOcorrencia } from '@/db/ocorrencias';
import { cores, espaco } from '@/theme/tema';
import type { Ocorrencia } from '@/types';

/** Ocorrências de alagamento registradas pelo próprio morador (ficam salvas no banco SQLite do aparelho). */
export default function TelaOcorrencias() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [itens, setItens] = useState<Ocorrencia[]>([]);
  const [carregado, setCarregado] = useState(false);

  const carregar = useCallback(async () => {
    setItens(await listarOcorrencias(db));
    setCarregado(true);
  }, [db]);

  // Recarrega sempre que a aba volta ao foco (por exemplo, depois de salvar uma ocorrência nova).
  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const confirmarExclusao = (ocorrencia: Ocorrencia) => {
    Alert.alert('Excluir ocorrência?', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await removerOcorrencia(db, ocorrencia.id);
          await carregar();
        },
      },
    ]);
  };

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      data={itens}
      keyExtractor={(item) => String(item.id)}
      ItemSeparatorComponent={() => <View style={estilos.separador} />}
      ListHeaderComponent={
        <View style={estilos.cabecalho}>
          <Botao
            titulo="Registrar ocorrência"
            icone="add-circle"
            onPress={() => router.push('/ocorrencia/nova')}
            dica="Abre o formulário para avisar que uma rua alagou"
          />
        </View>
      }
      renderItem={({ item }) => <OcorrenciaCard ocorrencia={item} onExcluir={confirmarExclusao} />}
      ListEmptyComponent={
        carregado ? (
          <EstadoVazio
            icone="document-text"
            titulo="Nenhuma ocorrência registrada"
            texto="Se uma rua alagar perto de você, registre aqui. Fica salvo no seu aparelho."
          />
        ) : undefined
      }
    />
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.md, paddingBottom: espaco.xl },
  cabecalho: { marginBottom: espaco.md },
  separador: { height: espaco.md },
});
