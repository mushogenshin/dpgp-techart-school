// import { getClassData } from "../../firebase_config";

const { ApplicationCommandOptionType } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "link",
  description: "Ráp tên Discord với tài khoản học",
  options: [
    {
      name: "email",
      description: "Email dùng khi đăng ký khoá học",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  const email = interaction.options.get("email");

  // // Example Firestore query
  // const classData = await getClassData("PYTA_2024");

  // // Format the class data for the reply
  // const formattedClassData = classData
  //   ? JSON.stringify(classData, null, 2) // Pretty-print JSON with 2-space indentation
  //   : "No class data found";

  // interaction.reply(
  //   `:ping_pong: Pong!\n\`\`\`json\n${formattedClassData}\n\`\`\``
  // );

  interaction.reply(`TODO: pair ${email.value} with your Discord ID to DB`);
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  devOnly: true,
  //   userPermissions: ["Administrator", "AddReactions"],
  //   botPermissions: ["Administrator", "AddReactions"],
  deleted: true,
};
