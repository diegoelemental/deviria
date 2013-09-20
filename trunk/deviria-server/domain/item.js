/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: item.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Definição do objeto de domínio Item. Um item é um objeto qualquer inserido
 * em uma frase, que adiciona pontos à história.
 */

var database = require("./database");
var mongoose = database.mongoose;

/**
 * Definição do Schema para a entidade de domínio Item.
 *
 * Para fins de tabela de registros, considerar os campos, na seguinte ordem:
 * "reference", "name", "points", "grammaticalGender", "grammaticalNumber".
 * 
 * reference            Código de referência para o item, utilizado em relacionamentos.
 * name                 Nome do item exibido pelo jogo.
 * points               Quantidade de pontos adicionados mediante uso do item.
 * phrasePrereqs    	Referência para frases consideradas como pré-requisitos.
 * placePrereqs			Referência para locais considerados como pré-requisitos.
 * itemPrereqs      	Referência para itens considerados como pré-requisitos.
 * npcPrereqs			Referência para NPCs considerados como pré-requisitoss.
 * grammaticalGender    Gênero do item, permitindo "M" ou "F".
 * grammaticalNumber    Grau do item, permitindo "S" ou "P".
 */
var ItemSchema = new mongoose.Schema({
    reference: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    points: {type: Number, required: true},
    phrasePrereqs: {type: [String]},
	placePrereqs: {type: [String]},
	itemPrereqs: {type: [String]},
	npcPrereqs: {type: [String]},
    grammaticalGender: {type: String, required: true, enum: ["M", "F"]},
    grammaticalNumber: {type: String, required: true, enum: ["S", "P"]}
});

/** Obtendo objeto encapsulado pelo Mongoose. */
var Item = mongoose.model("Items", ItemSchema);

/** Lista todos os itens cadastrados no servidor. */
var findAll = function(req, res) {

    Item.find().sort({reference : 1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No items found"
            });
        }
    });

};

/** Busca um item específico a partir de seu código de identificação. */
var findByID = function(req, res) {

    var id = req.params.id;
    Item.findOne({_id : id}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No item found for ID " + id
            });
        }
    });

};

/** Busca uma frase específica a partir de seu código de referência. */
var findByReference = function(req, res) {

    var reference = req.params.reference;
    Item.findOne({reference: reference}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No item found for reference " + reference
            });
        }
    });

};

/** Busca itens que possuam o pré-requisito informado. */
var findByPrereqs = function(req, res) {

    var prereq = req.params.prereq;
    Item.find({prereqs: prereq}).sort({reference: 1}).execFind(function (err, docs) {
        if (docs) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No items found for prereq " + prereq
            });
        }
    });

};

/** Adiciona um novo local à camada de persistência. */
var create = function(req, res) {
    
    var item = new Item();
	item.reference = req.body.data["reference"];
    item.name = req.body.data["name"];
    item.points = req.body.data["points"];
	if (req.body.data["phrasePrereqs"]) item.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) item.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) item.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) item.npcPrereqs = req.body.data["npcPrereqs"].split(",");
	item.grammaticalGender = req.body.data["grammaticalGender"];
    item.grammaticalNumber = req.body.data["grammaticalNumber"];

    item.save(function (err, createdDoc) {
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

/** Atualiza um item existente na camada de persistência. */
var update = function(req, res) {

    var id = req.params.id;
	var itemJSON = {
		reference: req.body.data["reference"],
		name: req.body.data["name"],
		points: req.body.data["points"],
		grammaticalGender: req.body.data["grammaticalGender"],
		grammaticalNumber: req.body.data["grammaticalNumber"]
	};

	if (req.body.data["phrasePrereqs"]) itemJSON.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) itemJSON.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) itemJSON.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) itemJSON.npcPrereqs = req.body.data["npcPrereqs"].split(",");
	
	var conditions = {_id: id};
	var options = {safe: true, multi: false}; 

	Item.update(conditions, itemJSON, options, function(err, numAffected) {
	
		if (numAffected > 0) {
			
			Item.findOne({_id: id}, function(err, doc) {
				res.statusCode = 202;
				res.send(doc);
			});
			
		} else {
		
			res.statusCode = 404;
            res.send({
                status : 404, 
                title: "NOT_FOUND", 
                message : "Unable to update. No item found for ID " + id
            });
		
		}
	
	});

};

/** Remove um item a partir de seu identificador. */
var removeByID = function(req, res) {

    var id = req.params.id;
    Item.findOne({_id : id}, function(err, doc) {

        if (doc) {
            doc.remove(function (err, deletedDoc) {
                res.statusCode = 202;
                res.send(deletedDoc);
            });
        } else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "Unable to delete. No item found for ID " + id
            });
        }
    
    });	

};

exports.Item = Item;
exports.findAll = findAll;
exports.findByID = findByID;
exports.create = create;
exports.update = update;
exports.removeByID = removeByID;