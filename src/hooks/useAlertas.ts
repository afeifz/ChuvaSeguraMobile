import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useConfiguracoes } from '../context/ConfiguracoesContext';
import { lerCache, salvarCache } from '../db/cache';
import { ApiError } from '../services/api';
import { lerAlerta, obterAlertas } from '../services/dados';
import type { Alerta } from '../types';

/** Alertas do morador cadastrado; sem conexão, mostra os últimos alertas salvos no SQLite. */
export function useAlertas() {
  const db = useSQLiteContext();
  const { configuracoes } = useConfiguracoes();

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [offline, setOffline] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const chaveCache = `alertas:${configuracoes.moradorId ?? 'demo'}`;

  const atualizar = useCallback(async () => {
    setCarregando(true);
    try {
      const lista = await obterAlertas(configuracoes);
      setAlertas(lista);
      setOffline(false);
      setErro(null);
      await salvarCache(db, chaveCache, lista);
    } catch (e) {
      const guardado = await lerCache<Alerta[]>(db, chaveCache);
      if (guardado) {
        setAlertas(guardado.valor);
        setOffline(true);
        setErro(null);
      } else {
        setAlertas([]);
        setErro(e instanceof ApiError ? e.message : 'Não foi possível carregar os alertas.');
      }
    } finally {
      setCarregando(false);
    }
  }, [db, configuracoes, chaveCache]);

  /** Marca como lido na API e atualiza a lista na tela na hora. */
  const marcarComoLido = useCallback(
    async (alertaId: number): Promise<string | null> => {
      try {
        const atualizado = await lerAlerta(configuracoes, alertaId);
        setAlertas((atuais) => atuais.map((alerta) => (alerta.id === alertaId ? atualizado : alerta)));
        return null;
      } catch (e) {
        return e instanceof ApiError ? e.message : 'Não foi possível marcar como lido.';
      }
    },
    [configuracoes],
  );

  return { alertas, carregando, offline, erro, atualizar, marcarComoLido };
}
