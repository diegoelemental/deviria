var Item = require("../domain/item").Item;
exports.loadItems = function() {

	//----[ Limpeza e inicialização dos ITENS ]-----------------------------------------
	  
	Item.find(function (err, docs) {

		if (docs && docs.length > 0) {
		
			console.log("Cleaning existing Items");
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}
						
		} 

		var trident = new Item()
		  , batsignal = new Item()
		  , batmobile = new Item()
		  , kryptonite = new Item()
		  , greenPowerRing = new Item()
		  , yellowPowerRing = new Item()
		  , lassoOfTruth = new Item()
		  , bracers = new Item()
		  , jokerToxin = new Item();

		trident.reference = "I1";
		trident.name = "Trident";
		trident.points = 10;
		trident.grammaticalGender = "M";
		trident.grammaticalNumber = "S";
		trident.placePrereqs = ["P1"];
		trident.npcPrereqs = ["N9"];
		trident.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Trident");
			else console.log("Item created: Trident");
		});

		batsignal.reference = "I2";
		batsignal.name = "Batsignal";
		batsignal.points = 30;
		batsignal.grammaticalGender = "M";
		batsignal.grammaticalNumber = "S";
		batsignal.placePrereqs = ["P2"];
		batsignal.npcPrereqs = ["N1"];
		batsignal.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Batsignal");
			else console.log("Item created: Batsignal");
		});
		
		batmobile.reference = "I3";
		batmobile.name = "Batmobile";
		batmobile.points = 20;
		batmobile.grammaticalGender = "M";
		batmobile.grammaticalNumber = "S";
		batmobile.itemPrereqs = ["I2"];
		batmobile.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Batmobile");
			else console.log("Item created: Batmobile");
		});

		kryptonite.reference = "I4";
		kryptonite.name = "Kryptonite";
		kryptonite.points = 10;
		kryptonite.grammaticalGender = "M";
		kryptonite.grammaticalNumber = "S";
		kryptonite.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Kryptonite");
			else console.log("Item created: Kryptonite");
		});

		greenPowerRing.reference = "I5";
		greenPowerRing.name = "Green Power Ring";
		greenPowerRing.points = 10;
		greenPowerRing.grammaticalGender = "M";
		greenPowerRing.grammaticalNumber = "S";
		greenPowerRing.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Green Power Ring");
			else console.log("Item created: Green Power Ring");
		});

		yellowPowerRing.reference = "I6";
		yellowPowerRing.name = "Yellow Power Ring";
		yellowPowerRing.points = 20;
		yellowPowerRing.grammaticalGender = "M";
		yellowPowerRing.grammaticalNumber = "S";
		yellowPowerRing.npcPrereqs = ["N6"];
		yellowPowerRing.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Yellow Power Ring");
			else console.log("Item created: Yellow Power Ring");
		});

		lassoOfTruth.reference = "I7";
		lassoOfTruth.name = "Lasso of Truth";
		lassoOfTruth.points = 10;
		lassoOfTruth.grammaticalGender = "M";
		lassoOfTruth.grammaticalNumber = "S";
		lassoOfTruth.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Lasso of Truth");
			else console.log("Item created: Lasso of Truth");
		});

		bracers.reference = "I8";
		bracers.name = "Bracers";
		bracers.points = 10;
		bracers.grammaticalGender = "M";
		bracers.grammaticalNumber = "P";
		bracers.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Bracers");
			else console.log("Item created: Bracers");
		});

		jokerToxin.reference = "I9";
		jokerToxin.name = "Joker Toxin";
		jokerToxin.points = 50;
		jokerToxin.grammaticalGender = "M";
		jokerToxin.grammaticalNumber = "S";
		jokerToxin.npcPrereqs = ["N2"];
		jokerToxin.save(function (err, createdDoc) {
			if (err) console.log("Error creating Item: Joker Toxin");
			else console.log("Item created: Joker Toxin");
		});
				
	});
	
}