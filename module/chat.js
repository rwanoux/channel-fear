import {reroll} from './rolls/reroll.js'

export function addChatListeners(message,html,data){
   html.on("click",".rerollable",event=>{
    event.preventDefault();
    onReroll(event,message,html,data);
   })
 
}

function onReroll(event,message,html,data){
    console.log(arguments);
    if (game.user.data._id==data.user.data._id||game.user.isGm){
    reroll(event,message,html,data);
    }else{ui.notifications.warn("vous tentez de relancer pour un jet que vous n'avez pas fait !")}
}