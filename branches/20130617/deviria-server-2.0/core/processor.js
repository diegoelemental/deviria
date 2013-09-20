/* 
 * Deviria Server
 * Devir Livraria 2013 (c) - Todos os direitos reservados.
 *  
 * arquivo ...: processor.js
 * versão ....: 1.0
 * autor......: Julio Monteiro
 *
 * Realiza o processamento de Tales, fazendo as substituições pertinentes e
 * fornecendo objetos Tale configurados.
 */

var S = require("string")
  , Lexer = require("lex");
  
/**
 * Faz o parse da frase, retornando uma lista de pontos de inserção e substituições encontradas 
 *
 * @param content  O string contendo o texto puro para fazer o parse.
 * @return
 *     um dicionário contendo um array de pontos de inserção e substituições encontrados. 
 */
var parsePhrase = function(content) {
    var lex = new Lexer;
    var insertions = [];
    var substitutions = [];
    var currentPoint = 0;

    lex.addRule(/\s/, function(lexeme) { //white spaces 
    });

    lex.addRule(/./, function(lexeme) { //white spaces 
    });

    lex.addRule(/<P\d?>/, function(lexeme) { // Heroes
        var insertion = {};
        insertion.type = "P";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/<O\d?>/, function(lexeme) { // Items
        var insertion = {};
        insertion.type = "O";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/<N\d?>/, function(lexeme) { // NPCs 
        var insertion = {};
        insertion.type = "N";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/<C\d?>/, function(lexeme) { // Places 
        var insertion = {};
        insertion.type = "C";
        insertion.ref = lexeme
        insertion.pos = currentPoint; 
        insertions.push(insertion);
        currentPoint++;
    });

    lex.addRule(/\[[^:]+?\]/, function(lexeme) { // Substitutions sem ref
        var subst = {};
        subst.pos = currentPoint;
        subst.value = lexeme;
        substitutions.push(subst);
    });

    lex.addRule(/\[[^\]:]+:[PONC]\d?\]/, function(lexeme) { // Substitutions com ref
        var ref = "<"+S(lexeme).between(":","]").s+">";
        var pos = -1;
        for (var pos=0; pos<=insertions.length; pos++) {
            if (insertions[pos].ref == ref) {
                break;
            }
        }
        var subst = {};
        subst.pos = pos
        subst.value = lexeme;
        substitutions.push(subst);
    });

    lex.setInput(content);
    lex.lex();
    substitutions.sort(function(a,b){return a.pos-b.pos;});
    return {"ins":insertions, "subs":substitutions};

}

var processSubstitutions = function(content, sub_places, subs, obj) {
    for (var s in sub_places) {
        var sub_ref = sub_places[s].value;

        var sub_name = S(sub_ref);
        if (sub_name.contains(":"))
            sub_name = sub_name.between("[",":").s;
        else
            sub_name = sub_name.between("[","]").s;
        var sub = subs.filter(function(s) {return s.name == sub_name})[0];
        if (obj.grammaticalGender == "M") {
            if (obj.number == "P") {
                content = content.replace(sub_ref, sub.malePluralForm);
            } else {
                content = content.replace(sub_ref, sub.maleSingularForm);
            }
        } else {
            if (obj.grammaticalNumber == "P") {
                content = content.replace(sub_ref, sub.femalePluralForm);
            } else {
                content = content.replace(sub_ref, sub.femaleSingularForm);
            }
        }
    }
    return content;
}

/**
 * Processa uma frase fornecida, adicionando o jogador, elementos adicionais
 * e os ajustes de concordância, conforme necessário.
 *
 * @param phrase   Frase base que será processada e convertida.
 * @param heroes   Array ordenado de heróis participantes da frase.
 * @param places   Array ordenado de locais que serão inseridos na frase.
 * @param items    Array ordenado de itens que serão inseridos na frase.
 * @param npcs     Array ordenado de NPCs que serão inseridos na frase.
 * @return
 *      O conteúdo da frase, convertido para um conto, utilizando todos os
 *      elementos fornecidos em substituição aos tokens originais.
 */
var processTale = function(phrase, heroes, places, items, npcs, substitutions) {

    //
    // fazer o parse do conteudo da Phrase e encontrar os pontos de inserção
    // e as substituições relacionadas.
    //
    var content = phrase.contents;
    var parsed = parsePhrase(content);
    var insertions = parsed["ins"];
    var sub_places = parsed["subs"];
    var pointsEarned = phrase.points;

    for (var i in insertions) {
    
        var insertion = insertions[i];

        switch (insertion.type) {
        
            case "P":
                var hero = heroes.shift();
                if (typeof hero == 'undefined') throw new Error("Missing hero for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, hero.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, hero);
                break;
            case "O":
                var item = items.shift();
                if (typeof item == 'undefined') throw new Error("Missing item for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, item.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, item);
                pointsEarned += item.points;
                break;
            case "N":
                var npc = npcs.shift();
                if (typeof npc == 'undefined') throw new Error("Missing npc for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, npc.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, npc);
                pointsEarned += npc.points;
                break;
            case "C":
                var place = places.shift();
                if (typeof place == 'undefined') throw new Error("Missing place for phrase at "+insertion.ref);
                content = content.replace(insertion.ref, place.name);
                var my_subs = sub_places.filter(function(sub) {return sub.pos == insertion.pos});
                content = processSubstitutions(content, my_subs, substitutions, place);
                pointsEarned += place.points;
                break;
                
        }
        
    }

    var convertedPhrase = S(content).left(1).capitalize().s + content.slice(1);
    return convertedPhrase;
    
}