O meu JSON está hospedado na web utilizando um serviço chamado Glitch (https://glitch.com). Você pode conferir a estrutura e os dados mais atuais do meu JSON no link https://trajetosserver.glitch.me clicando em "trajetos", ou apenas ir direto para o link https://trajetosserver.glitch.me/trajetos .

O meu arquivo JavaScript (MYapp0.js) está configurado para puxar os dados desse JSON hospedado. Portanto, após verificar que o Glitch está hospedando corretamente minha database, basta abrir o html no browser e interagir com as funcionalidades do website! Note que as alterações de dados NÃO aparecerão no "MYdb0.js" local, salvo em seu computador, mas sim serão verificadas em https://trajetosserver.glitch.me/trajetos .

Obs.: a página demora alguns segundinhos para carregar.

---------------------------------------------------------------------------------

CASO você verificar que o meu JSON NÃO está hospedado no link do Glitch mencionado acima, o projeto dependerá do Node.js e JSON Server para funcionar corretamente. Aqui está um guia passo a passo para ajudá-lo a preparar tudo o que você precisa antes de começar.

ANTES de tudo, precisamos mudar o arquivo .json que vamos utilizar. SUBSTITUA a linha do .html que atualmente contém o código "<script src="MYapp0.js"></script>" PELA seguinte linha:
<script src="MYapp_backup.js"></script>

>>>>>>>>>> Passo 1: Instalar Node.js

>> O que é Node.js? 
É uma plataforma de desenvolvimento em JavaScript usada para criar aplicações de rede escaláveis.

>> Como instalar?
  - Acesse o site oficial do Node.js: [Node.js](https://nodejs.org/)
  - Baixe a versão recomendada para o seu sistema operacional (LTS é geralmente a melhor escolha).
  - Execute o instalador baixado e siga as instruções na tela para completar a instalação.
  - Para verificar se foi instalado corretamente, abra seu terminal e digite `node -v` e `npm -v`. Isso mostrará as versões instaladas do Node.js e npm, respectivamente.

>>>>>>>>>> Passo 2: Instalar JSON Server

>> O que é JSON Server? 
  - É um pacote npm que permite criar uma API REST completa usando um arquivo JSON simples.

>> Como instalar?
  - No seu terminal, digite o seguinte comando para instalar o JSON Server globalmente: `npm install -g json-server`
  - Isso permitirá que você use o JSON Server em qualquer projeto no seu computador.

>>>>>>>>>> Passo 3: Iniciar o JSON Server para o meu website

>> Como iniciar?
  - Navegue até o diretório onde está localizado o arquivo `MYdb0.json` que eu compartilhei com você. Esse arquivo contém dados de exemplo para o nosso website.
  - No terminal, estando dentro do diretório correto, execute: `json-server --watch MYdb0.json`
  - Isso iniciará o JSON Server na porta 3000 e você pode acessar os dados do JSON navegando até `http://localhost:3000` em seu navegador.

>>>>>>>>>> Passo 4: Acessar o Site

>> Como acessar?
  - Abra o arquivo HTML principal que está na pasta compartilhada usando um navegador de sua escolha. O arquivo deve se conectar automaticamente ao servidor JSON Server, e você deverá ser capaz de interagir com o site como se estivesse online.

>>>>>>>>>> Dicas Adicionais:
  - Certifique-se de que o JSON Server esteja rodando no fundo enquanto você está avaliando o site (ou seja: não feche o terminal depois de iniciar, apenas minimize).
  - É essencial que você navegue para o caminho correto antes de iniciar o JSON Server. No meu computador, por exemplo, antes de executar o comando `json-server --watch db0.json`, devo ir para a pasta correta escrevendo 'cd Documents\1periodoCCpuc\ti_frontend\sprint03_raquelmotta' no terminal.
  - Se você encontrar algum problema ao tentar acessar o site ou os dados, verifique se o JSON Server está ativo e se o arquivo `db0.json` está no diretório correto.

Espero que essas instruções detalhadas o ajudem a configurar tudo sem problemas. Estou ansiosa pelo seu feedback e agradeço muito pela sua colaboração e tempo dedicado à avaliação do meu projeto.

Atenciosamente,

Raquel Motta