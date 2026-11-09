import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useConfiguracoes } from '../context/ConfiguracoesContext';
import { lerCache, salvarCache } from '../db/cache';
import { ApiError } from '../services/api';
import { obterRiscoBairro } from '../services/dados';
import type { RiscoBairro } from '../types';

/** Busca o risco do bairro; se a API falhar, usa o último dado salvo no SQLite (modo offline). */
export function useRiscoBairro() {
  const db = useSQLiteContext();
  const { configuracoes } = useConfiguracoes();

  const [dados, setDados] = useState<RiscoBairro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [offline, setOffline] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const atualizar = useCallback(async () => {
    setCarregando(true);
    const chaveCache = `risco:${configuracoes.bairro.trim().toLowerCase()}`;
    try {
      const resultado = await obterRiscoBairro(configuracoes);
      setDados(resultado);
      setOffline(false);
      setErro(null);
      await salvarCache(db, chaveCache, resultado);
    } catch (e) {
      const guardado = await lerCache<RiscoBairro>(db, chaveCache);
      if (guardado) {
        setDados(guardado.valor);
        setOffline(true);
        setErro(null);
      } else {
        setDados(null);
        setErro(e instanceof ApiError ? e.message : 'Não foi possível carregar o risco do bairro.');
      }
    } finally {
      setCarregando(false);
    }
  }, [db, configuracoes]);

  return { dados, carregando, offline, erro, atualizar };
}
