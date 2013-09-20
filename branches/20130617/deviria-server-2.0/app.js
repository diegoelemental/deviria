/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: application.js
 * versão ....: 2.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Objeto principal de execução do servidor. Cria em nível baixo uma execução de
 * domains, permitindo que erros sejam reportados amigavelmente no console, e 
 * configura em nível mais alto o mapeamento de URLs do servidor.
 */

//----[ Módulos internos e externos utilizados ]-------------------------------

var domain = require('domain')
  , express = require('express')
  , path = require('path')
  , dbinit = require('./dbinit.js')
  , routes = require('./routes.js');
  
//----[ Execução em nível mais baixo ]-----------------------------------------

/**
 * Criação do domínio principal da aplicação. Domínios permitem que a execução
 * principal da aplicação seja separada de um módulo interno, permitindo desta
 * maneira um tratamento adequado de erros de execução sem crash.
 */ 
var mainDomain = domain.create();

/**
 * Tratamento de Runtime Errors ocorridos dentro do domínio principal. Serão
 * direcionados para o console e o módulo de domínio apresentado em formato
 * JSON para melhor interpretação.
 */
mainDomain.on('error', function(err) {
	console.error(err);
});

/**
 * Bloco de execução do domínio. Configuração das rotas do Express e ativação
 * do listener na porta correta (local ou no ambiente cloud).
 */
mainDomain.run(function() {
	
	var app = express();
		
	//
	// Configurações gerais para a API Express. A porta de inicialização deve
	// ser obtida no servidor AppFog, mas caso esteja executando em ambiente
	// local, irá executar na porta 3000.
	//
	app.configure(function() {
		app.set('port', process.env.VCAP_APP_PORT || 3000);
		app.set('view engine', 'ejs');
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({secret: '1234567890QWERTY'}));
		app.use(express.logger(process.env.VCAP_APP_PORT ? "dev" : "dev"));
		app.use(express.static(path.join(__dirname, 'public')));
	});

    //
    // Configuração das áreas de rotas do aplicativo, utilizando o módulo 
    // especializado para esta finalidade.
    //
    routes.initializeFacebookRoutes(app);
    routes.initializeAPIRoutes(app);
    
	//
	// Todas as configurações foram devidamente realizadas. Agora podemos proceder
	// com a inicialização do servidor, utilizando a porta correta, conforme o 
	// ambiente de execução (local ou publicado).
	//
	app.listen(app.get('port'), function() {
        
		console.log('[DEVIRIA] Deviria is active, waiting for adventurers on port %s', app.get('port'));
        console.log('[DEVIRIA] Oh! One more thing, lets prepare our database!');
        dbinit.initializeHeroes();
        
	});

});