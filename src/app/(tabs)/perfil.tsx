import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Secao } from '@/components/Secao';
import { useConfiguracoes } from '@/context/ConfiguracoesContext';
import { ApiError, testarAlertas, testarMonitoramento } from '@/services/api';
import { cadastrar, excluirCadastro } from '@/services/dados';
import { cores, espaco, fonte } from '@/theme/tema';
import type { Configuracoes } from '@/types';
import { formatarCpf, somenteDigitos, validarCadastro } from '@/utils/validacao';
import type { ErrosCadastro } from '@/utils/validacao';

const CAMPOS_DO_CADASTRO: Array<keyof ErrosCadastro> = ['nome', 'cpf', 'telefone', 'bairro', 'logradouro', 'numero'];

/** Perfil: bairro, cadastro para receber alertas e configuração das conexões (APIs / modo demonstração). */
export default function TelaPerfil() {
  const { configuracoes, salvar } = useConfiguracoes();

  // --- Configurações ---
  const [bairro, setBairro] = useState(configuracoes.bairro);
  const [urlMonitoramento, setUrlMonitoramento] = useState(configuracoes.urlMonitoramento);
  const [urlAlertas, setUrlAlertas] = useState(configuracoes.urlAlertas);
  const [modoDemo, setModoDemo] = useState(configuracoes.modoDemo);
  const [resultadoTeste, setResultadoTeste] = useState<string | null>(null);
  const [testando, setTestando] = useState(false);

  // --- Cadastro ---
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairroCadastro, setBairroCadastro] = useState(configuracoes.bairro);
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [mobilidadeReduzida, setMobilidadeReduzida] = useState(false);
  const [erros, setErros] = useState<ErrosCadastro>({});
  const [enviando, setEnviando] = useState(false);

  const salvarConfiguracoes = async () => {
    const parcial: Partial<Configuracoes> = {
      bairro: bairro.trim() || 'Ipiranga',
      urlMonitoramento: urlMonitoramento.trim(),
      urlAlertas: urlAlertas.trim(),
      modoDemo,
    };
    // O cadastro de exemplo (modo demonstração) não existe na API real: ao trocar de modo, pedimos novo cadastro.
    if (modoDemo !== configuracoes.modoDemo) {
      parcial.moradorId = null;
      parcial.nomeMorador = null;
    }
    await salvar(parcial);
    Alert.alert('Configurações salvas', 'As telas já usam os novos valores.');
  };

  const testarConexoes = async () => {
    setTestando(true);
    setResultadoTeste(null);
    if (modoDemo) {
      setResultadoTeste('O modo demonstração está ligado: o app usa dados de exemplo e não acessa as APIs.');
      setTestando(false);
      return;
    }
    const linhas: string[] = [];
    try {
      await testarMonitoramento(urlMonitoramento.trim());
      linhas.push('Monitoramento (C#): conectado.');
    } catch {
      linhas.push('Monitoramento (C#): não conectou. Confira o endereço e se a API está no ar.');
    }
    try {
      await testarAlertas(urlAlertas.trim());
      linhas.push('Cadastro e Alertas (Java): conectado.');
    } catch {
      linhas.push('Cadastro e Alertas (Java): não conectou. Confira o endereço e se a API está no ar.');
    }
    setResultadoTeste(linhas.join('\n'));
    setTestando(false);
  };

  const fazerCadastro = async () => {
    const dados = { nome, cpf, telefone, bairro: bairroCadastro, logradouro, numero };
    const encontrados = validarCadastro(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      const id = await cadastrar(configuracoes, { ...dados, mobilidadeReduzida });
      await salvar({ moradorId: id, nomeMorador: nome.trim(), bairro: bairroCadastro.trim() });
      setBairro(bairroCadastro.trim());
      setCpf('');
      setTelefone('');
      Alert.alert('Cadastro feito', 'Agora os alertas do seu bairro aparecem na aba Alertas.');
    } catch (e) {
      const deApi: ErrosCadastro = {};
      if (e instanceof ApiError && e.campos) {
        for (const campo of CAMPOS_DO_CADASTRO) {
          const mensagem = e.campos[campo];
          if (mensagem) deApi[campo] = mensagem;
        }
      }
      setErros(deApi);
      Alert.alert('Não foi possível cadastrar', e instanceof ApiError ? e.message : 'Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const confirmarExclusaoDoCadastro = () => {
    Alert.alert('Excluir meu cadastro?', 'Você deixa de receber alertas e seus dados são apagados do servidor.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            if (configuracoes.moradorId !== null) {
              await excluirCadastro(configuracoes, configuracoes.moradorId);
            }
            await salvar({ moradorId: null, nomeMorador: null });
          } catch (e) {
            Alert.alert('Não foi possível excluir', e instanceof ApiError ? e.message : 'Tente novamente.');
          }
        },
      },
    ]);
  };

  const cadastrado = configuracoes.moradorId !== null;

  return (
    <KeyboardAvoidingView style={estilos.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Aviso
          tipo="info"
          icone="shield-checkmark"
          texto="Este projeto é acadêmico: use apenas dados FICTÍCIOS (nomes, CPF e telefone inventados)."
        />

        {/* ---------------- Cadastro ---------------- */}
        <Secao titulo="Receber alertas" />

        {cadastrado ? (
          <>
            <Aviso
              tipo="sucesso"
              texto={`Cadastro ativo${configuracoes.nomeMorador ? ` para ${configuracoes.nomeMorador}` : ''}. Veja os avisos na aba Alertas.`}
            />
            <Botao
              titulo="Excluir meu cadastro"
              icone="trash"
              variante="perigo"
              onPress={confirmarExclusaoDoCadastro}
              dica="Apaga seus dados do servidor e deixa de receber alertas"
            />
          </>
        ) : (
          <View style={estilos.formulario}>
            <Campo rotulo="Nome" value={nome} onChangeText={setNome} erro={erros.nome} autoCapitalize="words" maxLength={120} />
            <Campo
              rotulo="CPF (fictício)"
              value={cpf}
              onChangeText={(valor) => setCpf(formatarCpf(valor))}
              erro={erros.cpf}
              keyboardType="number-pad"
              placeholder="000.000.000-00"
              maxLength={14}
              dica="Use um CPF inventado, porém válido"
            />
            <Campo
              rotulo="Telefone com DDD"
              value={telefone}
              onChangeText={(valor) => setTelefone(somenteDigitos(valor))}
              erro={erros.telefone}
              keyboardType="phone-pad"
              placeholder="11900000000"
              maxLength={11}
            />
            <Campo rotulo="Bairro" value={bairroCadastro} onChangeText={setBairroCadastro} erro={erros.bairro} autoCapitalize="words" />
            <Campo rotulo="Rua ou avenida" value={logradouro} onChangeText={setLogradouro} erro={erros.logradouro} autoCapitalize="words" />
            <Campo rotulo="Número" value={numero} onChangeText={setNumero} erro={erros.numero} maxLength={10} />

            <View style={estilos.linhaSwitch} accessible accessibilityRole="switch" accessibilityState={{ checked: mobilidadeReduzida }} accessibilityLabel="Tenho mobilidade reduzida ou preciso de mais tempo para sair de casa">
              <Text style={estilos.textoSwitch}>Tenho mobilidade reduzida ou preciso de mais tempo para sair de casa</Text>
              <Switch value={mobilidadeReduzida} onValueChange={setMobilidadeReduzida} />
            </View>
            <Text style={estilos.nota}>Quem marca esta opção recebe os avisos primeiro e já no nível de Atenção.</Text>

            <Botao titulo="Cadastrar" icone="person-add" onPress={() => void fazerCadastro()} carregando={enviando} />
          </View>
        )}

        {/* ---------------- Configurações ---------------- */}
        <Secao titulo="Meu bairro e conexões" />

        <View style={estilos.formulario}>
          <Campo
            rotulo="Bairro monitorado"
            value={bairro}
            onChangeText={setBairro}
            autoCapitalize="words"
            dica="O bairro cujo risco aparece na tela inicial"
          />

          <View style={estilos.linhaSwitch} accessible accessibilityRole="switch" accessibilityState={{ checked: modoDemo }} accessibilityLabel="Modo demonstração, usa dados de exemplo">
            <Text style={estilos.textoSwitch}>Modo demonstração (dados de exemplo)</Text>
            <Switch value={modoDemo} onValueChange={setModoDemo} />
          </View>

          <Campo
            rotulo="Endereço da API de Monitoramento (C#)"
            value={urlMonitoramento}
            onChangeText={setUrlMonitoramento}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            dica="Em celular de verdade use o IP do computador, por exemplo http://192.168.0.10:5080"
          />
          <Campo
            rotulo="Endereço da API de Cadastro e Alertas (Java)"
            value={urlAlertas}
            onChangeText={setUrlAlertas}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            dica="Em celular de verdade use o IP do computador, por exemplo http://192.168.0.10:8080"
          />

          <Botao titulo="Salvar configurações" icone="save" onPress={() => void salvarConfiguracoes()} />
          <Botao titulo="Testar conexões" icone="wifi" variante="secundario" onPress={() => void testarConexoes()} carregando={testando} />

          {resultadoTeste ? <Aviso tipo="info" texto={resultadoTeste} icone="pulse" /> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.md, gap: espaco.md, paddingBottom: espaco.xl * 2 },
  formulario: { gap: espaco.md },
  linhaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.md,
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.md,
    minHeight: 64,
  },
  textoSwitch: { flex: 1, fontSize: fonte.corpo, color: cores.texto, fontWeight: '600' },
  nota: { fontSize: fonte.pequena, color: cores.textoSuave },
});
