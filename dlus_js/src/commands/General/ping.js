/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "ping",
  description: "Trả lại bằng Pong",
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export function run({ interaction, client, _handler }) {
  interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
}

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true,
  deleted: true,
};
