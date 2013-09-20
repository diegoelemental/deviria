/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: dbinit.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Inicialização dos valores iniciais de banco de dados. Deve ser carregado 
 * durante a inicialização do servidor para que remova dados antigos e crie
 * os novos dados esperados pelo sistema.
 */

/**
 * Inicializa os heróis do sistema automaticamente.
 * 
 * Os dados de heróis não são mantidos na aplicação, sendo carregados sempre por
 * padrão em cada inicialização. Qualquer dado já existente será removido.
 *
 * Todos os identificadores registrados para cada herói são fixos, desta forma
 * a rastreabilidade se mantém para os relacionamentos entre documentos.
 */
exports.initializeHeroes = function() {

    var Hero = require('./domain/hero.js').Hero;     
    Hero.find(function (err, docs) {

		if (docs && docs.length > 0) {
			console.log('[DEVIRIA] Heroes found. Cleaning everything.');
			for (i=0; i<docs.length; i++) {
				docs[i].remove();
			}						
		} 

		var glee = new Hero()
		  , gandolfo = new Hero()
		  , sonsa = new Hero()
		  , duffy = new Hero()
		  , meuAmigo = new Hero()
		  , minhaAmiga = new Hero();

        glee._id = "51bf48b8e11b164829000002";
		glee.name = "Glee, o Bárbaro Errante";
		glee.imageURL = "glee.png";
		glee.grammaticalGender = "M";
        glee.description = "Ele é forte, destemido e definido. Mas incapaz de raciocinar com a mesma velocidade "
		                 + "que seus músculos o impulsionam para ação. O que  Crom lhe deu em massa muscular, "
                         + "economizou na encefálica! Mesmo não sendo uma figura que agrade aos olhos de qualquer "
                         + "ser provido de algum senso estético. Ele tem uma imensa beleza interior com que Crom "
						 + "também o abençoou!";
		glee.save(function (err, createdDoc) {
			if (err) console.log('[DEVIRIA] Error creating hero: Glee');
			else console.log('[DEVIRIA] Hero created: Glee');
		});

        gandolfo._id = "51bf48b8e11b164829000003";
		gandolfo.name = "Gandolfo, o Mago";
		gandolfo.imageURL = "gandolfo.png";
		gandolfo.grammaticalGender = "M";
        gandolfo.description = "Ele é sábio e poderoso e certamente seria um dos seres mais poderosos de todo o reino, "
		                     + "não fosse o cruel destino ter colocado a cabeça de Gandolfo (e o enorme cérebro que ela guarda) "
							 + "no caminho de uma imensa clava bárbara. Junto com parte da sua memória (que, se ele recuperou "
							 + "algum dia, já não se lembra) perdeu também parte de suas mágicas...";
		gandolfo.save(function (err, createdDoc) {
			if (err) console.log('[DEVIRIA] Error creating hero: Gandolfo');
			else console.log('[DEVIRIA] Hero created: Gandolfo');
		});

        sonsa._id = "51bf48b8e11b164829000004";
		sonsa.name = "Sonsa, a Elfa Doméstica";
		sonsa.imageURL = "sonsa.png";
		sonsa.grammaticalGender = "F";
        sonsa.description = "Diferentemente de suas belas e altas irmãs de Valfenda, nossas pobres Elfas foram "
		                  + "oprimidas durante milênios, mas agora reclamam os seus direitos! Do alto de seus "
						  + "50 cm de altura, essas criaturas que se assemelham a um quati atropelado, lutam "
						  + "com armas e poderes mágicos para conquistar o que lhes foi negado durante tanto tempo!"
		sonsa.save(function (err, createdDoc) {
			if (err) console.log('[DEVIRIA] Error creating hero: Sonsa');
			else console.log('[DEVIRIA] Hero created: Sonsa');
		});

        duffy._id = "51bf48b8e11b164829000005";
		duffy.name = "Duffy, a Caçadora";
		duffy.imageURL = "duffy.png";
		duffy.grammaticalGender = "F";
        duffy.description = "Se correr a Duffy pega, se ficar a Duffy come! Nascida humana, mas amaldiçoada ao nascer, "
		                  + "Duffy transformou-se numa ogra de avantajadas proporções ao completar  18 anos. Temida "
						  + "nos quatro cantos do Reino, ela dedica-se a caçar vampiros, lobisomens e outros saborosos "
						  + "seres sobrenaturais... sim, para comer... afinal, Duffy precisa manter sua boa forma!";
		duffy.save(function (err, createdDoc) {
			if (err) console.log('[DEVIRIA] Error creating hero: Duffy');
			else console.log('[DEVIRIA] Hero created: Duffy');
		});

		meuAmigo._id = "51bf48b8e11b164829000006";
		meuAmigo.name = "O Meu Amigo, que não sabe nada de RPG";
		meuAmigo.imageURL = "amigo.png";
		meuAmigo.grammaticalGender = "M";
        meuAmigo.description = "Certamente, você tem um desses por perto! São Newbies que não fazem a menor ideia do que "
                             + "está acontecendo. Se existe uma armadilha naquele calabouço... já sabemos quem é que vai " 
							 + "pisar nela. Então, cabe a vocês cuidarem desses aprendizes, que precisam descobrir (de "
                             + "preferência não da pior maneira) que nunca é uma boa ideia acordar um Troll, independente "
							 + "do tamanho da espada que ele está carregando!";
		meuAmigo.save(function (err, createdDoc) {
			if (err) console.log('[DEVIRIA] Error creating hero: Meu Amigo');
			else console.log('[DEVIRIA] Hero created: Meu Amigo');
		});

		minhaAmiga._id = "51bf48b8e11b164829000007";
		minhaAmiga.name = "A Minha Amiga, que não sabe nada de RPG";
		minhaAmiga.imageURL = "amiga.png";
		minhaAmiga.grammaticalGender = "F";
        minhaAmiga.description = "Certamente, você tem uma dessas por perto! São Newbies que não fazem a menor ideia do que "
                               + "está acontecendo. Se existe uma armadilha naquele calabouço... já sabemos quem é que vai " 
		  					   + "pisar nela. Então, cabe a vocês cuidarem dessas aprendizes, que precisam descobrir (de "
                               + "preferência não da pior maneira) que nunca é uma boa ideia acordar um Troll, independente "
							   + "do tamanho da espada que ele está carregando!";
		minhaAmiga.save(function (err, createdDoc) {
			if (err) console.log('[DEVIRIA] Error creating hero: Minha Amiga');
			else console.log('[DEVIRIA] Hero created: Minha Amiga');
		});
		
	});

};





exports.initializeAdventures = function() {
    var Adventure = require('./domain/adventure.js').Adventure;

	var playerThiagoUriel = new Player();
	playerThiagoUriel.assignedHeroID = "1234";
	playerThiagoUriel.currentlyActive = true;
	playerThiagoUriel.pointsEarned = 20;
	playerThiagoUriel.founder = true;
	playerThiagoUriel.facebookInfo = {
		userID: "100001623927718",
		displayName: "Thiago Uriel Garcia"
	};

	var playerRicardo = new Player();
	playerRicardo.assignedHeroID = "1235";
	playerRicardo.currentlyActive = true;
	playerRicardo.pointsEarned = 25;
	playerRicardo.founder = false;
	playerRicardo.facebookInfo = {
		userID: "1337876601",
		displayName: "Ricardo Pereira Ramalho"
	};

	var playerJulio = new Player();
	playerJulio.assignedHeroID = "1235";
	playerJulio.currentlyActive = true;
	playerJulio.pointsEarned = 25;
	playerJulio.founder = false;
	playerJulio.facebookInfo = {
		userID: "1510994864",
		displayName: "Julio Monteiro"
	};
		
	var playerJulio2 = new Player();
	playerJulio2.assignedHeroID = "1235";
	playerJulio2.currentlyActive = true;
	playerJulio2.pointsEarned = 25;
	playerJulio2.founder = true;
	playerJulio2.facebookInfo = {
		userID: "1510994864",
		displayName: "Julio Monteiro"
	};		
		
	var adventure = new Adventure();
	adventure.title = "Procurando Gandolfo";
	adventure.pointsEarned = 120;
	adventure.size = 'S';
	adventure.players = [];
	adventure.players.push(playerThiagoUriel);
	adventure.players.push(playerRicardo);
	adventure.players.push(playerJulio);
	adventure.save(function (err, createdDoc) {
		if (err) console.log("Error creating adventure: " + err);
	});
	
	var adventure = new Adventure();
	adventure.title = "A Vingança de Duffy";
	adventure.pointsEarned = 150;
	adventure.size = 'S';
	adventure.players = [];
	adventure.players.push(playerThiagoUriel);
	adventure.players.push(playerJulio);
	adventure.save(function (err, createdDoc) {
		if (err) console.log("Error creating adventure: " + err);
	});

	var adventure = new Adventure();
	adventure.title = "3 Guerreiros e um Pequeno Ogro";
	adventure.pointsEarned = 220;
	adventure.size = 'S';
	adventure.players = [];
	adventure.players.push(playerThiagoUriel);
	adventure.players.push(playerRicardo);
	adventure.save(function (err, createdDoc) {
		if (err) console.log("Error creating adventure: " + err);
	});
	
	var adventure = new Adventure();
	adventure.title = "Subindo a Montanha para Queimar o Anel";
	adventure.pointsEarned = 250;
	adventure.size = 'S';
	adventure.players = [];
	adventure.players.push(playerJulio2);
	adventure.players.push(playerRicardo);
	adventure.save(function (err, createdDoc) {
		if (err) console.log("Error creating adventure: " + err);
	});
	
}