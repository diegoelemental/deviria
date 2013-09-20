/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: item.js
 * vers�o ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Defini��o do objeto de dom�nio Item. Um item � um objeto qualquer inserido
 * em uma frase, que adiciona pontos � hist�ria.
 */

var database = require("./database");
var mongoose = database.mongoose;

/**
 * Defini��o do Schema para a entidade de dom�nio Item.
 *
 * Para fins de tabela de registros, considerar os campos, na seguinte ordem:
 * "reference", "name", "points", "grammaticalGender", "grammaticalNumber".
 * 
 * reference            C�digo de refer�ncia para o item, utilizado em relacionamentos.
 * name                 Nome do item exibido pelo jogo.
 * points               Quantidade de pontos adicionados mediante uso do item.
 * phrasePrereqs    	Refer�ncia para frases consideradas como pr�-requisitos.
 * placePrereqs			Refer�ncia para locais considerados como pr�-requisitos.
 * itemPrereqs      	Refer�ncia para itens considerados como pr�-requisitos.
 * npcPrereqs			Refer�ncia para NPCs considerados como pr�-requisitoss.
 * grammaticalGender    G�nero do item, permitindo "M" ou "F".
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

/** Busca um item espec�fico a partir de seu c�digo de identifica��o. */
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

/** Busca uma frase espec�fica a partir de seu c�digo de refer�ncia. */
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

/** Busca itens que possuam o pr�-requisito informado. */
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

/** Adiciona um novo local � camada de persist�ncia. */
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

/** Atualiza um item existente na camada de persist�ncia. */
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