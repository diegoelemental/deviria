/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: phrase.js
 * vers�o ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Defini��o do objeto de dom�nio Phrase. Uma frase � uma parte de uma hist�ria,
 * que � selecionada por um jogador e tem suas lacunas preenchidas por outros
 * tipos de elementos, que no fim, somam pontos na partida.
 */

var database = require("./database");
var mongoose = database.mongoose;

/**
 * Defini��o do Schema para a entidade de dom�nio Phrase.
 * 
 * Para fins de tabela de registros, considerar os campos, na seguinte ordem:
 * "reference", "contents", "points", "removesPlayer".
 *
 * reference        C�digo de refer�ncia para a frase, utilizado em relacionamentos.
 * contents         Conte�do da frase, contendo as vari�veis de substitui��o.
 * points           Pontos fornecidos pelo uso da frase.
 * removesPlayer    Ao usar a frase selecionada o jogador-alvo � removido da partida?
 * phrasePrereqs    Refer�ncia para frases consideradas como pr�-requisitos.
 * placePrereqs		Refer�ncia para locais considerados como pr�-requisitos.
 * itemPrereqs      Refer�ncia para itens considerados como pr�-requisitos.
 * npcPrereqs		Refer�ncia para NPCs considerados como pr�-requisitoss.
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

/** Busca uma frase espec�fica a partir de seu c�digo de identifica��o. */
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

/** Busca uma frase espec�fica a partir de seu c�digo de refer�ncia. */
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

/** Busca frases que possuam o pr�-requisito informado. */
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

/** Adiciona uma nova frase � camada de persist�ncia. */
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

/** Atualiza uma frase existente na camada de persist�ncia. */
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
