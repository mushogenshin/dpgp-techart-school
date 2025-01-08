import { sendVerificationEmail, verifyCode } from "../../firestore/send_mail";
import {
  findExistingUserByEmail,
  updateDiscordInfo,
} from "../../firestore/enrollments";

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
    `📧 Mã xác thực đã được gửi đến \`${email}\`, hãy xem email và nhập mã vào bên dưới:`
  );

  const msg_filter = (m) =>
    m.author.id === interaction.user.id && /^\d{6}$/.test(m.content.trim());
  // interaction.channel is null for DMs
  const channel = interaction.channel || (await interaction.user.createDM());
  channel
    .awaitMessages({
      filter: msg_filter,
      max: 1,
      time: 120000, // 2 minutes
      errors: ["time"],
    })
    .then((collected) => {
      const verificationCode = collected.first().content;
      verifyCode(email, verificationCode)
        .then(async (verified) => {
          if (verified) {
            await interaction.followUp(`Cảm ơn. Mã bạn vừa đưa là đúng 🙏`);

            // lookup user by email
            const user = await findExistingUserByEmail(email);
            if (!user) {
              await interaction.followUp({
                content: `Không tìm thấy user với email \`${email}\` 😢.
      Có thể email này chưa đăng nhập vào [website](https://school.dauphaigiaiphau.wtf) lần nào`,
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            // link Discord account with user account
            try {
              await updateDiscordInfo(
                user.id,
                interaction.user.id,
                interaction.user.username
              );
              await interaction.followUp(
                "🎯 Đã link thành công tên Discord của bạn với tài khoản học!"
              );
            } catch (error) {
              console.error(
                `Error updating Discord info for user ${email}:`,
                error
              );
              await interaction.followUp(
                "😰 Đã xảy ra lỗi khi link tài khoản. Vui lòng thử lại sau."
              );
            }
          } else {
            await interaction.followUp(
              "😰 Mã xác thực không đúng. Vui lòng thử lại."
            );
          }
        })
        .catch(async (error) => {
          console.error(error);
          await interaction.followUp(
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
