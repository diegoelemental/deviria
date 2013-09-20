Deviria Server
==============

O servidor Deviria é dividido em duas grandes partes: A primeira delas sendo o "backend"
representado pela API RESTful, a a segunda sendo a área de arquivos públicos, representando
o conteúdo HTML fornecido aos usuários finais.

API RESTful
-----------

A API RESTful fornece um meio de obter e enviar informações para o banco de dados. É construída
utilizando principalmente os plugins Express e Mongoose. O primeiro fornece a estrutura REST, 
bem como outras funcionalidades HTTP e o segundo fornece uma forma de integração com o banco 
de dados MongoDB, sendo uma camada acima do Driver padrão para NodeJS. Esta camada também é
capaz de enviar comandos para o Facebook utilizando o Plugin adequado.

Camada de Visão
---------------

Utilizando principalmente as APIs JQuery, Datatables e Twitter Bootstrap, a camada de visão 
contém as funcionalidades para apresentar e captar informações para o usuário final. Tanto em
sua interface administrativa, bem como sua interface aberta do Facebook.

Instalação
----------

A instalação deve ser feita com os seguintes passos:
1. Certificar-se de que o MongoDB está rodando na máquina local (localhost), na porta padrão;
2. Executar na raiz do projeto, o comando "npm install". Isso irá configurar as dependências;
3. Executar na raiz do projeto, o comando "node application.js". Isso inicializará a aplicação.

**Atenção:** Ao longo do desenvolvimento, os dados de teste sempre são carregados e qualquer
dado já existente antes da inicialização serão removidos. 

Padrões de Acesso
-----------------

As URLs da API sempre começam com "/api" e podem ser encontradas no arquivo principal da 
aplicação (application.js), onde todos os mapeamentos são configurados.

Integração como Facebook
------------------------

Para configuração da integração com o Facebook, estabelecer os seguintes dados, na
página de aplicação do Facebook:

* Display Name: Deviria [Nome que será atribuído ao aplicativo]
* Namespace: deviria [URL utilizada para acesso pelo Facebook - https://apps.facebook.com/deviria/]
* App Domains: Domínio de hospedagem da aplicação [URL gerada no AppFog]
* Canvas URL: http://deviria.aws.af.cm/fb/ [URL que será obtida em HTTP a partir do servidor]
* Secure Canvas URL: https://deviria.aws.af.cm/fb/ [URL que será obtida em HTTPS a partir do servidor]