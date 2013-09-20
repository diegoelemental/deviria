var Place = require("../domain/place").Place;
exports.loadPlaces = function() {

	//----[ Limpeza e inicialização dos LOCAIS ]-----------------------------------------
	Place.find(function (err, docs) {
	
		if (docs && docs.length > 0) {
		
			console.log("Cleaning existing places");
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}

		}
		
		var atlantis = new Place()
		  , gothamCity = new Place()
		  , centralCity = new Place()
		  , coastCity = new Place()
		  , midwayCity = new Place()
		  , metropolis = new Place()
		  , themyscira = new Place()
		  , wayneManor = new Place()
		  , theBatcave = new Place()
		  , dailyPlanet = new Place()
		  , fortressOfSolitude = new Place();
	
		atlantis.reference = "P1";
		atlantis.name = "Atlantis";
		atlantis.points = 10;
		atlantis.grammaticalGender = "F";
		atlantis.grammaticalNumber = "S";
		atlantis.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Atlantis");
			else console.log("Place created: Atlantis");
		});
	
		gothamCity.reference = "P2";
		gothamCity.name = "Gotham City";
		gothamCity.points = 10;
		gothamCity.grammaticalGender = "F";
		gothamCity.grammaticalNumber = "S";
		gothamCity.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Gotham City");
			else console.log("Place created: Gotham City");
		});
	
		centralCity.reference = "P3";
		centralCity.name = "Central City";
		centralCity.points = 10;
		centralCity.grammaticalGender = "F";
		centralCity.grammaticalNumber = "S";
		centralCity.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Central City");
			else console.log("Place created: Central City");
		});

		coastCity.reference = "P4";
		coastCity.name = "Coast City";
		coastCity.points = 10;
		coastCity.grammaticalGender = "F";
		coastCity.grammaticalNumber = "S";
		coastCity.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Coast City");
			else console.log("Place created: Coast City");
		});

		midwayCity.reference = "P5";
		midwayCity.name = "Midway City";
		midwayCity.points = 10;
		midwayCity.grammaticalGender = "F";
		midwayCity.grammaticalNumber = "S";
		midwayCity.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Midway City");
			else console.log("Place created: Midway City");
		});		

		metropolis.reference = "P6";
		metropolis.name = "Metropolis";
		metropolis.points = 10;
		metropolis.grammaticalGender = "F";
		metropolis.grammaticalNumber = "S";
		metropolis.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Metropolis");
			else console.log("Place created: Metropolis");
		});

		themyscira.reference = "P7";
		themyscira.name = "Themyscira";
		themyscira.points = 20;
		themyscira.grammaticalGender = "F";
		themyscira.grammaticalNumber = "S";
		themyscira.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Themyscira");
			else console.log("Place created: Themyscira");
		});
		
		wayneManor.reference = "P8";
		wayneManor.name = "Wayne Manor";
		wayneManor.points = 30;
		wayneManor.placePrereqs = ["P2"];
		wayneManor.grammaticalGender = "F";
		wayneManor.grammaticalNumber = "S";
		wayneManor.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Wayne Manor");
			else console.log("Place created: Wayne Manor");
		});
		
		theBatcave.reference = "P9";
		theBatcave.name = "The Batcave";
		theBatcave.points = 30;
		theBatcave.placePrereqs = ["P2", "P8"];
		theBatcave.grammaticalGender = "F";
		theBatcave.grammaticalNumber = "S";
		theBatcave.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: The Batcave");
			else console.log("Place created: The Batcave");
		});

		dailyPlanet.reference = "P10";
		dailyPlanet.name = "Daily Planet";
		dailyPlanet.points = 20;
		dailyPlanet.placePrereqs = ["P6"];
		dailyPlanet.grammaticalGender = "F";
		dailyPlanet.grammaticalNumber = "S";
		dailyPlanet.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Daily Planet");
			else console.log("Place created: Daily Planet");
		});

		fortressOfSolitude.reference = "P11";
		fortressOfSolitude.name = "Fortress of Solitude";
		fortressOfSolitude.points = 30;
		fortressOfSolitude.placePrereqs = ["P6", "P10"];
		fortressOfSolitude.grammaticalGender = "F";
		fortressOfSolitude.grammaticalNumber = "S";
		fortressOfSolitude.save(function (err, createdDoc) {
			if (err) console.log("Error creating place: Fortress of Solitude");
			else console.log("Place created: Fortress of Solitude");
		});
		
	});

}