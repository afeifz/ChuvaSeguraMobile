import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { ROTULO_GRAVIDADE } from '@/components/OcorrenciaCard';
import { inserirOcorrencia } from '@/db/ocorrencias';
import { ALVO_MINIMO, cores, espaco, fonte } from '@/theme/tema';
import type { Gravidade } from '@/types';
import { validarOcorrencia } from '@/utils/validacao';
import type { ErrosOcorrencia } from '@/utils/validacao';

const GRAVIDADES: Gravidade[] = ['LEVE', 'MEDIA', 'GRAVE'];

/** Formulário para registrar uma ocorrência de alagamento (grava no SQLite do aparelho). */
export default function NovaOcorrencia() {
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [gravidade, setGravidade] = useState<Gravidade>('MEDIA');
  const [erros, setErros] = useState<ErrosOcorrencia>({});
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    const encontrados = validarOcorrencia(local, descricao);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setSalvando(true);
    try {
      await inserirOcorrencia(db, { local, descricao, gravidade });
      router.back();
    } catch {
      setSalvando(false);
      Alert.alert('Não foi possível salvar', 'Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView style={estilos.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[estilos.conteudo, { paddingBottom: espaco.xl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.ajuda}>Conte onde a água subiu e o que aconteceu. Use palavras simples.</Text>

        <Campo
          rotulo="Onde foi?"
          value={local}
          onChangeText={setLocal}
          erro={erros.local}
          placeholder="Ex.: Rua Exemplo, 100"
          maxLength={120}
        />

        <Campo
          rotulo="O que aconteceu?"
          value={descricao}
          onChangeText={setDescricao}
          erro={erros.descricao}
          placeholder="Ex.: A água chegou até a calçada e o carro não passa."
          multiline
          maxLength={400}
        />

        <View style={estilos.grupo}>
          <Text style={estilos.rotulo}>Quão grave está?</Text>
          <View style={estilos.opcoes} accessibilityRole="radiogroup">
            {GRAVIDADES.map((opcao) => {
              const selecionada = opcao === gravidade;
              return (
                <Pressable
                  key={opcao}
                  onPress={() => setGravidade(opcao)}
                  accessibilityRole="radio"
                  accessibilityLabel={`Gravidade ${ROTULO_GRAVIDADE[opcao]}`}
                  accessibilityState={{ selected: selecionada, checked: selecionada }}
                  style={[estilos.opcao, selecionada && estilos.opcaoSelecionada]}
                >
                  <Text style={[estilos.opcaoTexto, selecionada && estilos.opcaoTextoSelecionado]}>
                    {ROTULO_GRAVIDADE[opcao]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Botao titulo="Salvar ocorrência" icone="save" onPress={() => void salvar()} carregando={salvando} />
        <Botao titulo="Cancelar" variante="secundario" onPress={() => router.back()} desabilitado={salvando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.md, gap: espaco.md, paddingBottom: espaco.xl },
  ajuda: { fontSize: fonte.corpo, color: cores.textoSuave },
  grupo: { gap: espaco.xs },
  rotulo: { fontSize: fonte.corpo, fontWeight: '600', color: cores.texto },
  opcoes: { flexDirection: 'row', gap: espaco.sm },
  opcao: {
    flex: 1,
    minHeight: ALVO_MINIMO,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoSelecionada: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  opcaoTexto: { fontSize: fonte.corpo, fontWeight: '700', color: cores.texto },
  opcaoTextoSelecionado: { color: cores.primariaTexto },
});
