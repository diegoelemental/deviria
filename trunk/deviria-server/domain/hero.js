/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: hero.js
 * vers�o ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Defini��o do objeto de dom�nio Hero. Um her�i � uma classe atribu�da
 * a um jogador, que ser� utilizada ao longo da aventura.
 */

var database     = require("./database"); 
var mongoose = database.mongoose;

/**
 * Defini��o do Schema para a entidade de dom�nio Hero.
 *
 * name                 Nome do her�i, utilizado ao longo da hist�ria.
 * description          Descri��o do her�i, apresentada em sua sele��o.
 * grammaticalGender    Sexo do her�i ("M" ou "F").
 * imageURL             URL contendo  imagem de representa��o do her�i.
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

/** Lista todos os her�is cadastrados no servidor. */
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

/** Busca um her�i espec�fico a partir de seu c�digo de identifica��o. */
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

/** Adiciona um novo her�i � camada de persist�ncia. */
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

/** Atualiza um her�i existente na camada de persist�ncia. */
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

/** Remove um her�i a partir de seu identificador. */
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

/** Redireciona a aplica��o para a sele��o dos usu�rios do facebook. */
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
