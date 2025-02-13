export default async function (message, client, handler) {
  // example of waiting for subsequent messages
  // if (message.content.toLowerCase() === "!rps") {
  //   await message.channel.send("Input your choice!");
  //   const filter = (m) =>
  //     ["rock", "paper", "scissors"].includes(m.content.toLowerCase());
  //   const msg = await message.channel.awaitMessages({
  //     filter,
  //     max: 1,
  //     time: 30000,
  //     errors: ["time"],
  //   });
  //   await message.channel.send(`You chose ${msg.first().content}`);
  // }

  if (message.content.toLowerCase().includes("hey")) {
    const userId = message.author.id;
    console.log(userId);
    await message.channel.send(`Hello <@${userId}>!`);
  }
}
