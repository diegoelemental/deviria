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

var database = require("./database.js")
  , mongoose = database.mongoose;
  
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

/** 
 * Lista todos os heróis cadastrados no servidor, ordenados pelo nome.
 *
 * @param req   Requisição HTTP recebida pelo Express.
 * @param res   Resposta HTTP que será enviada pelo Express.
 */
var findAllHeroes = function(req, res) {
    Hero.find().sort({_id: 1}).execFind(function (err, docs) {
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

exports.Hero = Hero;
exports.findAllHeroes = findAllHeroes;