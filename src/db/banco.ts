import type { SQLiteDatabase } from 'expo-sqlite';

const VERSAO_DO_BANCO = 1;

/**
 * Cria/atualiza o schema do banco SQLite local (executado uma vez quando o app abre).
 * Usa PRAGMA user_version para saber quais migrações já foram aplicadas.
 */
export async function migrarBanco(db: SQLiteDatabase): Promise<void> {
  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let versaoAtual = linha?.user_version ?? 0;

  if (versaoAtual >= VERSAO_DO_BANCO) {
    return;
  }

  if (versaoAtual === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      -- Preferências do usuário (bairro, endereços das APIs, modo demonstração, id do cadastro)
      CREATE TABLE IF NOT EXISTS configuracoes (
        chave TEXT PRIMARY KEY NOT NULL,
        valor TEXT NOT NULL
      );

      -- Ocorrências de alagamento registradas pelo próprio morador
      CREATE TABLE IF NOT EXISTS ocorrencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        local TEXT NOT NULL,
        descricao TEXT NOT NULL,
        gravidade TEXT NOT NULL,
        criada_em TEXT NOT NULL
      );

      -- Último dado recebido das APIs, para o app continuar útil sem internet
      CREATE TABLE IF NOT EXISTS cache (
        chave TEXT PRIMARY KEY NOT NULL,
        json TEXT NOT NULL,
        atualizado_em TEXT NOT NULL
      );
    `);
    versaoAtual = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${VERSAO_DO_BANCO}`);
}
