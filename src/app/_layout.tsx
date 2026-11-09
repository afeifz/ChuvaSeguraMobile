import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { ConfiguracoesProvider } from '@/context/ConfiguracoesContext';
import { migrarBanco } from '@/db/banco';
import { cores } from '@/theme/tema';

/** Raiz do app: abre o banco SQLite (criando as tabelas se for a primeira vez) e carrega as preferências. */
export default function LayoutRaiz() {
  return (
    <SQLiteProvider databaseName="chuvasegura.db" onInit={migrarBanco}>
      <ConfiguracoesProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: cores.primaria },
            headerTintColor: cores.primariaTexto,
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="ocorrencia/nova" options={{ title: 'Nova ocorrência', presentation: 'modal' }} />
        </Stack>
      </ConfiguracoesProvider>
    </SQLiteProvider>
  );
}
