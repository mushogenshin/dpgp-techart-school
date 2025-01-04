// import { getClassData } from "../../firebase_config";

const {
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "register",
  description: "Báo nộp tiền học",
  options: [
    // {
    //   name: "email",
    //   description: "Email dùng để access khoá học",
    //   type: ApplicationCommandOptionType.String,
    //   required: true,
    // },
    // {
    //   name: "product",
    //   description: "Mã số sản phẩm",
    //   type: ApplicationCommandOptionType.Integer,
    //   required: true,
    // },
    {
      name: "screenshot",
      description: "Screenshot giao dịch",
      type: ApplicationCommandOptionType.Attachment,
      required: true,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  // const email = interaction.options.get("email");
  // const product = interaction.options.get("product");
  const screenshot = interaction.options.get("screenshot");

  const formattedScreenshot = screenshot
    ? JSON.stringify(screenshot, null, 2) // Pretty-print JSON with 2-space indentation
    : "No screenshot data found";

  // // Create an attachment from the provided screenshot
  // const attachment = new AttachmentBuilder(screenshot.url, {
  //   name: screenshot.name,
  // });

  // interaction.reply(
  //   `TODO: create ticket for ${email.value} with product ${product.value} and screenshot ${screenshot.value}`
  // );
  // Send a message with the attachment
  await interaction.reply({
    // content: `Email: ${email}\nProduct: ${product}`,
    content: `Screenshot: ${formattedScreenshot}`,
    // files: [attachment],
  });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true,
};
