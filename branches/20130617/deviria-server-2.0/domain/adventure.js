/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: adventure.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Definição do objeto de dominio Adventure. A aventura é o objeto principal da
 * aplicação, utilizando todos os cadastros para outras entidades, consolidando-os
 * por preenchimento de lacunas e substituições, para criar a história do jogo.
 *
 * Este arquivo também contempla as entidades filhas da aventura, que devem ser 
 * conhecidas e acessíveis apenas pela entidade principal.
 */

var database = require('./database.js')
  , processor = require('../core/processor.js')
  , Phrase = require('../domain/phrase').Phrase
  , mongoose = database.mongoose;

/**
 * Esquema das informações do Facebook utilizadas nos cadastros.
 * 
 * userID       Identificador de usuário.
 * displayName  Nome de exibição do usuário.
 */
var FacebookInfoSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    displayName: {type: String, required: true}
});




  
/** 
 * Um player representa um usuário do Facebook participante na história.
 *  
 * facebookInfo     Informações do Facebook.
 * assignedHeroID   Identificador do herói atribuído ao jogador.
 * currentlyActive  O jogador encontra-se ativo na aventura?
 * pointsEarned     Quantidade de pontos obtidos pelo jogador. 
 * dateJoined       Data na qual o jogador foi adicionado à aventura.
 */
var PlayerSchema = new mongoose.Schema({
    facebookInfo: {
	    userID: {type: String, required: true},
		displayName: {type: String, required: true}
	},
    assignedHeroID: {type: String, required: true},
	currentlyActive: {type: Boolean, required: true, default: true},
    pointsEarned: {type: Number, required: true, default: 0},
    dateJoined: {type: Date, required: true, default: Date.now}
});

/**
 * Definição do Schema para a entidade de domínio Tale.
 * 
 * author           Identifiador do perfil de Faceobok do autor.
 * convertedPhrase  Conteúdo final da frase adicionada pelo conto.
 * pointsEarned     Pontos obtidos no conto publicado.
 * published        Data de publicação do conto na aventura.
 * imageURL         URL da imagem que será publicada junto ao conto.
 */
var TaleSchema = new mongoose.Schema({
    convertedPhrase: {type: String, required: true},
    pointsEarned: {type: Number, required: true},
    published: {type: Date, required: true, default: Date.now},
    imageURL: {type: String, required: false}
});

/**
 * Definição do Schema para a entidade de domínio Adventure.
 *
 * title                Título da aventura.
 * players				Jogadores da aventura.
 * currentTurn          Identificador do FB para o jogador da rodada.
 * started              Data de Início da aventura.
 * lastAction           Data da última ação feita na aventura.
 * pointsEarned			Quantidade atual de pontos.
 * size                 Tamanho da aventura: "S", "M", "L".
 */
var AdventureSchema = new mongoose.Schema({
	title: {type: String, required: true},
    /*
    author: {
	    userID: {type: String, required: true},
		displayName: {type: String, required: true}	
	},
    */
    author: {
        userID: {type: String, required: true},
        displayName: {type: String, required: true} 
    },
	players: {type: [PlayerSchema], required: true},
    tales: {type: [TaleSchema]},
    currentTurn: {type: String, required: true},
    started: {type: Date, required: true, default: Date.now},
    lastAction: {type: Date, required: true, default: Date.now},
	pointsEarned: {type: Number, required: true, default: 0},
    size: {
        type: String, 
        required: true, 
        enum: ["S", "M", "L"]
    }
});
 
/** Embalar a entidade "Adventure" em um schema Mongoose. */
var Adventure = mongoose.model("Adventures", AdventureSchema);
var Player = mongoose.model("Players", PlayerSchema);


/** Lista uma aventura a partir de seu identificador. */
var findAdventureByID = function(req, res) {
    console.log('[DEVIRIA] - PROCURANDO AVENTURA PELO ID');
    var adventureID = req.params.adventureID;
    Adventure.findOne({_id : adventureID}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No adventure found for ID" + adventureID
            });
		}
    });
}

/**
 * Busca as aventuras de maior pontuação atualmente disponíveis no servidor.
 * Irá limitar a pesquisa aos 25 primeiros registros encontrados.
 */
var findTopRankedAdventures = function(req, res) {
    console.log('[DEVIRIA] - PROCURANDO AVENTURA TOP');
    Adventure.find().sort({pointsEarned: -1}).limit(25).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No adventures found"
            });
		}
    });
}; 

/**
 * Busca as aventuras de um jogador, a partir de seu ID de Facebook.
 * A listagem de aventuras será ordenada pela data de início, descendente.
 */
var findAdventuresByFacebookUser = function(req, res) {
    console.log('[DEVIRIA] - PROCURANDO AVENTURA PELO USUARIO FACE');
	var facebookUserID = req.params.facebookUserID;
    Adventure.find({'authorUserID': facebookUserID}).sort({dateStarted: -1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No adventures found"
            });
		}
    });
};
/**
 * Busca as aventuras que um jogador está participando, a partir de seu ID de Facebook.
 * A listagem de aventuras será ordenada pela data de início, descendente.
 */
var findAdventuresWithMe = function(req, res) {
    console.log('[DEVIRIA] - PROCURANDO AVENTURA COM O USUARIO');
    var facebookUserID = req.params.facebookUserID;
    Adventure.find({'players.facebookInfo.userID': facebookUserID}).sort({dateStarted: -1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No adventures found"
            });
        }
    });
};

/** 
 * Adiciona uma nova aventura à camada de persistência. 
 *
 * Irá processar os dados de autor, com o nome de apresentação e identificador,
 * fornecidos pelo grafo social do Facebook. Processará os amigos fornecidos,
 * bem como suas respectivas informações de Facebook também.
 *
 * Em seguida irá obter os dados da aventura e criar a história, para que em
 * seguida, possa receber os novos Tales. Lembrando que o turno atual deve ser
 * do personagem criador da aventura.
 */
var createAdventure = function(req, res) {
    var postData = req.body;

    var author = {};
    author.userID = postData.authorUserID;
    author.displayName = postData.authorDisplayName;

    var players = [];
    for (i=0; i<postData.selectedPlayers.length; i++) {
        var player = new Player();
        player.assignedHeroID = postData.selectedPlayers[i].assignedHeroID;
        player.facebookInfo = {
            userID: postData.selectedPlayers[i].userID,
            displayName: postData.selectedPlayers[i].displayName
        };
        players.push(player);
    }
    
    var adventure = new Adventure();
    adventure.title = postData.title;
    adventure.author = author;
    adventure.players = players;
    adventure.currentTurn = author.userID;
    adventure.size = postData.size;
    console.log(adventure);
    adventure.save(function (err, createdDoc) {
        if (err) {
            console.log(err);
            res.statusCode = 400;
            res.send({
                status: 400, 
                title: "BAD_REQUISITION", 
                message: err
            });
        } else {
            res.statusCode = 201;
            res.send(createdDoc);
        }
    });
    
};

var addTaleToAdventure = function(req, res) {
     console.log('TENTANDO ADICIONAR UM TALE');
    var adventureID = req.params.adventureID;
    //adicionar o tale tratado na aventura
    //adicionar no fim do array
    var tale = new Tale();
    tale.convertedPhrase = "Um grupo de aventureiros chamados potros selvagens.";
    pointsEarned = 90;

    Adventure.update({_id: '51d49fbe27ac68dc0b00000a' },
                        {$push: { 'tales' : tale }}, 
                            function(err, data) { 
                                }
    );

};

var updateAdventureName = function(req, res) {

    var adventureID = req.params.adventureID;
    //alterar o nome da aventura quando ela for finalizada

};

exports.Adventure = Adventure;
exports.findAdventureByID = findAdventureByID;
exports.findTopRankedAdventures = findTopRankedAdventures;
exports.findAdventuresByFacebookUser = findAdventuresByFacebookUser;
exports.createAdventure = createAdventure;
exports.addTaleToAdventure = addTaleToAdventure;
exports.findAdventuresWithMe = findAdventuresWithMe;