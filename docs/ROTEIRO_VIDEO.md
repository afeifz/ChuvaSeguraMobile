# Roteiro do vídeo (até 3 minutos)

Grave a tela do celular (ou do emulador) com o app rodando. Todos devem saber explicar o projeto inteiro, então revezem a fala.

| Tempo | O que mostrar | O que falar |
|---|---|---|
| 0:00–0:20 | Aba **Risco** | Quem somos e o problema: moradores do Ipiranga recebem o aviso de alagamento tarde demais. O ChuvaSegura mostra o risco do bairro em linguagem simples |
| 0:20–0:50 | **Simular outro nível** (ou leitura real no Swagger do C#) passando de SEM RISCO para ATENÇÃO e ALERTA | Cor, texto e ícone: o risco não depende só da cor. De onde vêm os dados: API em C# calculando o risco a partir do sensor |
| 0:50–1:20 | Aba **Alertas** e **Marcar como lida** | O aviso chega pela API em Java; quem tem mobilidade reduzida recebe primeiro e já no nível de Atenção |
| 1:20–2:00 | Aba **Ocorrências**: formulário com erro, depois salvando; fechar e reabrir o app | Registro de ocorrências no banco **SQLite** do aparelho; validação com mensagens simples; os dados continuam depois de fechar o app |
| 2:00–2:20 | Parar a API (ou modo avião) e atualizar a tela | Funciona sem internet: mostra o último dado salvo e avisa |
| 2:20–2:45 | Aba **Perfil**: cadastro, modo demonstração e endereços das APIs | Dados fictícios e CPF mascarado; o cidadão pode excluir o cadastro |
| 2:45–3:00 | Voltar à aba Risco | Acessibilidade (fontes grandes, contraste, leitor de tela) e como o app se conecta ao resto do ChuvaSegura (sensor, APIs e ML) |
