# ChuvaSegura – Aplicativo (Expo / React Native + TypeScript)

> **Global Solution FIAP 2026.2 · CitizenTech · Engenharia de Software · Mobile Development & IoT**

## Ficha da CitizenTech

| Campo | Conteúdo |
|---|---|
| **Nome da CitizenTech** | ChuvaSegura |
| **Cidade e bairro** | São Paulo – Ipiranga (região do Rio Tamanduateí) |
| **Cidadão beneficiado** | Moradores e comerciantes do Ipiranga em ruas com histórico de alagamento, com atenção a idosos e pessoas com mobilidade reduzida |
| **Problema, em uma frase** | Moradores de áreas que alagam recebem o aviso de chuva forte tarde demais, ou de forma genérica demais, para proteger a família e seus bens. |
| **Como funciona** | Um sensor mede o nível da água num ponto crítico; um modelo de ML estima a chance de chuva forte; a API combina os dois e envia alertas ao app do morador, que também registra ocorrências. |
| **O que cada parte faz** | IoT (ESP32/Wokwi): mede e sinaliza o nível · API C#: recebe leituras e calcula risco · API Java: cadastro de moradores e alertas · ML: previsão de chuva forte com dados do INMET · **App Expo: risco do bairro, alertas e ocorrências** · Linux: hospeda e monitora o sistema · Cybersecurity: protege os dados dos moradores · QA: features e casos de teste |
| **Link do repositório** | _[COLAR LINK]_ |
| **Indicador de impacto** | Minutos de antecedência entre o alerta e o nível crítico; % de chuvas fortes detectadas pelo modelo (recall) |
| **ODS conectados** | 11 (Cidades sustentáveis), 13 (Ação climática), 9 (Infraestrutura e inovação), 10 (Redução das desigualdades) |

**Integrantes:** _[NOMES E RMs]_ · **Vídeo (até 3 min):** _[LINK]_

---

## A jornada do cidadão no app

1. **Abre o app** e vê, em letras grandes, o risco de alagamento do bairro: **SEM RISCO**, **ATENÇÃO** ou **ALERTA**, com uma orientação em linguagem simples.
2. **Se o risco subir, recebe um alerta** na aba *Alertas*. Quem tem mobilidade reduzida recebe primeiro e já no nível de Atenção.
3. **Marca o alerta como lido** quando vê.
4. **Registra uma ocorrência** ("a rua alagou aqui") para guardar o histórico no próprio aparelho.
5. **Continua usando sem internet:** o app mostra o último dado salvo, avisando que está sem conexão.

## Telas

| Aba | O que faz |
|---|---|
| **Risco** (`src/app/(tabs)/index.tsx`) | Risco do bairro (API C#), pontos de sensor com o nível da água, atualização automática a cada 30 s e *pull-to-refresh* |
| **Alertas** (`alertas.tsx`) | Alertas do morador (API Java), prioridade, "Nova/Lida" e botão *Marcar como lida* |
| **Ocorrências** (`ocorrencias.tsx` + `ocorrencia/nova.tsx`) | Lista e formulário (modal) de ocorrências, gravadas no **SQLite** |
| **Perfil** (`perfil.tsx`) | Cadastro para receber alertas (com validação de CPF), bairro, **modo demonstração**, endereços das APIs e teste de conexão |

---

## Como rodar

Este é um projeto **Expo SDK 58** (React Native + TypeScript + Expo Router) já completo, feito a partir do template oficial `create-expo-app`.

```bash
# 1) instale as dependências (isso também instala o expo-sqlite)
npm install

# 2) se o Expo reclamar de versões de pacotes, alinhe tudo com a SDK:
npx expo install --fix

# 3) rode
npx expo start
```

- Instale o app **Expo Go** no celular (Android ou iPhone) e leia o QR Code. Para emulador Android, aperte `a` no terminal.
- **Não use a versão web** (`w`): o SQLite do Expo funciona no celular/emulador.
- Para checar erros de código: `npm run typecheck`.
- Se der problema ao abrir, limpe o cache do Metro: `npx expo start -c`.

**Importante:** as rotas ficam em `src/app/` (padrão do template da SDK 58). Não crie uma pasta `app/` na raiz do projeto.

## Rodando

### Modo demonstração (padrão)
O app abre com **dados de exemplo**, sem precisar das APIs. Na aba *Risco* o botão **Simular outro nível de risco** alterna entre Sem risco, Atenção e Alerta (ótimo para o vídeo e para os prints).

### Com as APIs de verdade
1. Suba a API **Java** (porta 8080): `mvn spring-boot:run`.
2. Suba a API **C#** (porta 5080) **aceitando conexões da rede**, para o celular alcançar:
   `dotnet run --project src/ChuvaSegura.Monitoramento.Api --no-launch-profile --urls "http://0.0.0.0:5080"`
   e no `appsettings.json` dela deixe `AlertasService:Habilitado` = `true`.
3. No app, aba **Perfil**: desligue o *Modo demonstração*, confira os endereços e toque em **Testar conexões**.

| Onde o app roda | Endereço da API |
|---|---|
| Emulador Android | `http://10.0.2.2:5080` e `http://10.0.2.2:8080` (já é o padrão) |
| Simulador iPhone | `http://localhost:5080` e `http://localhost:8080` |
| **Celular de verdade** | `http://IP-DO-SEU-COMPUTADOR:5080` e `:8080` (celular e computador no mesmo Wi-Fi; libere as portas 5080 e 8080 no firewall) |

### Fluxo completo para demonstrar (sensor → APIs → app)
1. No app (Perfil), faça o **cadastro** com dados fictícios, no bairro **Ipiranga** (o mesmo do ponto de monitoramento).
2. No Swagger da API C# (`/swagger`), envie `POST /api/leituras` com `{ "pontoId": 1, "distanciaCm": 90 }` (Normal) e depois `{ "pontoId": 1, "distanciaCm": 35 }` (Alerta).
3. No app, a aba **Risco** passa para ALERTA e a aba **Alertas** mostra o aviso criado pela API Java.

---

## Banco de dados (SQLite no aparelho)

Arquivo `chuvasegura.db`, criado na primeira abertura por `src/db/banco.ts` (migração com `PRAGMA user_version`).

| Tabela | Para que serve |
|---|---|
| `configuracoes` | Bairro, endereços das APIs, modo demonstração e id do cadastro |
| `ocorrencias` | Ocorrências registradas pelo morador (`id`, `local`, `descricao`, `gravidade`, `criada_em`) |
| `cache` | Último risco e últimos alertas recebidos, para funcionar sem internet |

## Acessibilidade

- **O risco nunca depende só da cor:** sempre há texto ("ALERTA"), ícone (emoji decorativo, ignorado pelo leitor de tela) e orientação escrita.
- **Contraste alto** em todos os textos (paleta definida em `src/theme/tema.ts`).
- **Fontes grandes** (corpo 17 pt, destaque 20 pt) que **acompanham o tamanho de fonte do sistema**.
- **Alvos de toque grandes:** botões e campos com no mínimo 52 dp.
- **Leitor de tela (TalkBack/VoiceOver):** `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` e `accessibilityState` nos botões, campos, opções e cartões; o cartão de risco é uma região "viva", que anuncia mudanças.
- **Formulários claros:** rótulo visível acima de cada campo, mensagem de erro em linguagem simples e CPF com máscara.
- **Linguagem simples**, sem termos técnicos.
- **Funciona fora do cenário ideal:** sem internet mostra o último dado salvo (e avisa), e o modo demonstração permite usar o app sem servidor.

## Dados e privacidade

- Todos os dados de moradores são **fictícios**. O app avisa isso na aba Perfil.
- O CPF **não é guardado no aparelho**: é enviado ao cadastro e o app guarda só o id do cadastro e o nome.
- O morador pode **excluir o cadastro** (apaga na API e no aparelho).
- As APIs devolvem CPF e telefone mascarados.

## Estrutura do código

```
src/
├── app/                   Rotas (Expo Router)
│   ├── _layout.tsx        Raiz: abre o SQLite e carrega as configurações
│   ├── (tabs)/            Abas: index (Risco), alertas, ocorrencias, perfil
│   └── ocorrencia/nova.tsx  Formulário (modal)
├── components/            Botao, Campo, RiscoCard, AlertaCard, Aviso, Icone...
├── context/               ConfiguracoesContext (preferências em SQLite)
├── db/                    banco (migração), configuracoes, ocorrencias, cache
├── hooks/                 useRiscoBairro, useAlertas (API + cache offline)
├── services/              api (fetch das duas APIs), mock (demonstração), dados (fachada)
├── theme/                 cores, fontes, ícones e visual de cada nível de risco
├── utils/                 validação (CPF, formulários) e formatação de datas
└── types.ts
assets/                    Ícones e splash do app
docs/                      Roteiro do vídeo, testes manuais e pasta de prints
```

## Critérios da avaliação × onde ver

| Critério | Onde |
|---|---|
| **Telas e navegação** | Expo Router: 4 abas + modal (`src/app/`) |
| **Consumo de dados** | `src/services/api.ts` (APIs C# e Java, com tempo limite e erros tratados) e `mock.ts` (demonstração) |
| **Banco de dados** | `src/db/*` (SQLite: configurações, ocorrências e cache) |
| **Acessibilidade** | Seção acima; `src/components/*` e `src/theme/tema.ts` |
| **Aderência ao problema** | A jornada do cidadão acima: ver risco → receber alerta → registrar ocorrência |
| **Documentação** | Este README (Ficha, como rodar, prints) + vídeo |

## Prints das telas

Coloque os prints em `docs/prints/` e referencie aqui (veja `docs/TESTES_MANUAIS.md` para a lista):

| Tela | Print |
|---|---|
| Risco – Sem risco | _[docs/prints/risco-normal.png]_ |
| Risco – Atenção | _[docs/prints/risco-atencao.png]_ |
| Risco – Alerta | _[docs/prints/risco-alerta.png]_ |
| Alertas | _[docs/prints/alertas.png]_ |
| Ocorrências e formulário | _[docs/prints/ocorrencias.png]_ |
| Perfil e conexões | _[docs/prints/perfil.png]_ |
| Sem conexão (último dado salvo) | _[docs/prints/offline.png]_ |

## Problemas comuns

| Sintoma | O que fazer |
|---|---|
| "Não foi possível conectar ao servidor" | Confira se a API está no ar, o endereço na aba Perfil e se celular e computador estão na mesma rede. Use **Testar conexões** |
| Funciona no emulador mas não no celular | Troque `10.0.2.2`/`localhost` pelo IP do computador e suba a API C# com `--urls "http://0.0.0.0:5080"` |
| Alerta não aparece no app | Confira se `AlertasService:Habilitado` está `true` no C#, se o risco **mudou** (envie primeiro uma leitura Normal) e se o bairro do cadastro é o mesmo do ponto |
| Erro de HTTP em build de produção (APK) | Builds de produção bloqueiam `http://`. Para a demonstração use o Expo Go, ou publique as APIs com HTTPS |
| Tela branca / erro ao abrir no Expo Go | Rode `npx expo install --fix`, depois `npx expo start -c`. Confira se o Expo Go está atualizado (ele só abre a SDK mais recente) |
| `Unable to resolve module expo-sqlite` | Rode `npm install` (ou `npx expo install expo-sqlite`) |
