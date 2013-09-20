var Substitution = require("../domain/substitution").Substitution;
exports.loadSubstitutions = function() {

	//----[ Limpeza e inicialização das Substituições ]----------------------------------
	  
	Substitution.find(function (err, docs) {

		if (docs && docs.length > 0) {
		
			console.log("Cleaning existing substitutions");
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}
						
		} 

		var s1 = new Substitution()
		  , s2 = new Substitution()
		  , s3 = new Substitution()
		  , s4 = new Substitution()
		  , s5 = new Substitution();

		s1.name = "O";
		s1.maleSingularForm = "o";
		s1.femaleSingularForm = "a";
		s1.malePluralForm = "os";
		s1.femalePluralForm = "as";
		s1.save(function (err, createdDoc) {
			if (err) console.log("Error creating substitution: O");
			else console.log("Substitution created: O");
		});

		s2.name = "AO";
		s2.maleSingularForm = "ao";
		s2.femaleSingularForm = "à";
		s2.malePluralForm = "aos";
		s2.femalePluralForm = "às";
		s2.save(function (err, createdDoc) {
			if (err) console.log("Error creating substitution: AO");
			else console.log("Substitution created: AO");
		});

		s3.name = "UM";
		s3.maleSingularForm = "um";
		s3.femaleSingularForm = "uma";
		s3.malePluralForm = "uns";
		s3.femalePluralForm = "umas";
		s3.save(function (err, createdDoc) {
			if (err) console.log("Error creating substitution: UM");
			else console.log("Substitution created: UM");
		});

		s4.name = "ELE";
		s4.maleSingularForm = "ele";
		s4.femaleSingularForm = "ela";
		s4.malePluralForm = "eles";
		s4.femalePluralForm = "elas";
		s4.save(function (err, createdDoc) {
			if (err) console.log("Error creating substitution: ELE");
			else console.log("Substitution created: ELE");
		});		
		
		s5.name = "SEU";
		s5.maleSingularForm = "seu";
		s5.femaleSingularForm = "sua";
		s5.malePluralForm = "seus";
		s5.femalePluralForm = "suas";
		s5.save(function (err, createdDoc) {
			if (err) console.log("Error creating substitution: SEU");
			else console.log("Substitution created: SEU");
		});		
		
	});

}
