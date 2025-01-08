import { sendVerificationEmail, verifyCode } from "../../firestore/send_mail";
const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "pair",
  description: "Ráp tên Discord với tài khoản học",
  // NOTE: this global command allows all contexts: guild, DM, private channel
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
  await interaction.deferReply();

  // validate email format
  const email = interaction.options.getString("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    await interaction.editReply({
      content: "🤨 Email không hợp lệ. Vui lòng nhập lại email đúng định dạng.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await sendVerificationEmail(email);
  await interaction.editReply(
    `📧 Mã xác thực đã được gửi đến ${email}, hãy xem email và nhập vào đây:`
  );

  const msg_filter = (m) =>
    m.author.id === interaction.user.id && /^\d{6}$/.test(m.content.trim());
  interaction.channel
    .awaitMessages({
      filter: msg_filter,
      max: 1,
      time: 120000, // 2 minutes
      errors: ["time"],
    })
    .then((collected) => {
      const inputCode = collected.first().content;
      verifyCode(email, inputCode)
        .then((verifyResult) => {
          if (verifyResult) {
            interaction.followUp(
              "🔥 Đã link thành công tên Discord của bạn với tài khoản học!"
            );
          } else {
            interaction.followUp(
              "😰 Mã xác thực không đúng. Vui lòng thử lại."
            );
          }
        })
        .catch((error) => {
          console.error(error);
          interaction.followUp(
            "Đã xảy ra lỗi khi xác thực. Vui lòng thử lại sau."
          );
        });
    })
    .catch(() => {
      interaction.reply("Không nhận được mã xác thực, hãy thử lại sau");
    });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  devOnly: false, // `false` makes this a global command
};
