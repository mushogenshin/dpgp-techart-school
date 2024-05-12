const { ApplicationCommandOptionType } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "consolidate",
  description: "Ráp Discord username với email để được phân nhóm và cấp quyền",
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
export function run({ interaction, client, handler }) {
  const email = interaction.options.get("email");
  interaction.reply(`TODO: pair ${email.value} with your Discord ID to DB`);
}

/** @type {import('commandkit').CommandOptions} */
export const options = {
  devOnly: true,
  //   userPermissions: ["Administrator", "AddReactions"],
  //   botPermissions: ["Administrator", "AddReactions"],
  //   deleted: false,
};
