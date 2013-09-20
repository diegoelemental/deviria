var mongoose = require('../domain/database').mongoose,
    Hero = require('../domain/hero').Hero,
    Item = require('../domain/item').Item,
    NPC = require('../domain/npc').NPC,
    Phrase = require('../domain/phrase').Phrase,
    Place = require('../domain/place').Place,
    Substitution = require('../domain/substitution').Substitution,
    processTale = require('../domain/adventure').processTale;

mongoose.connection.on('error', function(err){
    console.log(err);
});
 
exports.setUp = function(callback) {
    mongoose.connect('mongodb://localhost/UnitTest');
    callback();
};
 
exports.tearDown = function(callback) {
    mongoose.connection.db.executeDbCommand( {dropDatabase:1}, function(err, result) {
        console.log(err);
        process.exit(0);
    });
    mongoose.disconnect();
    callback();
};
 
exports.processTale = function(test) {
    test.expect(5);

    var s1 = new Substitution({
		name: "O",
		maleSingularForm: "o",
		femaleSingularForm: "a",
		malePluralForm: "os",
		femalePluralForm: "as"
    });
    s1.save(function (err, d) {
			if (err) throw err;
	});

    var s2 = new Substitution({
		name: "NO",
		maleSingularForm: "no",
		femaleSingularForm: "na",
		malePluralForm: "nos",
		femalePluralForm: "nas"
    });
    s2.save(function (err, d) {
			if (err) throw err;
	});

    var s3 = new Substitution({
		name: "AO",
		maleSingularForm: "ao",
		femaleSingularForm: "à",
		malePluralForm: "aos",
		femalePluralForm: "às"
    });
    s3.save(function (err, d) {
			if (err) throw err;
	});

    var s4 = new Substitution({
		name: "PERDIDO",
		maleSingularForm: "perdido",
		femaleSingularForm: "perdida",
		malePluralForm: "perdidos",
		femalePluralForm: "perdidas"
    });
    s4.save(function (err, d) {
			if (err) throw err;
	});

    var s5 = new Substitution({
		name: "UM",
		maleSingularForm: "um",
		femaleSingularForm: "uma",
		malePluralForm: "uns",
		femalePluralForm: "umas"
    });
    s5.save(function (err, d) {
			if (err) throw err;
	});

    var phrase1 = new Phrase({
        reference: "F1",
        contents: "[O] <P> entrou [NO] <C> [PERDIDO:P].",
        points: 100,
        removesPlayer: false
    });
    phrase1.save(function (err, d) {
			if (err) throw err;
	});

    var phrase2 = new Phrase({
        reference: "F2",
        contents: "[O] <P> pediu [UM] <O> [AO] <N>.",
        points: 200,
        removesPlayer: false
    });
    phrase2.save(function (err, d) {
			if (err) throw err;
	});

    var hero = new Hero({
        name: "Elfo",
        description : "Um elfo comum.",
		imageURL: "dcheroes/aquaman.jpg",
        grammaticalGender: "M"
    });
    hero.save(function (err, d) {
			if (err) throw err;
	});

    var npc = new NPC({
        reference: "N1",
        name: "taverneiro",
        points: 10,
        grammaticalGender: "M" ,
        grammaticalNumber: "S"
    });
    npc.save(function (err, d) {
			if (err) throw err;
	});

    var item = new Place({
        reference: "O1",
        name: "bom vinho",
        points: 10,
        grammaticalGender: "M",
        grammaticalNumber: "S" 
    });
    item.save(function (err, d) {
			if (err) throw err;
	});

    var place = new Place({
        reference: "P1",
        name: "floresta",
        points: 10,
		grammaticalGender: "F",
        grammaticalNumber: "S"
    });
    place.save(function (err, d) {
			if (err) throw err;
	});

    var result;

    // Exemplo de concordância reversa somente com place
    result = processTale(phrase1, [hero], [place], [], [], [s1,s2, s3, s4, s5]); 
    test.equal("O Elfo entrou na floresta perdido.", result.convertedPhrase);
    test.equal(phrase1.points+place.points, result.pointsEarned);

    // Exemplo de concordância normal, com item e npc 
    result = processTale(phrase2, [hero], [], [item], [npc], [s1,s2, s3, s4, s5]); 
    test.equal("O Elfo pediu um bom vinho ao taverneiro.", result.convertedPhrase);
    test.equal(phrase2.points+item.points+npc.points, result.pointsEarned);

    // Exemplo de chamada faltando parâmetros
    test.throws(function() {
    processTale(phrase1, [hero], [], [], [], [s1,s2, s3, s4, s5]); 
    }, Error, "Missong place for phrase at: <C>")


    test.done();
};

