import {
  systemConfig
} from "../config/config.js";

export async function rollCF(actor, apt, relanceDispo, spe, dgt) {
  console.log(arguments)
  if (apt === "degats") {

    let aptiName = "dégats";
    let formula = `${dgt}d6x6cs>3`;

    let r = new Roll(formula, {
      apti: dgt
    });
    r.roll();

    let dicesResults = [];
    for (let res of r.terms[0].results) {
      dicesResults.push(res.result);
    }
    let aptiDice = r.terms[0].results.length;
    console.log(aptiDice);
    let result = parseInt(r.result);
    let rollConfig = {
      "aptiName": aptiName,
      "aptiDice": aptiDice,
      "result": result,
      "dicesResults": dicesResults,
      relanceDispo: relanceDispo
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
    let regCarac = /['  -]/;
    let apti = actor.data.data.aptitudes[apt.replace(regCarac, "")].label;
    let aptDice = actor.data.data.aptitudes[apt.replace(regCarac, "")].value;
    let ress = actor.data.data.compteurs.ressource.value;
    let newRess = ress;
    let formula = "(@apti)d6x6cs>3";
    const rollCFDialog = 'systems/ChannelFear/templates/rolls/rollCF-dialog.html';
    const rollCFContent = await renderTemplate(rollCFDialog, {
      diff: diff,
      actor: actor,
      apti: apti,
      ress: ress,
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
      close: () => { }
    });
    aptiDialog.render(true);

    //--------------jet de dés ----------------
    //----------------------------------------
    async function roll(html, actor) {

      let diffRoll = html.find("#diff").val();
      let ressource = html.find("#ressource").val()
      let reussite = false;
      let echec = false;
      let reussiteT = false;
      let echecT = false;
      //lancé du jet
      let r = new Roll(formula, {
        apti: aptDice
      });
      await r.evaluate();
      console.log(r);

      //interprétation
      let nbDes = r.dice[0].results.length;
      let dicesResults = [];
      let relances = nbDes - parseInt(aptDice);
      let result = parseInt(r.result);

      if (result + ressource == diffRoll) {
        reussite = true;
      }
      if (result + ressource > diffRoll) {
        newRess++;
        reussiteT = true;
      }
      if (result + ressource < diffRoll) {
        echec = true;
      }
      if (result + ressource == 0) {
        echec = false;
        newRess--;
        echecT = true;
      }
      console.log("------------newRess-------" + newRess);

      for (let res of r.terms[0].results) {
        dicesResults.push(res.result);
      }
      if (ressource) { newRess = newRess - ressource };
      if (newRess > 6) { newRess = 6 };

      let rollConfig = {
        ressource: ressource,
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
        relanceDispo: relanceDispo,
        newRess: newRess
      };



      await actor.update({
        "data.compteurs.ressource.value": newRess
      });

      //envoyer le resultat dans le chat
      const rollResultTemplate = 'systems/ChannelFear/templates/rolls/rollCF-result.html';
      let content = await renderTemplate(rollResultTemplate, rollConfig);

      r.toMessage({
        speaker: ChatMessage.getSpeaker({
          actor: actor.name
        }),
        flags: {
          channelFear: "roll"
        },
        content: content,
      });
    }
  }
}