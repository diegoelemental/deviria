/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: facebook.js
 * versão ....: 2.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Objeto central de integração com o Facebook.
 */

var mod_url = require('url')
  , mod_querystring = require('querystring')
  , mod_request = require('request')
  , mod_crypto = require('crypto');

/**
 * Configuração das variáveis de conexão com o Facebook.
 *
 * Podem ser informadas diretamente, mas se isso for um risco de segurança (pessoas não 
 * autorizadas com acesso ao repositório de código-fonte, podem ser fornecidas como vars
 * de ambiente configuradas no SO ou no AppFog, com o formato:
 *
 * - process.env.FACEBOOK_APP_ID ........: App ID obtido no Facebook.
 * - process.env.FACEBOOK_SECRET ........: App Secret obtido no Facebook.
 * - process.env.REDIRECT_URI ...........: URL para acesso ao aplicativo.
 * - process.env.FACEBOOK_NAMESPACE .....: App Namespace obtido no Facebook.
 * - process.env.FACEBOOK_SCOPE .........: Permissões adicionais separadas por vírgulas(*).
 *
 * (*) Para referência, consulte as seguintes URLs:
 *    https://developers.facebook.com/docs/facebook-login/login-flow-for-web/
 *    https://developers.facebook.com/docs/facebook-login/permissions/
 */
var mFacebookApp = {
	//id: '189906287839728',
	id: '474577919303884',
	//secret: '780d4a3466386f04b0e04d9d53e0e79c',
	secret: 'b7f1c62a5f0323f50412661b3e78b052',
	//url: 'https://apps.facebook.com/deviria-test/',
	url: 'http://apps.facebook.com/devirialocal/',
	ns: 'deviria',
	scope: 'email,publish_stream'
};

/**
 * Cria a URL para login no sistema, utilizando informações estabelecidas neste módulo 
 *(membro "mFacebookApp"). A URL aberta irá solicitar ao usuário que permita o acesso no 
 * aplicativo e forneça as permissões necessárias.
 */
var createAuthURL = function() {
	var url = mod_url.format({
		protocol: 'https',
		host: 'www.facebook.com',
		pathname: 'dialog/oauth',
		query: {
			client_id: mFacebookApp.id,
			redirect_uri: mFacebookApp.url,
			scope: mFacebookApp.scope
		}
	});
	console.log("Creating auth URL: %s", url);
	return url;
}

/**
 * Tenta obter as credenciais do usuário. Caso não existam, irá direcioná-lo para a 
 * tela de login do Facebook, conforme configurações obtidas neste objeto.
 *
 * Primeiro tentará obter na sessão. Caso não encontre, tentará obter uma propriedade
 * signed_request na requisição e processá-la.
 */
var verifyAndInitializeUserIfNeeded = function(req, res, next) {
	if (!req.session.facebookAccessToken) {
		if  (!req.param('signed_request')) {
			res.send("<script>window.top.location='" + createAuthURL() + "'</script>");
		} else {
			var signed_request = req.param('signed_request'); 
			var parts = signed_request.split('.');
			var sig = base64UrlToBase64(parts[0]);
			var payload = parts[1];
			var data = JSON.parse(base64UrlToString(payload));	
			if (!data.user_id) {
				res.send("<script>window.top.location='" + createAuthURL() + "'</script>");
			} else {
				var hmac = mod_crypto.createHmac('sha256', mFacebookApp.secret);
				hmac.update(payload);
				var expected_sig = hmac.digest('base64');
				if (sig != expected_sig){
					console.log('expected [' + expected_sig + '] got [' + sig + ']');
					res.send(401, 'Session hijack!');
				}
				else {
					req.session.facebookAccessToken = data.oauth_token;
					req.session.facebookUserID = data.user_id;
					mod_request.get(
						{
							url: 'https://graph.facebook.com/me?fields=name,email,friends',
							qs: { access_token: req.session.facebookAccessToken },
							json: true
						},
						function graphMeRequestCb(er, res, body) {
							if (er) return cb(er);
							req.session.facebookUserInfo = body;
							return next();
						}
					)
				}
			}
		}
	} else {
		return next();
	}
}

/**
 * Obtém um token de acesso e pesquisa no grafo o perfil do usuário.
 *
 * No callback será retornado o nome do usuário, seu ID de Facebook e uma
 * lista de amigos, contendo nome e respectivos IDs de Facebook.
 *
 * @param sr	Requisição assinada recebida pelo Facebook.
 * @param cb	Callback invocado ao término da requsição.
 */
var graphMe = function(accessToken, sr, cb) {
	request.get(
		{
			url: 'https://graph.facebook.com/me?fields=name,email,friends',
			qs: { access_token: accessToken },
			json: true
		},
		function graphMeRequestCb(er, res, body) {
			if (er) return cb(er);
			cb(null, body)
		}
	)
}

/**
 * Busca na lista de amigos um registro que possua o termo de nome fornecido.
 * 
 * @param req   Requisição HTTP recebida pelo Express.
 * @param res   Requisição HTTP enviada pelo Express.
 * @param next  Próximo elemento na fila de processamento.
 */
var findFriendsByName = function(req, res, next) {
    var namePart = mod_url.parse(req.url, true).query.term;
	console.log('buscando amigo: %s', namePart);
	if (req.session.facebookAccessToken) {
		console.log('Iniciando busca');
		var friendsFound = [];
		for (i=0; i<req.session.facebookUserInfo.friends.data.length; i++) {
			var friend = req.session.facebookUserInfo.friends.data[i];
			if (friend.name.indexOf(namePart) !== -1) {
				console.log('amigo encontrado: %s', friend.name);
				friendsFound.push(friend);
			}
		}
		res.send(200, JSON.stringify(friendsFound));
	} else res.send(403, "Not connected to Facebook");
}

var base64ToString = function(str) {
	return (new Buffer(str || "", "base64")).toString("ascii");
};
 
var base64UrlToString = function(str) {
	return base64ToString( base64UrlToBase64(str) );
};
 
var base64UrlToBase64 = function(str) {
	var paddingNeeded = (4- (str.length%4));
	for (var i = 0; i < paddingNeeded; i++) {
		str = str + '=';
	}
	return str.replace(/\-/g, '+').replace(/_/g, '/')
};

exports.verifyAndInitializeUserIfNeeded = verifyAndInitializeUserIfNeeded;
exports.findFriendsByName = findFriendsByName;
