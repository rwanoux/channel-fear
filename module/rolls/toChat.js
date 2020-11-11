export function toChat(content){

const chatData = {
  user: game.user._id,
  speaker: game.user,
  content: content,
  type: CONST.CHAT_MESSAGE_TYPES.OTHER
};
ChatMessage.create(chatData, {});
}