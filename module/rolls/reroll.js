import {
    rollCF
} from "./rollCF.js";



export async function reroll(event, message, html, user) {

    let allDice = Array.prototype.slice.call(event.currentTarget.parentNode.children);
    let succes = html.find("span.resultat")[html.find("span.resultat").length - 1]
    let targetDie = event.currentTarget;
    let mess_el = targetDie.closest('.message');
    let messid = mess_el.getAttribute("data-message-id");
    let mess_obj = message.collection.get(messid)


    let nbrRelance = html.find("span.nbrRelance")[html.find("span.nbrRelance").length - 1];

    if (parseInt(nbrRelance.innerText) > 0) {

        let r = new Roll('1d6x6cs>3');
        await r.roll;
        r.toMessage({

            speaker: ChatMessage.getSpeaker(),
        });

        for (let d of r.terms[0].results) {
            console.log(d)
            let newDie = targetDie.cloneNode();

            let reroll = d.result;
            newDie.innerText = reroll;
            targetDie.classList.add(`rerolled`);
            targetDie.classList.remove("rerollable");
            newDie.classList.add(`dice${reroll}`);
            event.currentTarget.parentNode.append(newDie);


            if (reroll > 3) {
                succes.innerText = parseInt(succes.innerText) + 1;
            }
        }
        nbrRelance.innerText = parseInt(nbrRelance.innerText) - 1;
        let content = mess_el.innerHTML;
        const chatData = {
            content: content,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER
        };
        ChatMessage.create(chatData, {});
    } else {
        ui.notifications.warn("Vous n'avez plus de relances disponible")
    }

}