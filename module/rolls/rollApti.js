import { systemConfig } from "../config/config.js";

export async function rollAptitude(actor, apt, relanceDispo) {


  //----------configs
  let diff = systemConfig.difficultes;
  let apti = actor.data.data.aptitudes[apt].label;
  let aptDice = actor.data.data.aptitudes[apt].value;
  let ress = actor.data.data.compteurs.ressource.value;
  let formula = "(@apti)d6x6cs>3";
  const rollAptiDialog = 'systems/ChannelFear/templates/rolls/rollApti-dialog.html';
  const rollAptiContent = await renderTemplate(rollAptiDialog, { diff: diff, actor: actor, apti: apti, ressources: ress, usedRess: 0 });
  const rollResultTemplate = 'systems/ChannelFear/templates/rolls/rollApti-result.html';

//----------le dialog pour la difficulté
  let aptiDialog = new Dialog({

    title: "jet d'aptitude ",
    content: rollAptiContent,
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
    close: () => {
    }
  });
  aptiDialog.render(true);

//--------------jet de dés ----------------
//----------------------------------------
  async function roll(html, actor) {
    let diffRoll = html.find("#diff").val();
    let newRess = parseInt(actor.data.data.compteurs.ressource.value);
    let reussite = false;
    let echec = false;
    let reussiteT = false;
    let echecT = false;
    //lancé du jet
    let r = new Roll(formula, { apti: aptDice });
    r.evaluate();
    console.log(r);
    //interprétation
    let nbDes = r.dice[0].results.length;
    let dicesResults=[];
    let relances = nbDes - parseInt(aptDice);
    let result = parseInt(r.result);
    if (result == diffRoll) { reussite = true; }
    if (result > diffRoll) { newRess++; reussiteT = true; }
    if (result < diffRoll) { echec = true; }
    if (result == 0) { echec = false; newRess--; echecT = true; }
    
    for (let res of r.terms[0].results ){
      dicesResults.push(res.result);
    }
    let rollConfig = {
      dicesResults:dicesResults,
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
      relanceDispo:relanceDispo
    };
    console.log("----------------------------"+relanceDispo);
    //envoyer le resultat dans le chat
    const rollResultContent = await renderTemplate(rollResultTemplate, rollConfig);
    r.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor.name }),
      flags:{
        channelFear:"roll"
      },
      flavor: rollResultContent
    });

    //updater la ressource si succes total ou echec total
    let myActor = game.actors.getName(actor.name);
    await myActor.update({ "data.compteurs.ressource.value": newRess });

  }




}