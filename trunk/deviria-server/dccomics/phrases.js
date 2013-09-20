var Phrase = require("../domain/phrase").Phrase;
exports.loadPhrases = function() {

	//----[ Limpeza e inicialização das Frases ]----------------------------------
	  
	Phrase.find(function (err, docs) {

		if (docs && docs.length > 0) {
		
			console.log("Cleaning existing phrases");
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}
						
		} 

		var f1 = new Phrase()
          , f2 = new Phrase()
          , f3 = new Phrase();

		f1.reference = "F1";
		f1.contents= "[O] <P> entrou [NO] <C>.";
		f1.points = 100;
		f1.removesPlayer = false;
		f1.phrasePrereqs = [];
		f1.save(function (err, createdDoc) {
			if (err) console.log("Error creating phrase: F1");
			else console.log("Phrase created: F1");
		});
		
		f2.reference = "F2";
		f2.contents= "[O] <P1> usou [O] [SEU] <O> para forçar <P2> a entrar [NO] <C>.";
		f2.points = 100;
		f2.removesPlayer = false;
		f2.phrasePrereqs = ["F1"];
		f2.save(function (err, createdDoc) {
			if (err) console.log("Error creating phrase: F2");
			else console.log("Phrase created: F2");
		});
		
		f3.reference = "F3";
		f3.contents= "[O] <P1> matou <P2> usando [O] <O1> e [O] <O2>.";
		f3.points = 100;
		f3.removesPlayer = true;
		f3.phrasePrereqs = ["F2"];
		f3.save(function (err, createdDoc) {
			if (err) console.log("Error creating phrase: F3");
			else console.log("Phrase created: F3");
		});
		
	});

}
