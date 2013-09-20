/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: substitution.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Definição do objeto de domínio Substitution. Substituições permitem que os
 * personagens, itens, locais e NPCs sejam corretamente inseridos em frases.
 */

var database = require("./database");
var mongoose = database.mongoose;

/**
 * Definição do Schema para a entidade de domínio Substitution.
 *
 * name                 Nome da substituição
 * maleSingularForm     Forma singular masculina da substituição.
 * femaleSingularForm   Forma singular feminina da substituição.
 * malePluralForm       Forma plural masculina da substituição.
 * femalePluralForm     Forma plural feminina da substituição.
 */
var SubstitutionSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    maleSingularForm: {type: String, required: true},
    femaleSingularForm: {type: String, required: true},
    malePluralForm: {type: String, required: true},
    femalePluralForm: {type: String, required: true},
});

/** Obtendo objeto encapsulado pelo Mongoose. */
var Substitution = mongoose.model("Substitutions", SubstitutionSchema);

/** Lista todas as substituições cadastradas no servidor. */
var findAll = function(req, res) {

    Substitution.find().sort({name: 1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No substitutions found"
            });
        }
    });

};

/** Busca uma substituição específica a partir de seu código de identificação. */
var findByID = function(req, res) {

    var id = req.params.id;
    Substitution.findOne({_id: id}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No substitution found for ID " + id
            });
        }
    });

};

/** Busca uma substituição específica a partir de seu nome único. */
var findByName = function(req, res) {

    var name = req.params.name;
    Substitution.findOne({name: name}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No substitution found for name " + name
            });
        }
    });

};

/** Busca todas as substituições de uma frase */
var findAllInText = function(req, res) {

    var text = req.params.text;
    var names = text.match(/\[.+\]/g);
    var names_query = []
    for (var n in names) {
        var name = name[n];
        names_query.push({name: name});
    }

    Substitution.find().or(names_query).execFind(function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No substitution found for name " + name
            });
        }
    });
}


/** Adiciona uma nova substituição à camada de persistência. */
var create = function(req, res) {
    
    var substitution = new Substitution();
    substitution.name = req.body.data["name"];
    substitution.maleSingularForm = req.body.data["maleSingularForm"];
	substitution.femaleSingularForm = req.body.data["femaleSingularForm"];
    substitution.malePluralForm = req.body.data["malePluralForm"];
    substitution.femalePluralForm = req.body.data["femalePluralForm"];
    substitution.save(function (err, createdDoc) {
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

/** Atualiza uma substituição existente na camada de persistência. */
var update = function(req, res) {

    var id = req.params.id;
	var substitutionJSON = {
		name: req.body.data["name"],
		maleSingularForm: req.body.data["maleSingularForm"],
		femaleSingularForm: req.body.data["femaleSingularForm"],
		malePluralForm: req.body.data["malePluralForm"],
		femalePluralForm: req.body.data["femalePluralForm"]
	};
	
	var conditions = {_id: id};
	var options = {safe: true, multi: false}; 

	Substitution.update(conditions, substitutionJSON, options, function(err, numAffected) {
	
		if (numAffected > 0) {
			
			Substitution.findOne({_id: id}, function(err, doc) {
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
    Substitution.findOne({_id: id}, function(err, doc) {

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
                message: "Unable to delete. No substitution found for ID " + id
            });
        }
    
    });	

};

exports.Substitution = Substitution;
exports.findAll = findAll;
exports.findByID = findByID;
exports.findByName = findByName;
exports.create = create;
exports.update = update;
exports.removeByID = removeByID;
