import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { carregarConfiguracoes, CONFIGURACOES_PADRAO, gravarConfiguracao } from '../db/configuracoes';
import { cores, espaco, fonte } from '../theme/tema';
import type { Configuracoes } from '../types';

interface ValorContexto {
  configuracoes: Configuracoes;
  /** Salva uma ou mais configurações no banco e atualiza o app. */
  salvar: (parcial: Partial<Configuracoes>) => Promise<void>;
}

const ConfiguracoesContext = createContext<ValorContexto | null>(null);

/** Carrega as preferências do banco SQLite e as disponibiliza para todas as telas. */
export function ConfiguracoesProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>(CONFIGURACOES_PADRAO);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    let ativo = true;
    carregarConfiguracoes(db)
      .then((lidas) => {
        if (ativo) setConfiguracoes(lidas);
      })
      .catch(() => {
        // Se der erro ao ler, seguimos com os valores padrão.
      })
      .finally(() => {
        if (ativo) setCarregado(true);
      });
    return () => {
      ativo = false;
    };
  }, [db]);

  const salvar = useCallback(
    async (parcial: Partial<Configuracoes>) => {
      const chaves = Object.keys(parcial) as Array<keyof Configuracoes>;
      for (const chave of chaves) {
        await gravarConfiguracao(db, chave, parcial[chave] ?? null);
      }
      setConfiguracoes((atual) => ({ ...atual, ...parcial }));
    },
    [db],
  );

  const valor = useMemo(() => ({ configuracoes, salvar }), [configuracoes, salvar]);

  if (!carregado) {
    return (
      <View style={estilos.carregando} accessibilityLabel="Carregando o aplicativo">
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={estilos.texto}>Carregando...</Text>
      </View>
    );
  }

  return <ConfiguracoesContext.Provider value={valor}>{children}</ConfiguracoesContext.Provider>;
}

export function useConfiguracoes(): ValorContexto {
  const contexto = useContext(ConfiguracoesContext);
  if (!contexto) {
    throw new Error('useConfiguracoes deve ser usado dentro de ConfiguracoesProvider.');
  }
  return contexto;
}

const estilos = StyleSheet.create({
  carregando: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espaco.md, backgroundColor: cores.fundo },
  texto: { fontSize: fonte.corpo, color: cores.textoSuave },
});
