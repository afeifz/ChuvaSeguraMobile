import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { EstadoVazio } from '@/components/EstadoVazio';
import { PontoItem } from '@/components/PontoItem';
import { RiscoCard } from '@/components/RiscoCard';
import { Secao } from '@/components/Secao';
import { useConfiguracoes } from '@/context/ConfiguracoesContext';
import { useRiscoBairro } from '@/hooks/useRiscoBairro';
import { proximoNivelSimulado } from '@/services/mock';
import { cores, espaco, fonte } from '@/theme/tema';

const INTERVALO_ATUALIZACAO_MS = 30000;

/** Tela principal: o risco de alagamento do bairro, em texto grande e linguagem simples. */
export default function TelaRisco() {
  const { configuracoes } = useConfiguracoes();
  const { dados, carregando, offline, erro, atualizar } = useRiscoBairro();
  const [puxando, setPuxando] = useState(false);

  // Atualiza ao abrir a aba e a cada 30 segundos enquanto ela estiver na tela.
  useFocusEffect(
    useCallback(() => {
      void atualizar();
      const temporizador = setInterval(() => {
        void atualizar();
      }, INTERVALO_ATUALIZACAO_MS);
      return () => clearInterval(temporizador);
    }, [atualizar]),
  );

  const aoPuxar = async () => {
    setPuxando(true);
    await atualizar();
    setPuxando(false);
  };

  const simular = () => {
    proximoNivelSimulado();
    void atualizar();
  };

  if (carregando && !dados && !erro) {
    return (
      <View style={estilos.centro} accessibilityLabel="Carregando o risco do bairro">
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.textoCarregando}>Buscando o risco do seu bairro...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      refreshControl={<RefreshControl refreshing={puxando} onRefresh={aoPuxar} />}
    >
      {configuracoes.modoDemo ? (
        <Aviso
          tipo="info"
          texto="Modo demonstração: os dados abaixo são de exemplo. Para usar as APIs de verdade, desligue na aba Perfil."
        />
      ) : null}

      {offline ? (
        <Aviso tipo="aviso" texto="Sem conexão com o servidor. Mostrando o último dado salvo no aparelho." />
      ) : null}

      {erro && !dados ? (
        <EstadoVazio
          icone="cloud-offline"
          titulo="Não foi possível carregar"
          texto={erro}
          acao={{ titulo: 'Tentar de novo', onPress: () => void atualizar() }}
        />
      ) : null}

      {dados ? (
        <>
          <RiscoCard
            risco={dados.risco}
            bairro={dados.bairro}
            orientacao={dados.orientacao}
            consultadoEm={dados.consultadoEm}
            desatualizado={dados.desatualizado}
          />

          <Secao titulo="Pontos de monitoramento" />
          <View style={estilos.lista}>
            {dados.pontos.map((ponto) => (
              <PontoItem key={ponto.pontoId} ponto={ponto} />
            ))}
          </View>

          <Botao
            titulo="Atualizar agora"
            icone="refresh"
            variante="secundario"
            onPress={() => void atualizar()}
            carregando={carregando}
            dica="Busca o risco mais recente do seu bairro"
          />

          {configuracoes.modoDemo ? (
            <Botao
              titulo="Simular outro nível de risco"
              icone="swap-horizontal"
              variante="secundario"
              onPress={simular}
              dica="Alterna entre sem risco, atenção e alerta, só para demonstração"
            />
          ) : null}

          <Text style={estilos.rodape}>A tela se atualiza sozinha a cada 30 segundos. Puxe para baixo para atualizar.</Text>
        </>
      ) : null}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.md, gap: espaco.md, paddingBottom: espaco.xl },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espaco.md, backgroundColor: cores.fundo },
  textoCarregando: { fontSize: fonte.corpo, color: cores.textoSuave },
  lista: { gap: espaco.sm },
  rodape: { fontSize: fonte.pequena, color: cores.textoSuave, textAlign: 'center' },
});
