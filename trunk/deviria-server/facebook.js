/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: facebook.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Encapsula as funcionalidades do Facebook.
 */

var url = require('url');
 
exports.parseSignedRequest = function(req) {

	var signedRequest = req.body.signed_request
      , requestData = signedRequest.split('.')
      , payload = new Buffer(requestData[1], 'base64').toString()
	  , urlParts = url.parse(req.url, true)
	  , query = urlParts.query;
	
	console.log("TOKEN: %s", JSON.stringify(payload));
	console.log("QUERY: %s", JSON.stringify(query));
	
}