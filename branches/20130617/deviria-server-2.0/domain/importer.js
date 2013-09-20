

 

 var phrase1 = new Phrase({
        reference: "F1",
        contents: "Tudo começou quase que sem querer. Lá estava [P1] [parado:P1] em frente [aa] [C], cuidando da sua vida e brincando displicentemente com [o] [seu] [O], quando, sem aviso algum, surge [P2] na esquina e caminha decididamente em sua direção. Sem tempo para qualquer manobra evasiva, não lhe resta escolha, senão ouvir o que será dito a seguir, pois certamente uma aventura está por vir!",
        points: 30,
        removesPlayer: false
        });
        phrase1.save(function (err, d) {
                if (err) throw err;
        });

        var phrase2 = new Phrase({
        reference: "F2",
        contents: "[P],  [N1] e [N2] estão atacando [o] [C] e precisam da nossa ajuda!",
        points: 30,
        removesPlayer: false,
        phrasePrereqs: "F1"
        });
        phrase2.save(function (err, d) {
                if (err) throw err;
        });