import { systemConfig } from "../config/config.js";

export async function rollAptitude(actor, apt) {

  let diff = systemConfig.difficultes;

  let apti = actor.data.data.aptitudes[apt].label;
  let aptDice = actor.data.data.aptitudes[apt].value;
  let ress = actor.data.data.compteurs.ressource.value;
  let formula = "(@apti)d6x6cs>3";

  const rollAptiDialog = 'systems/ChannelFear/templates/rolls/rollApti-dialog.html';
  const rollAptiContent = await renderTemplate(rollAptiDialog, { diff: diff, actor: actor, apti: apti, ressources: ress, usedRess: 0 });
  const rollResultTemplate = 'systems/ChannelFear/templates/rolls/rollApti-result.html';


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


  async function roll(html, actor) {
    let diffRoll = html.find("#diff").val();
    let usedRess = html.find("#usedRess").val();
    let newRess = actor.data.data.compteurs.ressource.value;
    let reussite = false;
    let echec = false;
    let reussiteT = false;
    let echecT = false;

    //ajout de ressources pour succès
    if (usedRess) {
      formula = formula + "+" + usedRess.toString();
      newRess = actor.data.data.compteurs.ressource.value - usedRess;
    };

    if (newRess < 0) {
      ui.notifications.warn("pas assez de ressources")
    } else {
      //lancé du jet
      let r = new Roll(formula, { apti: aptDice });
      r.evaluate();
      //interprétation
      let nbDes = r.dice[0].results.length;
      let relances = nbDes - parseInt(aptDice);
      let result = parseInt(r.result);
      if (result == diffRoll) { reussite = true };
      if (result > diffRoll) {newRess=+1 ; reussiteT = true};
      if (result < diffRoll) { echec = true };
      if (result == 0) { echec = false;newRess=+1
        echecT = true };

        console.log(newRess)
      const myActor = game.actors.getName(actor.name);
      myActor.update({ 'data.compteurs.ressource.value': newRess });

      let rollConfig = {

        actor: actor,
        aptiName: apti,
        aptiDice: aptDice,
        usedRess: usedRess,
        relances: relances,
        result: result,
        difficulte: diffRoll,
        reussite: reussite,
        echec: echec,
        reussiteT: reussiteT,
        echecT: echecT
      }
      console.log(rollConfig);

      const rollResultContent = await renderTemplate(rollResultTemplate, rollConfig);

      r.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor.name }),
        flavor: rollResultContent
      });
    }

  }


}