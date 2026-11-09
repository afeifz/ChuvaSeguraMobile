import type { SQLiteDatabase } from 'expo-sqlite';
import type { Gravidade, Ocorrencia } from '../types';

interface LinhaOcorrencia {
  id: number;
  local: string;
  descricao: string;
  gravidade: string;
  criada_em: string;
}

function paraOcorrencia(linha: LinhaOcorrencia): Ocorrencia {
  return {
    id: linha.id,
    local: linha.local,
    descricao: linha.descricao,
    gravidade: linha.gravidade as Gravidade,
    criadaEm: linha.criada_em,
  };
}

export async function listarOcorrencias(db: SQLiteDatabase): Promise<Ocorrencia[]> {
  const linhas = await db.getAllAsync<LinhaOcorrencia>(
    'SELECT id, local, descricao, gravidade, criada_em FROM ocorrencias ORDER BY criada_em DESC, id DESC',
  );
  return linhas.map(paraOcorrencia);
}

export async function inserirOcorrencia(
  db: SQLiteDatabase,
  dados: { local: string; descricao: string; gravidade: Gravidade },
): Promise<number> {
  const resultado = await db.runAsync(
    'INSERT INTO ocorrencias (local, descricao, gravidade, criada_em) VALUES (?, ?, ?, ?)',
    [dados.local.trim(), dados.descricao.trim(), dados.gravidade, new Date().toISOString()],
  );
  return resultado.lastInsertRowId;
}

export async function removerOcorrencia(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM ocorrencias WHERE id = ?', [id]);
}
