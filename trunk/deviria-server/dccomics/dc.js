/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: dc.js
 * versão ....: 1.0
 * autor......: Thiago Uriel M. Garcia
 *
 * Programa de testes para adição de massa de dados contendo os heróis da DC Comics.
 */

exports.initialize = function() {

	require("./heroes.js").loadHeroes();
	require("./places.js").loadPlaces();
	require("./npcs.js").loadNPCs();
	require("./items.js").loadItems();
	require("./substitutions.js").loadSubstitutions();
	require("./phrases.js").loadPhrases();	
	require("./adventures.js").loadAdventures();	
}
