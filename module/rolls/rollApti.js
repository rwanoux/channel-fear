import { systemConfig } from "../config/config.js";

export async function rollAptitude(actor, apt) {

  let diff = systemConfig.difficultes;

  let apti = actor.data.data.aptitudes[apt].label;
  let aptDice = actor.data.data.aptitudes[apt].value;
  let ress = actor.data.data.compteurs.ressource.value;
  let formula = "(@apti)d6x6cs>3";


  console.log(actor);
  console.log(apt);

  const rollAptiDialog = 'systems/ChannelFear/templates/rolls/rollApti-dialog.html';
  const rollAptiContent = await renderTemplate(rollAptiDialog, { diff: diff, actor: actor, apti: apti, ressources: ress, usedRess: 0 });
  const rollResultTemplate = 'systems/ChannelFear/templates/rolls/rollApti-result.html';


  let aptiDialog = new Dialog({
    title: "jet d'aptitude ",
    content: rollAptiContent,
    buttons: {
      one: {
        label: "jeter les dés",
        callback: (html) => roll(html)
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


  async function roll(html) {
    let diffRoll = html.find("#diff").val();
    let ress = html.find("#usedRess").val();
    let form = "";
    let reussite = false;
    let echec = false;
    let reussiteT = false;
    let echecT = false;

    //ajout de ressources pour succès
    if (ress) {
      form = formula + "+" + ress.toString();
    } else { form = formula };
    //lancé du jet
    let r = new Roll(form, { apti: aptDice });
    r.evaluate();
    //interprétation
    let nbDes = r.dice[0].results.length;
    let relances = nbDes - parseInt(aptDice);
    let result = parseInt(r.result);
    if (result == diffRoll) { reussite = true };
    if (result > diffRoll) { reussiteT = true };
    if (result < diffRoll) { echec = true };
    if (result == 0) { echec = false; echecT = true };



    const rollResultContent = await renderTemplate(rollResultTemplate, {
      actor: actor,
      aptiName: apti,
      aptiDice: aptDice,
      ressources: ress,
      relances: relances,
      result: result,
      difficulte: diffRoll,
      reussite: reussite,
      echec: echec,
      reussiteT: reussiteT,
      echecT: echecT,
    });

    r.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor.name }),
      flavor: rollResultContent
    });

  }


}