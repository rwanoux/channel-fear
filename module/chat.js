import {reroll} from './rolls/reroll.js'

export function addChatListeners(app,html,data){
   html.on("click",".rerollable",event=>{
    event.preventDefault();
    onReroll(event,html,data);
   })
 
}

function onReroll(event,html,data){
    console.log(data)
    reroll(event,html,data);
}