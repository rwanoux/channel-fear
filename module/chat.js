import {reroll} from './rolls/reroll.js'

export function addChatListeners(app,html,data){
   html.on("click",".rerollable",event=>{
    event.preventDefault();
    onReroll(event,html);
   })
 
}

function onReroll(event,html){
    reroll(event,html);
}