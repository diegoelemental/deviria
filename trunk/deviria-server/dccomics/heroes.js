var Hero = require("../domain/hero").Hero;
exports.loadHeroes = function() {

	//----[ Limpeza e inicialização dos HERÓIS ]-----------------------------------------
	  
	Hero.find(function (err, docs) {

		if (docs && docs.length > 0) {
		
			console.log("Cleaning existing heroes");
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}
						
		} 

		var glee = new Hero()
		  , gandolfo = new Hero()
		  , jade = new Hero()
		  , duffy = new Hero();

		glee.name = "Glee";
		glee.description = "Um b&aacute;rbaro vindo das quentes plan&iacute;cies do oeste, forte e muito &aacute;gil, mas pouco inteligente";
		glee.imageURL = "images/heroes/glee.PNG";
		glee.grammaticalGender = "M";
		glee.save(function (err, createdDoc) {
			if (err) console.log("Error creating hero: Glee");
			else console.log("Hero created: Glee");
		});

		gandolfo.name = "Gandolfo";
		gandolfo.description = "Um mago treinado na universidade invisivel, pode invocar encatamentos e &eacute; muito inteligente, embora seja fisicamente fraco";
		gandolfo.imageURL = "images/heroes/gandolfo.PNG";
		gandolfo.grammaticalGender = "M";
		gandolfo.save(function (err, createdDoc) {
			if (err) console.log("Error creating hero: Gandolfo");
			else console.log("Hero created: Gandolfo");
		});

		jade.name = "Jade";
		jade.description = "Uma dru&iacute;da nascida nas florestas de Ninwood, controla as for&ccedil;as da natureza, possui uma agilidade acima da m&eacute;dia, por&eacute;m n&atilde;o &eacute; resistente";
		jade.imageURL = "images/heroes/jade.PNG";
		jade.grammaticalGender = "F";
		jade.save(function (err, createdDoc) {
			if (err) console.log("Error creating hero: Jade");
			else console.log("Hero created: Jade");
		});

		duffy.name = "Duffy";
		duffy.description = "Uma lenhadora pertencente &aacute;s Highlands, &eacute; incrivelmente resistente e forte, chegando a superar os mais fortes b&aacute;rbaros, em compensa&ccedil&atilde;o possui pouqu&iacute;ssima intelig&ecirc;ncia e agilidade al&eacute;m de perder completamente o controle quando o assunto &eacute; comida";
		duffy.imageURL = "images/heroes/duffy.PNG";
		duffy.grammaticalGender = "F";
		duffy.save(function (err, createdDoc) {
			if (err) console.log("Error creating hero: Duffy");
			else console.log("Hero created: Duffy");
		});

	});

}
