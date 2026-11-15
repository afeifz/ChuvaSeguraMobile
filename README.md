# ChuvaSegura – Aplicativo (Expo / React Native + TypeScript)

**Global Solution FIAP 2026.2 · CitizenTech · Engenharia de Software · Mobile Development & IoT**

---

## Ficha da CitizenTech

| Campo | Conteúdo |
|---------|---------|
| **Nome da CitizenTech** | ChuvaSegura |
| **Cidade e bairro** | São Paulo – Ipiranga (região do Rio Tamanduateí) |
| **Cidadão beneficiado** | Moradores e comerciantes do Ipiranga em ruas com histórico de alagamento, com atenção a idosos e pessoas com mobilidade reduzida |
| **Problema, em uma frase** | Moradores de áreas que alagam recebem o aviso de chuva forte tarde demais, ou de forma genérica demais, para proteger a família e seus bens |
| **Como funciona** | Um sensor mede o nível da água num ponto crítico; um modelo de ML estima a chance de chuva forte; a API combina os dois e envia alertas ao app do morador, que também registra ocorrências |
| **O que cada parte faz** | IoT (ESP32/Wokwi), API C#, API Java, Machine Learning, Expo, Linux, Cybersecurity e QA |
| **Link do repositório** | https://github.com/afeifz/ChuvaSeguraMobile.git|
| **Indicador de impacto** | Minutos de antecedência entre o alerta e o nível crítico; % de chuvas fortes detectadas pelo modelo |
| **ODS conectados** | 11, 13, 9 e 10 |

---

## Integrantes

- Mohamed Afif — RM 554445
- Lucca Cardinale — RM 556668

**Vídeo (até 3 min):** https://youtube.com/shorts/OJGafjFd91M?feature=share

**APK:** https://expo.dev/accounts/mohamedfiap/projects/chuvasegura-app/builds/bf82d257-be41-4dfa-bde2-9ccb3449a460

---

## A jornada do cidadão no app

- Abre o aplicativo e vê o risco de alagamento do bairro.
- Recebe alertas quando o risco aumenta.
- Marca alertas como lidos.
- Registra ocorrências.
- Continua utilizando o app mesmo sem internet através do cache local.

---

## Telas

| Aba | O que faz |
|-------|-----------|
| **Risco** | Exibe risco do bairro, sensores e atualização automática |
| **Alertas** | Lista alertas do morador |
| **Ocorrências** | Registro e consulta de ocorrências |
| **Perfil** | Cadastro, configurações e conexões |

---

# Como rodar

## 1. Instalar dependências

```bash
npm install
```

## 2. Ajustar dependências do Expo

```bash
npx expo install --fix
```

## 3. Executar

```bash
npx expo start
```

### Expo Go

- Instale o Expo Go.
- Escaneie o QR Code.

### Emulador Android

Pressione:

```bash
a
```

### Verificar erros de TypeScript

```bash
npm run typecheck
```

### Limpar cache

```bash
npx expo start -c
```

---

## Rodando

### Modo demonstração

O aplicativo abre com dados simulados.

Na aba **Risco**, o botão **Simular outro nível de risco** alterna entre:

- Sem risco
- Atenção
- Alerta

### Configuração das APIs

| Ambiente | Endereço |
|----------|----------|
| Emulador Android | `http://10.0.2.2:5080` e `http://10.0.2.2:8080` |
| Simulador iPhone | `http://localhost:5080` e `http://localhost:8080` |
| Celular físico | `http://IP-DO-SEU-COMPUTADOR:5080` e `:8080` |

### APK

Foi disponibilizado um APK funcional para Android.

---

## Banco de dados (SQLite)

Arquivo:

```text
chuvasegura.db
```

Criado automaticamente na primeira execução.

### Tabelas

| Tabela | Função |
|---------|---------|
| `configuracoes` | Preferências do usuário |
| `ocorrencias` | Histórico de ocorrências |
| `cache` | Último risco e últimos alertas |

---

## Acessibilidade

- O risco nunca depende apenas da cor.
- Alto contraste.
- Fontes grandes e escaláveis.
- Botões com área mínima de toque.
- Compatibilidade com TalkBack e VoiceOver.
- Formulários acessíveis.
- Linguagem simples.
- Funcionamento offline.

---

## Dados e privacidade

- Todos os dados utilizados são fictícios.
- O CPF não é armazenado localmente.
- O usuário pode excluir o cadastro.
- APIs retornam CPF e telefone mascarados.

---

## Estrutura do código

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── alertas.tsx
│   │   ├── ocorrencias.tsx
│   │   └── perfil.tsx
│   └── ocorrencia/
│       └── nova.tsx
├── components/
├── context/
├── db/
├── hooks/
├── services/
├── theme/
├── utils/
└── types.ts

assets/
docs/
```

---

## Critérios da avaliação × Onde ver

| Critério | Onde |
|------------|------------|
| Telas e navegação | `src/app/` |
| Consumo de APIs | `src/services/api.ts` |
| Banco de dados | `src/db/` |
| Acessibilidade | `src/components/` e `src/theme/` |
| Aderência ao problema | Fluxo de alertas e risco |
| Documentação | README + vídeo |

---

## Prints das telas



```text
docs/prints/
```

| Tela | Arquivo |
|--------|----------|
| Risco – Sem risco | `docs/prints/risco-normal.png` |
| Risco – Atenção | `docs/prints/risco-atencao.png` |
| Risco – Alerta | `docs/prints/risco-alerta.png` |
| Alertas | `docs/prints/alertas.png` |
| Ocorrências | `docs/prints/ocorrencias.png` |
| Perfil | `docs/prints/perfil.png` |
| Offline | `docs/prints/offline.png` |

---

## Problemas comuns

| Sintoma | Solução |
|----------|----------|
| Não conecta à API | Verifique IP, rede e firewall |
| Funciona no emulador mas não no celular | Utilize IP da máquina |
| Alertas não aparecem | Validar configuração das APIs |
| Erro HTTP em APK | Utilizar HTTPS |
| Tela branca no Expo Go | Atualizar Expo e limpar cache |
| `expo-sqlite` não encontrado | Executar `npm install` |

---

## Tecnologias Utilizadas

### Mobile

- React Native
- Expo
- TypeScript
- Expo Router

### Banco de Dados

- SQLite

---

## Objetivo

Permitir que moradores de áreas suscetíveis a enchentes recebam alertas antecipados, acompanhem o nível de risco em tempo real e registrem ocorrências, reduzindo impactos causados por alagamentos urbanos.