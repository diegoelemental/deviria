/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: database.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Classe base para configuração do banco de dados, capaz de realizar
 * o chaveamento de conexão entre AppFog e banco local.
 */

var mongoose = require("mongoose");
//var databaseURL = (process.env.MONGOLAB_URI || "mongodb://localhost/deviria");
var databaseURL = (process.env.MONGOLAB_URI || "mongodb://deviria:1234elementos@ds031968.mongolab.com:31968/deviria");
mongoose.connect(databaseURL);
exports.mongoose = mongoose;