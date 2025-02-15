import {
  findExistingUserByEmail,
  updateDiscordInfo,
} from "../../firestore/enrollments";
import {
  sendVerificationEmail,
  verifyCode,
} from "../../firestore/mail_verification";
import { MODERATOR_IDS } from "../../../moderator_config";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

const MAX_FAILED_ATTEMPTS = 3;
const COOLDOWN_AMOUNT_MS = 180 * 1000; // 3 minutes

// Per-user maps
const cooldowns = new Map();
const failedAttempts = new Map();

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
  const userId = interaction.user.id;

  // Check if user is on cooldown
  if (!MODERATOR_IDS.includes(userId)) {
    const now = Date.now();

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + COOLDOWN_AMOUNT_MS;

      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000);
        return interaction.editReply({
          content: `:hourglass_flowing_sand: Woah woah, ${timeLeft} seconds cooldown remaining before you can use this command again.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      // DO NOT set cooldown uncontionally here
    }
  }

  // validate email format
  const email = interaction.options.getString("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    await interaction.editReply({
      content:
        ":face_with_raised_eyebrow: Email không hợp lệ. Vui lòng nhập lại email đúng định dạng.",
      flags: MessageFlags.Ephemeral,
    });

    accumulateFailedAttemps(userId);
    return;
  }

  await sendVerificationEmail(email);
  const obscuredEmail =
    email[0] + email.slice(1, -1).replace(/./g, "*") + email.slice(-1);
  await interaction.editReply(
    `📧 Mã xác thực đã được gửi đến \`${obscuredEmail}\`, hãy xem thùng thư và nhập mã vào bên dưới:`
  );

  const msg_filter = (m) =>
    m.author.id === userId && /^\d{6}$/.test(m.content.trim());
  // for DMs, interaction.channel is null, so we need to create a DM channel
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
        .then((verified) => {
          if (verified) {
            interaction.followUp(`Cảm ơn. Mã bạn vừa đưa là đúng :pray:`);

            // lookup user by email
            findExistingUserByEmail(email).then((user) => {
              if (!user) {
                interaction.followUp({
                  content: `Không tìm thấy user với email \`${email}\` :cry:.
Có thể email này chưa đăng nhập vào [website](https://school.dauphaigiaiphau.wtf) lần nào.
Vui lòng đăng nhập vào website trước khi thử lại.`,
                  flags: MessageFlags.Ephemeral,
                });
                accumulateFailedAttemps(userId);
                return;
              }

              // link Discord account with user account
              updateDiscordInfo(user.id, interaction.user)
                .then(() => {
                  interaction.followUp(
                    "🎯 Đã link thành công tên Discord của bạn với tài khoản học!"
                  );
                })
                .catch((error) => {
                  console.error(
                    `Error updating Discord info for user ${email}:`,
                    error
                  );
                  interaction.followUp(
                    ":cold_sweat: Đã xảy ra lỗi khi link tài khoản. Vui lòng thử lại sau."
                  );
                  accumulateFailedAttemps(userId);
                  return;
                });
            });
          } else {
            // the operation completed successfully but it returned false for any reason
            accumulateFailedAttemps(userId);
            interaction.followUp(
              ":cold_sweat: Xác thực không thành công. Vui lòng thử lại."
            );
          }
        })
        .catch((error) => {
          console.error(`Error verifying code for user ${email}:`, error);
          accumulateFailedAttemps(userId);
          interaction.followUp(
            ":face_with_raised_eyebrow: Đã xảy ra lỗi khi xác thực: mã sai hoặc hết hạn. Vui lòng thử lại từ đầu."
          );
        });
    })
    .catch(() => {
      interaction.reply("Không nhận được mã xác thực, hãy thử lại sau");
    });
};

const accumulateFailedAttemps = (userId) => {
  const attempts = failedAttempts.get(userId) || 0;
  failedAttempts.set(userId, attempts + 1);

  if (attempts + 1 >= MAX_FAILED_ATTEMPTS) {
    cooldowns.set(userId, Date.now());
    setTimeout(() => cooldowns.delete(userId), COOLDOWN_AMOUNT_MS);
    failedAttempts.delete(userId); // reset failed attempts as cooldown is enforced
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  devOnly: false, // `false` makes this a global command
  deleted: true,
};
