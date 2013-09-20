/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: adventure.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Definição do objeto de domínio Adventure. A aventura é o objeto principal da
 * aplicação, utilizando todos os cadastros para outras entidades, consolidando-os
 * por preenchimento de lacunas e substituições, para criar a história do jogo.
 *
 * Este arquivo também contempla as entidades filhas da aventura, que devem ser 
 * conhecidas e acessíveis apenas pela entidade principal.
 */

var database     = require("./database")
  , hero         = require("./hero")
  , phrase       = require("./phrase")
  , place        = require("./place")
  , item         = require("./item")
  , npc          = require("./npc")
  , substitution = require("./substitution");
  
var mongoose = database.mongoose;

/** 
 * Definição do Schema para a entidade de domínio Player.
 *  
 * facebookID       Identificador do perfil de Facebook relacionado.
 * assignedHeroID   Identificador do herói atribuído ao jogador.
 * currentlyActive  O jogador encontra-se ativo na aventura?
 * pointsEarned     Quantidade de pontos obtidos pelo jogador. 
 * dateJoined       Data na qual o jogador foi adicionado à aventura.
 */
var PlayerSchema = new mongoose.Schema({
    facebookID: {type: String, required: true},
    assignedHeroID: {type: String, required: true},
    currentlyActive: {type: Boolean, required: true},
    pointsEarned: {type: Number},
    dateJoined: {type: Date, required: true, default: Date.now}
});

/**
 * Definição do Schema para a entidade de domínio Tale.
 * 
 * authorFacebookID Identifiador do perfil de Faceobok do autor.
 * convertedPhrase  Conteúdo final da frase adicionada pelo conto.
 * pointsEarned     Pontos obtidos no conto publicado.
 * datePublished    Data de publicação do conto na aventura.
 * imageURL         URL da imagem que será publicada junto ao conto.
 */
var TaleSchema = new mongoose.Schema({
    authorFacebookID: {type: String, required: false},
    convertedPhrase: {type: String, required: true},
    pointsEarned: {type: Number, required: true},
    datePublished: {type: Date, required: true, default: Date.now},
    imageURL: {type: String, required: false}
});

/**
 * Definição do Schema para a entidade de domínio Adventure.
 *
 * authorFacebookID     Identificador do perfil de Facebook criador da aventura.
 * players              Lista de jogadores que fazem parte da aventura.
 * tales                Lista de contos que compõem a aventura.
 * dateStarted          Data de início da aventura.
 * size                 Tamanho da aventura: "S", "M", "L".
 */
var AdventureSchema = new mongoose.Schema({
    authorFacebookID: {type: String, required: true},
    players: {type: [PlayerSchema]},
    tales: {type: [TaleSchema]},
    dateStarted: {type: Date, required: true, default: Date.now},
	points: {type: Number, required: true},
    size: {
        type: String, 
        required: true, 
        enum: ["S", "M", "L"]
    }
});
 
/** Obtendo objetos encapsulados pelo Mongoose. */
var Player = mongoose.model("Players", PlayerSchema)
  , Tale = mongoose.model("Tales", TaleSchema)
  , Adventure = mongoose.model("Adventures", AdventureSchema);

// Imports necessários

var S = require("string");
var Lexer = require("lex");

/**
 * Faz o parse da frase, retornando uma lista de pontos de inserção e substituições encontradas 
 *
 * @param content  O string contendo o texto puro para fazer o parse.
 * @return
 *     um dicionário contendo um array de pontos de inserção e substituições encontrados. 
 */
var parsePhrase = function(content) {
    var lex = new Lexer;
    var insertions = [];
    var substitutions = [];
    var currentPoint = 0;

    lex.addRule(/\s/, function(lexeme) { //white spaces 
    });

    lex.addRule(/./, function(lexeme) { //white spaces 
    });

    lex.addRule(/<P\d?>/, function(lexeme) { // Heroes
        var insertion = {};
        insertion.type = "P";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/<O\d?>/, function(lexeme) { // Items
        var insertion = {};
        insertion.type = "O";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/<N\d?>/, function(lexeme) { // NPCs 
        var insertion = {};
        insertion.type = "N";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/<C\d?>/, function(lexeme) { // Places 
        var insertion = {};
        insertion.type = "C";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/\[[^:]+?\]/, function(lexeme) { // Substitutions sem ref
        var subst = {};
        subst.pos = currentPoint;
        subst.value = lexeme;
        substitutions.push(subst);
    });

    lex.addRule(/\[[^\]:]+:[PONC]\d?\]/, function(lexeme) { // Substitutions com ref
        var ref = "<"+S(lexeme).between(":","]").s+">";
        var pos = -1;
        for (var pos=0; pos<=insertions.length; pos++) {
            if (insertions[pos].ref == ref) {
                break;
            }
        }
        var subst = {};
        subst.pos = pos
        subst.value = lexeme;
        substitutions.push(subst);
    });

    lex.setInput(content);
    lex.lex();
    substitutions.sort(function(a,b){return a.pos-b.pos;});
    return {"ins":insertions, "subs":substitutions};

}

var processSubstitutions = function(content, sub_places, subs, obj) {
    for (var s in sub_places) {
        var sub_ref = sub_places[s].value;

        var sub_name = S(sub_ref);
        if (sub_name.contains(":"))
            sub_name = sub_name.between("[",":").s;
        else
            sub_name = sub_name.between("[","]").s;
        var sub = subs.filter(function(s) {return s.name == sub_name})[0];
        if (obj.grammaticalGender == "M") {
            if (obj.number == "P") {
                content = content.replace(sub_ref, sub.malePluralForm);
            } else {
                content = content.replace(sub_ref, sub.maleSingularForm);
            }
        } else {
            if (obj.grammaticalNumber == "P") {
                content = content.replace(sub_ref, sub.femalePluralForm);
            } else {
                content = content.replace(sub_ref, sub.femaleSingularForm);
            }
        }
    }
    return content;
}

/**
 * Processa uma frase fornecida, adicionando o jogador, elementos adicionais
 * e os ajustes de concordância, conforme necessário.
 *
 * @param phrase   Frase base que será processada e convertida.
 * @param heroes   Array ordenado de heróis participantes da frase.
 * @param places   Array ordenado de locais que serão inseridos na frase.
 * @param items    Array ordenado de itens que serão inseridos na frase.
 * @param npcs     Array ordenado de NPCs que serão inseridos na frase.
 * @return
 *      O conteúdo da frase, convertido para um conto, utilizando todos os
 *      elementos fornecidos em substituição aos tokens originais.
 */
var processTale = function(phrase, heroes, places, items, npcs, substitutions) {

    // fazer o parse do conteudo da Phrase e encontrar os pontos de inserção e as substituições relacionadas
    var content = phrase.contents;
    var parsed = parsePhrase(content);
    var insertions = parsed["ins"];
    var sub_places = parsed["subs"];
    var pointsEarned = phrase.points;

    for (var i in insertions) {
        var insertion = insertions[i];

        switch (insertion.type) {
            case "P":
                var hero = heroes.shift();
                if (typeof hero == 'undefined') throw new Error("Missing hero for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, hero.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, hero);
                break;
            case "O":
                var item = items.shift();
                if (typeof item == 'undefined') throw new Error("Missing item for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, item.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, item);
                pointsEarned += item.points;
                break;
            case "N":
                var npc = npcs.shift();
                if (typeof npc == 'undefined') throw new Error("Missing npc for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, npc.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, npc);
                pointsEarned += npc.points;
                break;
            case "C":
                var place = places.shift();
                if (typeof place == 'undefined') throw new Error("Missing place for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, place.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, place);
                pointsEarned += place.points;
                break;
        }
    }

    // cria o objeto Tale e retorna
    var tale = new Tale();
    tale.convertedPhrase = S(content).left(1).capitalize().s + content.slice(1);
    tale.pointsEarned = pointsEarned;
	tale.save(function (err, createdDoc) {
		if (err) console.log("Error creating tale: "+content+" with "+err);
	});
    return tale;
}

var findTopOneHundred = function(req, res) {

    Adventure.find().sort({points: -1}).limit(100).execFind(function (err, docs) {
        if (docs && docs.length > 0){
			for(var i = 0; i < docs.length; i++){
				var curr_date = docs[i].dateStarted.getDate()<9?"0"+docs[i].dateStarted.getDate():docs[i].dateStarted.getDate();
				var curr_month = docs[i].dateStarted.getMonth()<8?"0"+(docs[i].dateStarted.getMonth()+ 1):docs[i].dateStarted.getMonth()+ 1;
				var curr_year = docs[i].dateStarted.getFullYear();
 				docs[i].dateString = curr_date +"/"+curr_month+"/"+curr_year;
			}
        }else{
			docs = undefined;
		}
		
		res.render("index", {
			title: "Deviria Adeventures",
			adventures: docs
		});


    });

}; 

var findAllAdventures = function(req, res) {

    Adventure.find().execFind(function (err, docs) {
        if (docs && docs.length > 0){
			res.send(docs);
		}else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No adventures found"
            });
        }

    });

};

/** Adiciona uma nova aventura à camada de persistência. */
var createAdventure = function(req, res) {
    var adventure = new Adventure();
	adventure.authorFacebookID = req.body.params.authorFacebookID;
	adventure.points = req.body.params.points;
	adventure.size = req.body.params.size;
	adventure.players = new Array();
	var player;
	for(var i =0; i < req.body.params.players; i++){
		player = new Player();
		player.facebookID = req.body.params.players[i].facebookID;
		player.assignedHeroID = req.body.params.players[i].assignedHeroID;
		player.currentlyActive = req.body.params.players[i].currentlyActive;
		player.save(function (err, createdDoc) {
			if (err) {
				res.statusCode = 400;
				res.send({
					status: 400, 
					title: "BAD_REQUISITION", 
					message: err
				});
			}else{
				adventure.players.push(createdDoc);
			}
		
		});
	}	
    adventure.save(function (err, createdDoc) {
        if (err) {
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

exports.processTale = processTale;
exports.findTopOneHundred = findTopOneHundred;
exports.createAdventure = createAdventure;
exports.Adventure = Adventure;
