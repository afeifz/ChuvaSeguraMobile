import type { SQLiteDatabase } from 'expo-sqlite';

export interface ItemDeCache<T> {
  valor: T;
  atualizadoEm: string;
}

interface LinhaCache {
  json: string;
  atualizado_em: string;
}

/** Guarda o último dado recebido da API (para mostrar quando estiver sem conexão). */
export async function salvarCache<T>(db: SQLiteDatabase, chave: string, valor: T): Promise<void> {
  await db.runAsync('INSERT OR REPLACE INTO cache (chave, json, atualizado_em) VALUES (?, ?, ?)', [
    chave,
    JSON.stringify(valor),
    new Date().toISOString(),
  ]);
}

export async function lerCache<T>(db: SQLiteDatabase, chave: string): Promise<ItemDeCache<T> | null> {
  const linha = await db.getFirstAsync<LinhaCache>('SELECT json, atualizado_em FROM cache WHERE chave = ?', [chave]);
  if (!linha) return null;
  try {
    return { valor: JSON.parse(linha.json) as T, atualizadoEm: linha.atualizado_em };
  } catch {
    return null;
  }
}

export async function limparCache(db: SQLiteDatabase, prefixo: string): Promise<void> {
  await db.runAsync('DELETE FROM cache WHERE chave LIKE ?', [`${prefixo}%`]);
}
