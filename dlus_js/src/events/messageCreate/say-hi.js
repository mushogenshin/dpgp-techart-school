export default function (message, client, handler) {
  if (message.content === "hey") {
    message.reply("Hi!");
  }
}
