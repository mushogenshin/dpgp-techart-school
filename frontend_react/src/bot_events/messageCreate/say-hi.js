export default function (message, client, handler) {
  if (message.content.includes("hey")) {
    message.reply("Hi!");
  }
}
