import { getTicketByNumber } from "../../firestore/tickets";
import {
  findExistingUserByEmail,
  migrateUserEnrollments,
  addEnrollments,
} from "../../firestore/enrollments";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "approve",
  description: "Duyệt ticket ✅",
  // NOTE: this non-global command is not available in DM
  options: [
    {
      name: "ticket",
      description: "Number của ticket muốn approve",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    // {
    //   name: "correction",
    //   description: "Mã module cần override",
    //   type: ApplicationCommandOptionType.String,
    //   required: false,
    // },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  await interaction.deferReply();

  const ticketNumber = interaction.options.getInteger("ticket");
  // const correction = interaction.options.getString("correction");

  // fetch the requested ticket data
  const ticket = await getTicketByNumber(ticketNumber);

  if (!ticket) {
    await interaction.editReply({
      content: `Không tìm thấy ticket số ${ticketNumber} 🤨.
Thử dùng lệnh \`/tickets\` để xem những đơn đang chờ xử lý.`,
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  // fetch user data by email
  let user;
  user = await findExistingUserByEmail(ticket.email);

  if (!user) {
    // try migrating first
    try {
      await migrateUserEnrollments(ticket.email);
    } catch (error) {
      await interaction.editReply({
        content: `😱 Xảy ra lỗi khi tạo hồ sơ cho user \`${ticket.email}\`:
**${error.message}**
Rất có thể user chưa đăng nhập lần nào`,
        flags: MessageFlags.Ephemeral,
      });
      return; // we can't proceed without user data
    } finally {
      // try fetching user data again
      user = await findExistingUserByEmail(ticket.email);
    }
  }

  // this should never happen, but just in case
  if (!user) {
    await interaction.editReply({
      content: `Không tìm thấy user với email \`${ticket.email}\` 😢.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  // console.log(`Tìm thấy user: ${JSON.stringify(user, null, 2)}`);

  try {
    await addEnrollments(user.id, ticket.requested_enrollments); // TODO: allow correction
  } catch (error) {
    await interaction.editReply({
      content: `😱 Xảy ra lỗi khi cấp access \`${ticket.requested_enrollments}\` cho user \`${ticket.email}\`:
**${error.message}**`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  } finally {
    await interaction.editReply({
      content: `SUCCESS! 🔥`,
      flags: MessageFlags.Ephemeral,
    });
  }

  // TODO: mark ticket as resolved
  // TODO: send confirmation message

  // duchct0701@gmail.com
  // 1QUjcPnEE3eWDzZLpz1xTPEROh73
  await interaction.followUp({
    content: `TODO: mark ticket ${ticketNumber} as resolved`,
    flags: MessageFlags.Ephemeral,
  });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
