import {reroll} from './rolls/reroll.js'

export function addChatListeners(message,html,data){
   html.on("click",".rerollable",event=>{
    event.preventDefault();
    onReroll(event,message,html,data);
   })
 
}

function onReroll(event,message,html,data){
    console.log(data)
    reroll(event,message,html,data);
}