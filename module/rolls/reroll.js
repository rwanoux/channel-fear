import {
    rollCF
} from "./rollCF.js";



export async function reroll(event, html, data) {
    console.log("----------------reroll-----------");
    let allDice = Array.prototype.slice.call(event.currentTarget.parentNode.children);
    let succes = html.find("span.resultat")[html.find("span.resultat").length - 1]
    let targetDie = event.currentTarget;
    let mess = targetDie.closest('.message');
    let nbrRelance = html.find("span.nbrRelance")[html.find("span.nbrRelance").length - 1];

    if (parseInt(nbrRelance.innerText) > 0) {

        let r = new Roll('1d6x6cs>3');
        await r.roll;

        r.toMessage({

                speaker: ChatMessage.getSpeaker(),
                flags: {
                    channelFear: "roll"
                },
                title: "jet de relance",
                rollMode: "blind"
            },

        );
        let newDie = targetDie.cloneNode();
        let reroll = r.terms[0].results[0].result;
        newDie.innerText = reroll;
        targetDie.classList.add(`rerolled`);
        targetDie.classList.remove("rerollable")
        newDie.classList.add(`dice${reroll}`)
        event.currentTarget.parentNode.append(newDie);
        nbrRelance.innerText = parseInt(nbrRelance.innerText) - 1;
        if (reroll > 3) {
            succes.innerText = parseInt(succes.innerText) + 1;
        }
    } else {
        ui.notifications.warn("Vous n'avez plus de relances disponible")
    }

}