export function toChat(content) {

  const chatData = {
    user: game.user.id,
    speaker: game.user,
    content: content,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  };
  ChatMessage.create(chatData, {});
}