# Roteiro de testes manuais (e de prints)

## A. Modo demonstração (sem APIs)

| # | Passo | Resultado esperado | Print |
|---|---|---|---|
| 1 | Abrir o app | Aba **Risco** com aviso "Modo demonstração" e cartão **SEM RISCO** (verde) | `risco-normal.png` |
| 2 | Tocar em **Simular outro nível de risco** | Cartão **ATENÇÃO** (amarelo) com orientação | `risco-atencao.png` |
| 3 | Tocar de novo | Cartão **ALERTA** (vermelho) | `risco-alerta.png` |
| 4 | Aba **Alertas** | Dois alertas de exemplo: um "Nova", outro "Lida" | `alertas.png` |
| 5 | Tocar em **Marcar como lida** | O alerta passa para "Lida" e o botão some | |
| 6 | Aba **Ocorrências** → **Registrar ocorrência** → salvar vazio | Mensagens de erro claras nos campos | |
| 7 | Preencher local e descrição, escolher gravidade, **Salvar** | Volta para a lista com a ocorrência nova | `ocorrencias.png` |
| 8 | Fechar o app por completo e abrir de novo | A ocorrência continua lá (SQLite) | |
| 9 | **Excluir** a ocorrência | Pede confirmação e remove | |
| 10 | Aba **Perfil** → cadastrar com CPF inválido (ex.: 111.111.111-11) | Erro no campo CPF | `perfil.png` |

## B. Com as APIs de verdade

| # | Passo | Resultado esperado |
|---|---|---|
| 1 | Subir Java (8080) e C# (5080, `--urls "http://0.0.0.0:5080"`; `AlertasService:Habilitado=true`) | APIs no ar |
| 2 | Perfil → desligar *Modo demonstração* → conferir endereços → **Testar conexões** → **Salvar** | "Monitoramento (C#): conectado" e "Cadastro e Alertas (Java): conectado" |
| 3 | Perfil → cadastrar (CPF fictício válido, bairro **Ipiranga**) | "Cadastro feito" |
| 4 | Swagger do C#: `POST /api/leituras` `{ "pontoId": 1, "distanciaCm": 90 }` | Aba Risco: **SEM RISCO** |
| 5 | Swagger do C#: `POST /api/leituras` `{ "pontoId": 1, "distanciaCm": 35 }` | Aba Risco: **ALERTA** (após atualizar) |
| 6 | Aba **Alertas** | Alerta novo criado pela API Java |
| 7 | Marcar como lida | Status vira "Lida" (confira também em `GET /api/alertas` no Swagger do Java) |
| 8 | Pare a API C# e puxe a tela Risco para atualizar | Aviso "Sem conexão... último dado salvo" e o cartão continua visível |
| 9 | Perfil → **Excluir meu cadastro** | Cadastro removido (e apagado na API Java) |

## C. Acessibilidade (rápido)

1. Ative o **TalkBack** (Android) ou **VoiceOver** (iPhone) e navegue pelas abas: cada item deve ser lido com nome claro.
2. Aumente o **tamanho da fonte** nas configurações do celular: os textos devem crescer sem cortar.
3. Confira que o nível de risco é compreensível **sem ver as cores** (há texto e ícone).
