import {
    rollCF
} from "./rollCF.js";



export async function reroll(event, html) {
    console.log("----------------reroll-----------");


    let allDice = Array.prototype.slice.call(event.currentTarget.parentNode.children)
    let targetDie = event.currentTarget;
    console.log(allDice);
    console.log(allDice.indexOf(targetDie));

    let mess = targetDie.closest('.message');
    let nbrRelance = html.find("span.nbrRelance")[html.find("span.nbrRelance").length - 1].innerText;
    console.log(nbrRelance);
    let r = new Roll('1d6x6cs>3');

    let rollConfig={
        
    }
    const rollResultTemplate = 'systems/ChannelFear/templates/rolls/reroll.html';
    renderTemplate(rollResultTemplate, rollConfig).then(c => {
        r.toMessage({
            speaker: ChatMessage.getSpeaker(),
            flags: {
                channelFear: "roll"
            },
            content: c,
        });
    })
}