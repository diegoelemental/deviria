var Adventure = require("../domain/adventure");
exports.loadAdventures = function() {

	//----[ Limpeza e inicialização das Substituições ]----------------------------------
		var s1 = new Adventure.Adventure()
		  , s2 = new Adventure.Adventure()
		  , s3 = new Adventure.Adventure()
		  , s4 = new Adventure.Adventure()
		  , s5 = new Adventure.Adventure();

		s1.authorFacebookID = "Teste 1";
		s1.points = 10;
		s1.size = 'M';
		s1.save(function (err, createdDoc) {
			if (err) console.log("Error creating adventure: Teste 5");
			else console.log("Adventure created: Teste 5");
		});

		s2.authorFacebookID = "Teste 2";
		s2.points = 20;
		s2.size = 'M'
		s2.save(function (err, createdDoc) {
			if (err) console.log("Error creating adventure: Teste 5");
			else console.log("Adventure created: Teste 5");
		});

		s3.authorFacebookID = "Teste 3";
		s3.points = 30;
		s3.size = 'M';
		s3.save(function (err, createdDoc) {
			if (err) console.log("Error creating adventure: Teste 5");
			else console.log("Adventure created: Teste 5");
		});

		s4.authorFacebookID = "Teste 4";
		s4.points = 40;
		s4.size = 'M';
		s4.save(function (err, createdDoc) {
			if (err) console.log("Error creating adventure: Teste 5");
			else console.log("Adventure created: Teste 5");
		});		
		
		s5.authorFacebookID = "Teste 5";
		s5.points = 50;
		s5.size = 'M';
		s5.save(function (err, createdDoc) {
			if (err) console.log("Error creating adventure: Teste 5");
			else console.log("Adventure created: Teste 5");
		});		
		
	};
	
exports.deleteAdventures = function(){
	Adventure.Adventure.find(function (err, docs) {
		if (docs && docs.length > 0) {
			console.log("Cleaning existing adventures");
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}			
		}
	});		
}
