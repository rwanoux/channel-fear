export async function reroll(event){
    console.log("----------------reroll-----------");
    const dice = event.currentTarget;
    const mess = dice.closest("li.message");
    const id=mess.getAttribute("data-message-id");
   ChatLog.notify();
    
    
}