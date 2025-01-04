// import { getClassData } from "../../firebase_config";

const { ApplicationCommandOptionType } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "register",
  description: "Báo nộp tiền học",
  options: [
    {
      name: "screenshot",
      description: "Screenshot giao dịch",
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
    {
      name: "email",
      description: "Email dùng để access khoá học",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "product",
      description: "Mã số sản phẩm",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  const email = interaction.options.get("email");
  const product = interaction.options.get("product");

  // https://discord.js.org/docs/packages/discord.js/main/Attachment:Class
  const screenshot = interaction.options.get("screenshot");

  // Send back a message with the same attachment
  await interaction.reply({
    content: `TODO: create ticket for email: ${email.value}\nProduct: ${product.value}`,
    files: [screenshot.attachment],
  });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true,
};
