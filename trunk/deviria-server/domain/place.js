/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: place.js
 * vers�o ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Defini��o do objeto de dom�nio Place. Um local representa um cen�rio contido
 * em uma frase da aventura, tamb�m somando pontos � hist�ria.
 */

var database = require("./database");
var mongoose = database.mongoose;

/**
 * Defini��o do Schema para a entidade de dom�nio Place.
 *
 * Para fins de tabela de registros, considerar os campos, na seguinte ordem:
 * "reference", "name", "points".
 *
 * reference            C�digo de refer�ncia para o local, utilizado em relacionamentos.
 * name                 Nome do local exibido pelo jogo.
 * points               Quantidade de pontos adicionados mediante uso do local.
 * phrasePrereqs    	Refer�ncia para frases consideradas como pr�-requisitos.
 * placePrereqs			Refer�ncia para locais considerados como pr�-requisitos.
 * itemPrereqs      	Refer�ncia para itens considerados como pr�-requisitos.
 * npcPrereqs			Refer�ncia para NPCs considerados como pr�-requisitoss.
 * grammaticalGender    G�nero do local, permitindo "M" ou "F".
 * grammaticalNumber    Grau do local, permitindo "S" ou "P".
 */
var PlaceSchema = new mongoose.Schema({
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
var Place = mongoose.model("Places", PlaceSchema);

/** Lista todas os locais cadastrados no servidor. */
var findAll = function(req, res) {

    Place.find().sort({reference : 1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No places found"
            });
        }
    });

};

/** Busca um local espec�fico a partir de seu c�digo de identifica��o. */
var findByID = function(req, res) {

    var id = req.params.id;
    Place.findOne({_id : id}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No place found for ID " + id
            });
        }
    });

};

/** Busca um local espec�fico a partir de seu c�digo de refer�ncia. */
var findByReference = function(req, res) {

    var reference = req.params.reference;
    Place.findOne({reference: reference}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No place found for reference " + reference
            });
        }
    });

};

/** Busca locais que possuam o pr�-requisito informado. */
var findByPrereqs = function(req, res) {

    var prereq = req.params.prereq;
    Place.find({prereqs: prereq}).sort({reference: 1}).execFind(function (err, docs) {
        if (docs) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No places found for prereq " + prereq
            });
        }
    });

};

/** Adiciona um novo local � camada de persist�ncia. */
var create = function(req, res) {
    
    var place = new Place();
	place.reference = req.body.data["reference"];
    place.name = req.body.data["name"];
    place.points = req.body.data["points"];
	if (req.body.data["phrasePrereqs"]) place.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) place.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) place.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) place.npcPrereqs = req.body.data["npcPrereqs"].split(",");
	place.grammaticalGender = req.body.data["grammaticalGender"];
    place.grammaticalNumber = req.body.data["grammaticalNumber"];
	
    place.save(function (err, createdDoc) {
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

/** Atualiza um local existente na camada de persist�ncia. */
var update = function(req, res) {

    var id = req.params.id;
	var placeJSON = {
		reference: req.body.data["reference"],
		name: req.body.data["name"],
		points: req.body.data["points"],
		grammaticalGender: req.body.data["grammaticalGender"],
		grammaticalNumber: req.body.data["grammaticalNumber"]
	};

	if (req.body.data["phrasePrereqs"]) placeJSON.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) placeJSON.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) placeJSON.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) placeJSON.npcPrereqs = req.body.data["npcPrereqs"].split(",");
	
	var conditions = {_id: id};
	var options = {safe: true, multi: false}; 

	Place.update(conditions, placeJSON, options, function(err, numAffected) {
	
		if (numAffected > 0) {
			
			Place.findOne({_id: id}, function(err, doc) {
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

/** Remove um local a partir de seu identificador. */
var removeByID = function(req, res) {

    var id = req.params.id;
    Place.findOne({_id : id}, function(err, doc) {

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
                message: "Unable to delete. No place found for ID " + id
            });
        }
    
    });	

};

exports.Place = Place;
exports.findAll = findAll;
exports.findByID = findByID;
exports.create = create;
exports.update = update;
exports.removeByID = removeByID;