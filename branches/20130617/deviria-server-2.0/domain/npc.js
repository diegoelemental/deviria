/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: npc.js
 * vers�o ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Defini��o do objeto de dom�nio NPC. Um npc ou non-playable-character representa
 * um personagem que n�o pertence a um jogador, mas faz parte da hist�ria.
 */

var database = require("./database");
var mongoose = database.mongoose;

/**
 * Defini��o do Schema para a entidade de dom�nio Npc.
 *
 * Para fins de tabela de registros, considerar os campos, na seguinte ordem:
 * "reference", "name", "points", "grammaticalGender", "grammaticalNumber".
 * 
 * reference            C�digo de refer�ncia para o NPC, utilizado em relacionamentos.
 * name                 Nome do NPC exibido pelo jogo.
 * points               Quantidade de pontos adicionados mediante uso do NPC.
 * phrasePrereqs    	Refer�ncia para frases consideradas como pr�-requisitos.
 * placePrereqs			Refer�ncia para locais considerados como pr�-requisitos.
 * itemPrereqs      	Refer�ncia para itens considerados como pr�-requisitos.
 * npcPrereqs			Refer�ncia para NPCs considerados como pr�-requisitoss.
 * grammaticalGender    G�nero do NPC, permitindo "M" ou "F".
 * grammaticalNumber    Grau do NPC, permitindo "S" ou "P".
 */
var NPCSchema = new mongoose.Schema({
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
var NPC = mongoose.model("NPCs", NPCSchema);

/** Lista todas os itens cadastrados no servidor. */
var findAllNPCs = function(req, res) {

    NPC.find().sort({reference: 1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No NPCs found"
            });
        }
    });

};

/** Busca um NPC espec�fico a partir de seu c�digo de identifica��o. */
var findNPCByID = function(req, res) {

    var id = req.params.id;
    NPC.findOne({_id: id}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No NPC found for ID " + id
            });
        }
    });

};

/** Busca um NPC espec�fico a partir de seu c�digo de refer�ncia. */
var findNPCsByReference = function(req, res) {

    var reference = req.params.reference;
    NPC.findOne({reference: reference}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No NPC found for reference " + reference
            });
        }
    });

};

/** Busca frases que possuam o pr�-requisito informado. */
var findNPCsByPrereqs = function(req, res) {

    var prereq = req.params.prereq;
    NPC.find({prereqs: prereq}).sort({reference: 1}).execFind(function (err, docs) {
        if (docs) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No NPCs found for prereq " + prereq
            });
        }
    });

};

/** Adiciona um novo NPC � camada de persist�ncia. */
var createNPC = function(req, res) {
    
    var npc = new NPC();
	npc.reference = req.body.data["reference"];
    npc.name = req.body.data["name"];
    npc.points = req.body.data["points"];
	if (req.body.data["phrasePrereqs"]) npc.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) npc.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) npc.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) npc.npcPrereqs = req.body.data["npcPrereqs"].split(",");
	npc.grammaticalGender = req.body.data["grammaticalGender"];
    npc.grammaticalNumber = req.body.data["grammaticalNumber"];
    npc.save(function (err, createdDoc) {
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

/** Atualiza um NPC existente na camada de persist�ncia. */
var updateNPC = function(req, res) {

    var id = req.params.id;
	var npcJSON = {
		reference: req.body.data["reference"],
		name: req.body.data["name"],
		points: req.body.data["points"],
		grammaticalGender: req.body.data["grammaticalGender"],
		grammaticalNumber: req.body.data["grammaticalNumber"]
	};

	if (req.body.data["phrasePrereqs"]) npcJSON.phrasePrereqs = req.body.data["phrasePrereqs"].split(",");
	if (req.body.data["placePrereqs"]) npcJSON.placePrereqs = req.body.data["placePrereqs"].split(",");
	if (req.body.data["itemPrereqs"]) npcJSON.itemPrereqs = req.body.data["itemPrereqs"].split(",");
	if (req.body.data["npcPrereqs"]) npcJSON.npcPrereqs = req.body.data["npcPrereqs"].split(",");
	
	var conditions = {_id: id};
	var options = {safe: true, multi: false}; 

	NPC.update(conditions, npcJSON, options, function(err, numAffected) {
	
		if (numAffected > 0) {
			
			NPC.findOne({_id: id}, function(err, doc) {
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

/** Remove um NPC a partir de seu identificador. */
var removeNPCByID = function(req, res) {

    var id = req.params.id;
    NPC.findOne({_id: id}, function(err, doc) {

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
                message: "Unable to delete. No NPC found for ID " + id
            });
        }
    
    });	

};

exports.NPC = NPC;
exports.findAllNPCs = findAllNPCs;
exports.findNPCByID = findNPCByID;
exports.createNPC = createNPC;
exports.updateNPC = updateNPC;
exports.removeNPCByID = removeNPCByID;