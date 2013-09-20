var NPC = require("../domain/npc").NPC;
exports.loadNPCs = function() {

	//----[ Limpeza e inicialização dos NPCS ]-----------------------------------------
	  
	NPC.find(function (err, docs) {

		if (docs && docs.length > 0) {
		
			console.log("Cleaning existing NPCs");
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}
						
		} 

		var comissionerGordon = new NPC()
		  , joker = new NPC()
		  , loisLane = new NPC()
		  , generalZod = new NPC()
		  , guardians = new NPC()
		  , sinestro = new NPC()
		  , irisAllen = new NPC()
		  , mirrorMaster = new NPC()
		  , mera = new NPC()
		  , blackManta = new NPC()
		  , cheetah = new NPC()

		comissionerGordon.reference = "N1";
		comissionerGordon.name = "Comissioner Gordon";
		comissionerGordon.points = 10;
		comissionerGordon.grammaticalGender = "M";
		comissionerGordon.grammaticalNumber = "S";
		comissionerGordon.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Comissioner Gordon");
			else console.log("NPC created: Comissioner Gordon");
		});

		joker.reference = "N2";
		joker.name = "Joker";
		joker.points = 30;
		joker.itemPrereqs = ["I2"];
		joker.npcPrereqs = ["N1"];
		joker.grammaticalGender = "M";
		joker.grammaticalNumber = "S";
		joker.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Joker");
			else console.log("NPC created: Joker");
		});

		loisLane.reference = "N3";
		loisLane.name = "Lois Lane";
		loisLane.points = 10;
		loisLane.grammaticalGender = "F";
		loisLane.grammaticalNumber = "S";
		loisLane.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Lois Lane");
			else console.log("NPC created: Lois Lane");
		});

		generalZod.reference = "N4";
		generalZod.name = "General Zod";
		generalZod.points = 20;
		generalZod.npcPrereqs = ["N3"];
		generalZod.grammaticalGender = "M";
		generalZod.grammaticalNumber = "S";
		generalZod.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: General Zod");
			else console.log("NPC created: General Zod");
		});

		guardians.reference = "N5";
		guardians.name = "Guardians";
		guardians.points = 10;
		guardians.grammaticalGender = "M";
		guardians.grammaticalNumber = "P";
		guardians.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Guardians");
			else console.log("NPC created: Guardians");
		});

		sinestro.reference = "N6";
		sinestro.name = "Sinestro";
		sinestro.points = 20;
		sinestro.npcPrereqs = ["N5"];
		sinestro.grammaticalGender = "M";
		sinestro.grammaticalNumber = "S";
		sinestro.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Sinestro");
			else console.log("NPC created: Sinestro");
		});

		irisAllen.reference = "N7";
		irisAllen.name = "Iris Allen";
		irisAllen.points = 10;
		irisAllen.grammaticalGender = "F";
		irisAllen.grammaticalNumber = "S";
		irisAllen.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Iris Allen");
			else console.log("NPC created: Iris Allen");
		});

		mirrorMaster.reference = "N8";
		mirrorMaster.name = "Mirror Master";
		mirrorMaster.points = 20;
		mirrorMaster.npcPrereqs = ["N7"];
		mirrorMaster.grammaticalGender = "M";
		mirrorMaster.grammaticalNumber = "S";
		mirrorMaster.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Mirror Master");
			else console.log("NPC created: Mirror Master");
		});

		mera.reference = "N9";
		mera.name = "Mera";
		mera.points = 10;
		mera.grammaticalGender = "F";
		mera.grammaticalNumber = "S";
		mera.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Mera");
			else console.log("NPC created: Mera");
		});
		
		blackManta.reference = "N10";
		blackManta.name = "Black Manta";
		blackManta.points = 20;
		blackManta.npcPrereqs = ["N9"];
		blackManta.grammaticalGender = "M";
		blackManta.grammaticalNumber = "S";
		blackManta.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Black Manta");
			else console.log("NPC created: Black Manta");
		});		
		
		cheetah.reference = "N11";
		cheetah.name = "Cheetah";
		cheetah.points = 10;
		cheetah.grammaticalGender = "F";
		cheetah.grammaticalNumber = "S";
		cheetah.save(function (err, createdDoc) {
			if (err) console.log("Error creating NPC: Cheetah");
			else console.log("NPC created: Cheetah");
		});		
		
	});
	
}