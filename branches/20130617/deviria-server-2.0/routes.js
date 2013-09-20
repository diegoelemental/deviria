/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: routes.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Estabelece as rotas de acesso para o aplicativo. Rotas são caminhos HTTP que
 * podem ser acessados por um cliente HTML, como um navegador ou para atender
 * requisições REST para a API interna do programa.
 */

var signedRequest = require('signed-request')
  , facebook = require('./integration/facebook.js')
  , hero = require('./domain/hero.js')
  , item = require('./domain/item.js')
  , npc = require('./domain/npc.js')  
  , phrase = require('./domain/phrase.js')
  , adventure = require('./domain/adventure.js');

/**
 * Inicializa as rotas utilizadas para a visualização de páginas do Facebook.
 * As telas do Facebook devem ser cercadas por uma validação de request assinado,
 * determinado pela presença do atributo "signed_request". 
 *
 * Sendo assim, para todas as requisições, existe uma diretriz que busca esta
 * assinatura e, caso exista, direciona para a requisição correta. Caso contrário 
 * envia o usuário para uma tela de login e permissões do app.
 *
 * @param app   App Express configurado, que receberá as rotas do Facebook.
 */
var initializeFacebookRoutes = function(app) {

    //
    // Predecessão para todas as requisições "/fb/". A responsabilidade desta
    // rota genérica é garantir que as requisições possuam um "signed_request".
    // E caso possuam, fornece o objeto "me" obtido pelo grafo social.
    //
    // Este objeto é disponibilizado para as rotas filhas, dentro da requisição,
    // em uma variável também chamada "me".
    //
    app.all('/fb/*', function(req, res, next) {
		facebook.verifyAndInitializeUserIfNeeded(req, res, next);
	});

    //
    // Página inicial da aplicação apresentada no Facebook. Todos os jogadores
    // serão direcionados para esta URL ao abrir a aplicação. O Facebook irá 
    // enviar uma requisição POST para a URL "/fb/".
    //
    app.all('/fb/', function(req, res, next) {
        res.render('overview', {
			facebookUserName: req.session.facebookUserInfo.name,
			facebookUserID: req.session.facebookUserID,
			pageTitle: 'Olá ' + req.session.facebookUserInfo.name + '! Seja bem-vindo'
        });
    });

    //
    // Página para a criação da aventura. Nela, os personagens serão selecionados
    // e os detalhes gerais da aventura serão definidos. 
    //
    app.get('/fb/newAdventure', function(req, res, next) {
		var rawFriends = req.session.facebookUserInfo.friends.data;
		var convertedFriends = [];
		for (i=0; i<rawFriends.length; i++) {
			var rawFriend = rawFriends[i];
			var friend = {
				value: rawFriend.id,
				label: rawFriend.name,
				img: 'https://graph.facebook.com/'+rawFriend.id+'/picture'
			};
			convertedFriends.push(friend);
		}
        res.render('new_adventure', {
			facebookUserName: req.session.facebookUserInfo.name,
			facebookUserID: req.session.facebookUserID,
			facebookUserFriends: JSON.stringify(convertedFriends),
			pageTitle: 'Iniciar uma aventura'
        });
    });

    app.get('/fb/createAdventure', function(req, res, next){
        
        //adventure.createAdventure(req, res);
        adventure.findAdventureByID(req, res);
        /*
        res.render('overview', {
            facebookUserName: req.session.facebookUserInfo.name,
            facebookUserID: req.session.facebookUserID,
            pageTitle: 'Parabéns ' + req.session.facebookUserInfo.name + '! Você criou uma frase'
        });
        */
    });

    app.post('/fb/showAdventure', function(req, res, next){
        var rawFriends = req.session.facebookUserInfo.friends.data;
        var convertedFriends = [];
        for (i=0; i<rawFriends.length; i++) {
            var rawFriend = rawFriends[i];
            var friend = {
                value: rawFriend.id,
                label: rawFriend.name,
                img: 'https://graph.facebook.com/'+rawFriend.id+'/picture'
            };
            convertedFriends.push(friend);
        }
        var postData = req.body;
        if (postData.adventureID) {
            res.render('show_adventure', {
                facebookUserName: req.session.facebookUserInfo.name,
                facebookUserID: req.session.facebookUserID,
                facebookUserFriends: JSON.stringify(convertedFriends),
                adventureID: postData.adventureID,
                pageTitle: 'Visualizar uma aventura'
            });
        }
        //adventure.addTaleToAdventure(req, res);
        /*
        res.render('show_adventure', {
            facebookUserName: req.session.facebookUserInfo.name,
            facebookUserID: req.session.facebookUserID,
            facebookUserFriends: JSON.stringify(convertedFriends),
            pageTitle: 'Aventura'
        });
*/
    });
	
};

/**
 * Inicializa as rotas de API utilizadas pelas camadas de visão.
 * 
 * A API consiste em uma biblioteca de serviços RESTful, que permitem interação
 * com a camada de persistência ou módulos de integração, que serão manipulados
 * e apresentados para o cliente, conforme necessário.
 *
 * Todos os serviços de API possuem diretriz de "Access-Control-Allow-Origin" 
 * estabelecida para "*", ou seja, são acessíveis externamente. Porém verificam
 * a existência de um header de autenticação válido.
 *
 * @param app   App Express configurado, que receberá as rotas da API. 
 */
var initializeAPIRoutes = function(app) {
    
    //
    // Libera o acesso à API para origens externas, utilizando o header de
    // resposta "Access-Control-Allow-Origin", estabelecido para "*".
    //
    // Adicionalmente, verifica se foram fornecidos headers de segurança para
    // uso da API, evitando acesso indevido por fontes desconhecidas.
    //
    app.all('/api/*', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	});
    
	app.get   ('/api/heroes', hero.findAllHeroes);
    app.get   ('/api/items', item.findAllItems);
    app.get   ('/api/items/:itemID', item.findItemByID);
    app.get   ('/api/items/ref/:reference', item.findItemsByReference);
    app.get   ('/api/items/prereq/:prereqs', item.findItemsByReference);
    app.get   ('/api/npcs', npc.findAllNPCs);
    app.get   ('/api/npcs/:npcID', npc.findNPCByID);
    app.get   ('/api/npcs/ref/:reference', npc.findNPCsByReference);
    app.get   ('/api/npcs/prereq/:prereqs', npc.findNPCsByReference);
    app.get   ('/api/phrases', phrase.findAllPhrases);
    app.get   ('/api/phrases/:phraseID', phrase.findPhraseByID);
    app.get   ('/api/phrases/ref/:reference', phrase.findPhraseByReference);
    app.get   ('/api/phrases/prereq/:prereqs', phrase.findPhrasesByPrereqs);
    app.get   ('/api/adventures/top', adventure.findTopRankedAdventures);
    app.get   ('/api/adventures/:adventureID', adventure.findAdventureByID);
	app.get   ('/api/adventures/fbuser/:facebookUserID', adventure.findAdventuresByFacebookUser);
    app.get   ('/api/adventures/me', adventure.findAdventuresWithMe);
    app.post  ('/api/item', item.createItem);
    app.post  ('/api/npc', npc.createNPC);
    app.post  ('/api/phrase', phrase.createPhrase);
    app.post  ('/api/adventures', adventure.createAdventure);
    
    app.put   ('/api/item/:itemID', item.updateItem);
    app.put   ('/api/npc/:npcID', npc.updateNPC);
    app.put   ('/api/phrase/:phraseID', phrase.updatePhrase);
    app.delete('/api/item/:itemID', item.deleteItem);
    app.delete('/api/npc/:npcID', npc.deleteNPC);
    app.delete('/api/phrase/:phraseID', phrase.deletePhrase);
}

exports.initializeFacebookRoutes = initializeFacebookRoutes;
exports.initializeAPIRoutes = initializeAPIRoutes;