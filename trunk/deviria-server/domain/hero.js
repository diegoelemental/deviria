/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: hero.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Definição do objeto de domínio Hero. Um herói é uma classe atribuída
 * a um jogador, que será utilizada ao longo da aventura.
 */

var database     = require("./database"); 
var mongoose = database.mongoose;

/**
 * Definição do Schema para a entidade de domínio Hero.
 *
 * name                 Nome do herói, utilizado ao longo da história.
 * description          Descrição do herói, apresentada em sua seleção.
 * grammaticalGender    Sexo do herói ("M" ou "F").
 * imageURL             URL contendo  imagem de representação do herói.
 */
var HeroSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    imageURL: {type: String, required: true},
    grammaticalGender: {
        type: String, 
        required: true,
        enum: ["M", "F"]
    }
});

/** Obtendo objeto encapsulado pelo Mongoose. */
var Hero = mongoose.model("Heroes", HeroSchema);

/** Lista todos os heróis cadastrados no servidor. */
var findAll = function(req, res) {

    Hero.find().sort({name: 1}).execFind(function (err, docs) {
        if (docs && docs.length > 0) res.send(docs);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No heroes found"
            });
        }
    });

};

/** Busca um herói específico a partir de seu código de identificação. */
var findByID = function(req, res) {

    var id = req.params.id;
    Hero.findOne({_id: id}, function(err, doc) {
        if (doc) res.send(doc);
        else {
            res.statusCode = 404;
            res.send({
                status: 404, 
                title: "NOT_FOUND", 
                message: "No hero found for ID " + id
            });
        }
    });

};

/** Adiciona um novo herói à camada de persistência. */
var create = function(req, res) {
    
    var hero = new Hero();
	hero.name = req.body.data["name"];
	hero.description = req.body.data["description"];
	hero.grammaticalGender = req.body.data["grammaticalGender"];
	hero.imageURL = req.body.data["imageURL"];
	
    hero.save(function (err, createdDoc) {
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

/** Atualiza um herói existente na camada de persistência. */
var update = function(req, res) {

	var id = req.params.id;
	var heroJSON = {
		name: req.body.data["name"],
		description: req.body.data["description"],
		grammaticalGender: req.body.data["grammaticalGender"]
	};
		
	var conditions = {_id: id};
	var options = {safe: true, multi: false}; 

	Hero.update(conditions, heroJSON, options, function(err, numAffected) {
	
		if (numAffected > 0) {
			
			Hero.findOne({_id : id}, function(err, doc) {
				res.statusCode = 202;
				res.send(doc);
			});
			
		} else {
		
			res.statusCode = 404;
            res.send({
                status : 404, 
                title: "NOT_FOUND", 
                message : "Unable to update. No hero found for ID " + id
            });
		
		}
	
	});

};

/** Remove um herói a partir de seu identificador. */
var removeByID = function(req, res) {

    var id = req.params.id;
    Hero.findOne({_id: id}, function(err, doc) {

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
                message: "Unable to delete. No hero found for ID " + id
            });
        }
    
    });	

};

/** Redireciona a aplicação para a seleção dos usuários do facebook. */
var findHeroesToFacebookChoose = function(req, res){

	Hero.find().sort({grammaticalGender: -1}).execFind(function (err, docs) {
		if (!docs || docs.length == 0){
			docs = undefined;
		}
		res.render("adventure", {
			title: "Deviria Adeventures",
			heroes: docs,
			host : req.host,
			port : req.port
		});

	});

};


exports.Hero = Hero;
exports.findAll = findAll;
exports.findByID = findByID;
exports.create = create;
exports.update = update;
exports.removeByID = removeByID;
exports.findHeroesToFacebookChoose = findHeroesToFacebookChoose;
