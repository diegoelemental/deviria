/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: application.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Objeto principal de execução do servidor. Cria em nível baixo uma execução de
 * domínios, permitindo que erros sejam reportados amigavelmente no console, e 
 * configura em nível mais alto o mapeamento de URLs do servidor.
 */

//----[ Módulos internos e externos utilizados ]-------------------------------

var express      = require("express")
  , path         = require("path")
  , http         = require("http")
  , domain       = require("domain")
  , hero         = require("./domain/hero")
  , phrase       = require("./domain/phrase")
  , place        = require("./domain/place")
  , item         = require("./domain/item")
  , npc          = require("./domain/npc")
  , substitution = require("./domain/substitution")
  , adventure    = require("./domain/adventure")
  , facebook     = require('./facebook');

//----[ Execução do nível mais baixo ]-----------------------------------------

/**
 * Criação do domínio principal da aplicação. Domínios permitem que a execução
 * principal da aplicação seja separada de um módulo interno, permitindo desta
 * maneira um tratamento adequado de erros de execução sem crash.
 */ 
var mainDomain = domain.create();

/**
 * Tratamento de Runtime Errors ocorridos dentro do domínio principal. Serão
 * direcionados para o console e o módulo de domínio apresentará em formato
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
	
	var conf = {
		client_id:      '480845948672620',
		client_secret:  '385c6788563d46bfad0e7b076bc05ff8',
		scope:          'email, publish_stream',
		redirect_uri:   'https://apps.facebook.com/deviria-tests/'
	};
	
	//
	// Configurações gerais para a API Express, como porta de publicação
	// (de acordo com o ambiente), formato de log, mecanismo de renderização
	// de templates e CSS.
	//
	app.configure(function(){
		app.set("port", process.env.VCAP_APP_PORT || 3000);
		app.set('view engine', 'jade');
        app.use(express.logger(process.env.VCAP_APP_PORT ? "default" : "tiny"));  /* 'default', 'short', 'tiny', 'dev' */
        app.use(express.bodyParser()),
        app.use(express.static(path.join(__dirname, "public")));
		app.use(require('stylus').middleware(__dirname + '/public'));
		app.use(app.router);
	});
		
	//
	// Rotas para o módulo "Heroes". Estas rotas fazem parte da API RESTFul,
	// disponibilizadas para operações CRUD do domínio definido.
	//
    app.get("/api/heroes", hero.findAll);
    app.get("/api/heroes/:id", hero.findByID);
    app.post("/api/heroes", hero.create);
    app.put("/api/heroes/:id", hero.update);
    app.delete ("/api/heroes/:id", hero.removeByID);

	//
	// Rotas para o módulo "Phrases". Estas rotas fazem parte da API RESTFul,
	// disponibilizadas para operações CRUD do domínio definido.
	//    
    app.get("/api/phrases", phrase.findAll);
    app.get("/api/phrases/:id", phrase.findByID);
    app.get("/api/phrases/reference/:reference", phrase.findByReference);
    app.get("/api/phrases/prereqs/:prereq", phrase.findByPrereqs);
    app.post("/api/phrases", phrase.create);
    app.put("/api/phrases/:id", phrase.update);
    app.delete("/api/phrases/:id", phrase.removeByID);

	//
	// Rotas para o módulo "Places". Estas rotas fazem parte da API RESTFul,
	// disponibilizadas para operações CRUD do domínio definido.
	//
    app.get("/api/places", place.findAll);
    app.get("/api/places/:id", place.findByID);
    app.get("/api/places/reference/:reference", place.findByReference);
    app.get("/api/places/prereqs/:prereq", place.findByPrereqs);
    app.post("/api/places", place.create);
    app.put("/api/places/:id", place.update);
    app.delete("/api/places/:id", place.removeByID);
    
	//
	// Rotas para o módulo "Items". Estas rotas fazem parte da API RESTFul,
	// disponibilizadas para operações CRUD do domínio definido.
	//
    app.get("/api/items", item.findAll);
    app.get("/api/items/:id", item.findByID);
    app.get("/api/items/reference/:reference", item.findByReference);
    app.get("/api/items/prereqs/:prereq", item.findByPrereqs);
    app.post("/api/items", item.create);
    app.put("/api/items/:id", item.update);
    app.delete("/api/items/:id", item.removeByID);
    
	//
	// Rotas para o módulo "NPCs". Estas rotas fazem parte da API RESTFul,
	// disponibilizadas para operações CRUD do domínio definido.
	//
    app.get("/api/npcs", npc.findAll);
    app.get("/api/npcs/:id", npc.findByID);
    app.get("/api/npcs/reference/:reference", npc.findByReference);
    app.get("/api/npcs/prereqs/:prereq", npc.findByPrereqs);
    app.post("/api/npcs", npc.create);
    app.put("/api/npcs/:id", npc.update);
    app.delete("/api/npcs/:id", npc.removeByID);
    
	//
	// Rotas para o módulo "substitutions". Estas rotas fazem parte da API
	// RESTFul, disponibilizadas para operações CRUD do domínio definido.
	//
    app.get ("/api/substitutions", substitution.findAll);
    app.get ("/api/substitutions/:id", substitution.findByID);
    app.get ("/api/substitutions/name/:name", substitution.findByName);
    app.post("/api/substitutions", substitution.create);
    app.put ("/api/substitutions/:id", substitution.update);
    app.delete ("/api/substitutions/:id", substitution.removeByID);
    
	//
	// Rotas para o módulo "adventures". Estas rotas fazem parte da API
	// RESTFul, disponibilizadas para operações CRUD do domínio definido.
	//
	//app.get ("/api/adventures/toprated", adventure.findTopRated);
	
	app.post("/api/adventures", adventure.createAdventure);
/*    
    app.get ("/api/adventures/:id", adventure.findByID);
    app.get ("/api/adventures/:id/players", adventure.findPlayersInAdventure);
    app.get ("/api/adventures/:id/tales", adventure.findTalesInAdventure);
*/

/*  app.post("/api/adventures/:id/players", adventures.addPlayerToAdventure);
    app.post("/api/adventures/:id/tales", adventures.addTaleToAdventure);
    */
    
	//
	// Rotas para a camada dinâmica de visão do aplicativo, exibida dentro
	// do Frame do Facebook, sendo portanto a aplicação real.
	//

	app.get('/fb/', adventure.findTopOneHundred);

	app.get('/fb/createAdventure', hero.findHeroesToFacebookChoose);
	
	app.post('/fb/', function(req, res) {
		facebook.parseSignedRequest(req);
		res.render("index", {
			title: "Deviria Adeventures"
		});
	});
	
	//
	// Todas as configurações foram devidamente realizadas. Agora podemos proceder
	// com a inicialização do servidor, utilizando a porta correta, conforme o 
	// ambiente de execução (local ou publicado).
	//
	app.listen(app.get("port"), function() {
		console.log("[SERVER] Deviria is active, waiting for adventurers on port %s", app.get("port"));
		var dc = require("./dccomics/dc.js");
		dc.initialize();
	});

});