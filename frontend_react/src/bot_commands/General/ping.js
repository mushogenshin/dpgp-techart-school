/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "ping",
  description: "Replies 😈 with Pong",
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = ({ interaction, client, _handler }) => {
  // interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
  interaction.reply(":ping_pong: Pong!");
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true,
};
