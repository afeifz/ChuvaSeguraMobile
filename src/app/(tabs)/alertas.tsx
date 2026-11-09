import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AlertaCard } from '@/components/AlertaCard';
import { Aviso } from '@/components/Aviso';
import { EstadoVazio } from '@/components/EstadoVazio';
import { useConfiguracoes } from '@/context/ConfiguracoesContext';
import { useAlertas } from '@/hooks/useAlertas';
import { cores, espaco } from '@/theme/tema';

/** Alertas de alagamento enviados ao morador (os de maior prioridade primeiro). */
export default function TelaAlertas() {
  const router = useRouter();
  const { configuracoes } = useConfiguracoes();
  const { alertas, carregando, offline, erro, atualizar, marcarComoLido } = useAlertas();
  const [puxando, setPuxando] = useState(false);

  const cadastrado = configuracoes.modoDemo || configuracoes.moradorId !== null;

  useFocusEffect(
    useCallback(() => {
      if (cadastrado) void atualizar();
    }, [atualizar, cadastrado]),
  );

  const aoPuxar = async () => {
    setPuxando(true);
    await atualizar();
    setPuxando(false);
  };

  const aoMarcarLido = async (id: number) => {
    const mensagemErro = await marcarComoLido(id);
    if (mensagemErro) Alert.alert('Não foi possível marcar como lida', mensagemErro);
  };

  if (!cadastrado) {
    return (
      <View style={estilos.centro}>
        <EstadoVazio
          icone="person-add"
          titulo="Faça seu cadastro para receber alertas"
          texto="Informe seus dados na aba Perfil (use dados fictícios) e os alertas do seu bairro aparecerão aqui."
          acao={{ titulo: 'Ir para o cadastro', onPress: () => router.navigate('/perfil') }}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      data={alertas}
      keyExtractor={(alerta) => String(alerta.id)}
      refreshing={puxando}
      onRefresh={aoPuxar}
      ItemSeparatorComponent={() => <View style={estilos.separador} />}
      ListHeaderComponent={
        <View style={estilos.cabecalho}>
          {configuracoes.modoDemo ? (
            <Aviso tipo="info" texto="Modo demonstração: alertas de exemplo." />
          ) : null}
          {offline ? (
            <Aviso tipo="aviso" texto="Sem conexão com o servidor. Mostrando os últimos alertas salvos no aparelho." />
          ) : null}
        </View>
      }
      renderItem={({ item }) => <AlertaCard alerta={item} onMarcarLido={aoMarcarLido} />}
      ListEmptyComponent={
        carregando ? undefined : erro ? (
          <EstadoVazio
            icone="cloud-offline"
            titulo="Não foi possível carregar"
            texto={erro}
            acao={{ titulo: 'Tentar de novo', onPress: () => void atualizar() }}
          />
        ) : (
          <EstadoVazio
            icone="shield-checkmark"
            titulo="Nenhum alerta por enquanto"
            texto="Quando houver risco de alagamento no seu bairro, o aviso aparece aqui."
          />
        )
      }
    />
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.md, paddingBottom: espaco.xl },
  centro: { flex: 1, justifyContent: 'center', backgroundColor: cores.fundo },
  cabecalho: { gap: espaco.sm, marginBottom: espaco.sm },
  separador: { height: espaco.md },
});
