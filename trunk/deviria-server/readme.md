Deviria Server
==============

O servidor Deviria � dividido em duas grandes partes: A primeira delas sendo o "backend"
representado pela API RESTful, a a segunda sendo a �rea de arquivos p�blicos, representando
o conte�do HTML fornecido aos usu�rios finais.

API RESTful
-----------

A API RESTful fornece um meio de obter e enviar informa��es para o banco de dados. � constru�da
utilizando principalmente os plugins Express e Mongoose. O primeiro fornece a estrutura REST, 
bem como outras funcionalidades HTTP e o segundo fornece uma forma de integra��o com o banco 
de dados MongoDB, sendo uma camada acima do Driver padr�o para NodeJS. Esta camada tamb�m �
capaz de enviar comandos para o Facebook utilizando o Plugin adequado.

Camada de Vis�o
---------------

Utilizando principalmente as APIs JQuery, Datatables e Twitter Bootstrap, a camada de vis�o 
cont�m as funcionalidades para apresentar e captar informa��es para o usu�rio final. Tanto em
sua interface administrativa, bem como sua interface aberta do Facebook.

Instala��o
----------

A instala��o deve ser feita com os seguintes passos:
1. Certificar-se de que o MongoDB est� rodando na m�quina local (localhost), na porta padr�o;
2. Executar na raiz do projeto, o comando "npm install". Isso ir� configurar as depend�ncias;
3. Executar na raiz do projeto, o comando "node application.js". Isso inicializar� a aplica��o.

**Aten��o:** Ao longo do desenvolvimento, os dados de teste sempre s�o carregados e qualquer
dado j� existente antes da inicializa��o ser�o removidos. 

Padr�es de Acesso
-----------------

As URLs da API sempre come�am com "/api" e podem ser encontradas no arquivo principal da 
aplica��o (application.js), onde todos os mapeamentos s�o configurados.

Integra��o como Facebook
------------------------

Para configura��o da integra��o com o Facebook, estabelecer os seguintes dados, na
p�gina de aplica��o do Facebook:

* Display Name: Deviria [Nome que ser� atribu�do ao aplicativo]
* Namespace: deviria [URL utilizada para acesso pelo Facebook - https://apps.facebook.com/deviria/]
* App Domains: Dom�nio de hospedagem da aplica��o [URL gerada no AppFog]
* Canvas URL: http://deviria.aws.af.cm/fb/ [URL que ser� obtida em HTTP a partir do servidor]
* Secure Canvas URL: https://deviria.aws.af.cm/fb/ [URL que ser� obtida em HTTPS a partir do servidor]