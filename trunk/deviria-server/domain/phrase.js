/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: phrase.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Definição do objeto de domínio Phrase. Uma frase é uma parte de uma história,
 * que é selecionada por um jogador e tem suas lacunas preenchidas por outros
 * tipos de elementos, que no fim, somam pontos na partida.
 */

var database = require("./database");
var mongoose = database.mongoose;

/**
 * Definição do Schema para a entidade de domínio Phrase.
 * 
 * Para fins de tabela de registros, considerar os campos, na seguinte ordem:
 * "reference", "contents", "points", "removesPlayer".
 *
 * reference        Código de referência para a frase, utilizado em relacionamentos.
 * contents         Conteúdo da frase, contendo as variáveis de substituição.
 * points           Pontos fornecidos pelo uso da frase.
 * removesPlayer    Ao usar a frase selecionada o jogador-alvo é removido da partida?
 * phrasePrereqs    Referência para frases consideradas como pré-requisitos.
 * placePrereqs		Referência para locais considerados como pré-requisitos.
 * itemPrereqs      Referência para itens considerados como pré-requisitos.
 * npcPrereqs		Referência para NPCs considerados como pré-requisitoss.
 */
var PhraseSchema = new mongoose.Schema({
    reference: {type: String, required: true, unique: true},
    contents: {type: String, required: true},
    points: {type: Number, required: true},
    removesPlayer: {type: Boolean},
    phrasePrereqs: {type: [String]},
	placePrereqs: {type: [String]},
	itemPrereqs: {type: [String]},
	npcPrereqs: {type: [String]}
});
 
/** Obtendo objeto encapsulado pelo Mongoose. */
var Phrase = mongoose.model("Phrases", PhraseSchema);

/** Lista todas as frases cadastradas no servidor. */
var findAll = function(req, res) {

    Phrase.find().sort({reference: 1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No phrases found"
            });
        }
    });

};

/** Busca uma frase específica a partir de seu código de identificação. */
var findByID = function(req, res) {

    var id = req.params.id;
    Phrase.findOne({_id: id}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No phrase found for ID " + id
            });
        }
    });

};

/** Busca uma frase específica a partir de seu código de referência. */
var findByReference = function(req, res) {

    var reference = req.params.reference;
    Phrase.findOne({reference: reference}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No phrase found for reference " + reference
            });
        }
    });

};

/** Busca frases que possuam o pré-requisito informado. */
var findByPrereqs = function(req, res) {

    var prereq = req.params.prereq;
    Phrase.find({prereqs: prereq}).sort({reference: 1}).execFind(function (err, docs) {
        if (docs) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No phrases found for prereq " + prereq
            });
        }
    });

};

/** Adiciona uma nova frase à camada de persistência. */
var create = function(req, res) {
    
    var phrase = new Phrase();
	phrase.reference = req.body.data["reference"];
    phrase.contents = req.body.data["contents"];
    phrase.points = req.body.data["points"];
    phrase.removesPlayer = req.body.data["removesPlayer"];
	if (req.body.data["phrasePrereqs"]) phrase.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) phrase.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) phrase.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) phrase.npcPrereqs = req.body.data["npcPrereqs"].split(",");
    phrase.save(function (err, createdDoc) {
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

/** Atualiza uma frase existente na camada de persistência. */
var update = function(req, res) {

    var id = req.params.id;
	var phraseJSON = {
		reference: req.body.data["reference"],
		points: req.body.data["points"],
		contents: req.body.data["contents"],
		removesPlayer: req.body.data["removesPlayer"]
	};

	if (req.body.data["phrasePrereqs"]) phraseJSON.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) phraseJSON.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) phraseJSON.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) phraseJSON.npcPrereqs = req.body.data["npcPrereqs"].split(",");
	
	var conditions = {_id: id};
	var options = {safe: true, multi: false}; 

	Phrase.update(conditions, phraseJSON, options, function(err, numAffected) {
	
		if (numAffected > 0) {
			
			Phrase.findOne({_id: id}, function(err, doc) {
				res.statusCode = 202;
				res.send(doc);
			});
			
		} else {
		
			res.statusCode = 404;
            res.send({
                status : 404, 
                title: "NOT_FOUND", 
                message : "Unable to update. No place found for ID " + id
            });
		
		}
	
	});

};

/** Remove uma frase a partir de seu identificador. */
var removeByID = function(req, res) {

    var id = req.params.id;
    Phrase.findOne({_id : id}, function(err, doc) {

        if (doc) {
            doc.remove(function (err, deletedDoc) {
                res.statusCode = 202;
                res.send(doc);
            });
        } else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "Unable to delete. No phrase found for ID " + id
            });
        }
    
    });	

};

exports.Phrase = Phrase;
exports.findAll = findAll;
exports.findByID = findByID;
exports.create = create;
exports.update = update;
exports.removeByID = removeByID;
