import {
  systemConfig
} from "../config/config.js";

export async function rollCF(actor, apt, relanceDispo, spe, dgt) {

  if (apt === "degats") {

    let diff = systemConfig.difficultes;
    let aptiName= "dégats";
    let apti = apt;
    let aptDice = dgt;
    let formula = dgt+"d6x6cs>3";
   
    let r = new Roll(formula, {
      apti: aptDice
    });
    r.roll();
    console.log(r);
    let dicesResults=[];
    for (let res of r.terms[0].results) {
      dicesResults.push(res.result);
    }
    let result = parseInt(r.result);
    let rollConfig = {
      "aptiName":aptiName,
      "aptDice":aptDice,
      "result":result,
      "dicesResults": dicesResults,
    };
    const rollResultTemplate = 'systems/ChannelFear/templates/rolls/dgtCF-result.html';
    renderTemplate(rollResultTemplate, rollConfig).then(c => {

      r.toMessage({
        speaker: ChatMessage.getSpeaker({
          actor: actor.name
        }),
        flags: {
          channelFear: "roll"
        },
        content: c,
      });

    })


  } else {


    //----------configs
    let diff = systemConfig.difficultes;
    let apti = actor.data.data.aptitudes[apt].label;
    let aptDice = actor.data.data.aptitudes[apt].value;
    let ress = actor.data.data.compteurs.ressource.value;
    let newRess = ress;
    let formula = "(@apti)d6x6cs>3";
    const rollCFDialog = 'systems/ChannelFear/templates/rolls/rollCF-dialog.html';
    const rollCFContent = await renderTemplate(rollCFDialog, {
      diff: diff,
      actor: actor,
      apti: apti,
      ressources: ress,
      usedRess: 0
    });


    //----------le dialog pour la difficulté
    let aptiDialog = new Dialog({

      title: "jet d'aptitude ",
      content: rollCFContent,
      buttons: {
        one: {
          label: "jeter les dés",
          callback: (html) => roll(html, actor)
        },
        two: {
          label: "fermer",
        }
      },
      default: "one",
      close: () => {}
    });
    aptiDialog.render(true);

    //--------------jet de dés ----------------
    //----------------------------------------
    async function roll(html, actor) {

      let diffRoll = html.find("#diff").val();
      let reussite = false;
      let echec = false;
      let reussiteT = false;
      let echecT = false;
      //lancé du jet
      let r = new Roll(formula, {
        apti: aptDice
      });
      r.roll();
      console.log(r);
      //interprétation
      let nbDes = r.dice[0].results.length;
      let dicesResults = [];
      let relances = nbDes - parseInt(aptDice);
      let result = parseInt(r.result);
      if (result == diffRoll) {
        reussite = true;
      }
      if (result > diffRoll) {
        newRess++;
        reussiteT = true;
      }
      if (result < diffRoll) {
        echec = true;
      }
      if (result == 0) {
        echec = false;
        newRess--;
        echecT = true;
      }
      console.log("------------newRess-------" + newRess);

      for (let res of r.terms[0].results) {
        dicesResults.push(res.result);
      }

      let rollConfig = {
        spe: spe,
        dicesResults: dicesResults,
        actor: actor,
        aptiName: apti,
        aptiDice: aptDice,
        relances: relances,
        result: result,
        difficulte: diffRoll,
        reussite: reussite,
        echec: echec,
        reussiteT: reussiteT,
        echecT: echecT,
        relanceDispo: relanceDispo
      };



      actor.update({
        "data.compteurs.ressource.value": newRess
      }).then(a => {

        //envoyer le resultat dans le chat
        const rollResultTemplate = 'systems/ChannelFear/templates/rolls/rollCF-result.html';
        renderTemplate(rollResultTemplate, rollConfig).then(c => {

          r.toMessage({
            speaker: ChatMessage.getSpeaker({
              actor: a.name
            }),
            flags: {
              channelFear: "roll"
            },
            content: c,
          });

        })

      });
      //updater la ressource si succes total ou echec total


    }
  }
}