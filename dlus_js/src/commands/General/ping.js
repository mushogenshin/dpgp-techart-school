import { getClassData } from "../../firebase_config";

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "ping",
  description: "Replies 😈 with Pong",
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  // interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
  // interaction.reply(":ping_pong: Pong!");

  // Example Firestore query
  const classData = await getClassData("PYTA_2024");

  // Format the class data for the reply
  const formattedClassData = classData
    ? JSON.stringify(classData, null, 2) // Pretty-print JSON with 2-space indentation
    : "No class data found";

  interaction.reply(
    `:ping_pong: Pong!\n\`\`\`json\n${formattedClassData}\n\`\`\``
  );
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true,
};
