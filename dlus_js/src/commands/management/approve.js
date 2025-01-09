import {
  getTicketByNumber,
  markTicketAsResolved,
} from "../../firestore/tickets";
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

  // fetch beneficiary user data by email
  let beneficiaryUser = await findExistingUserByEmail(ticket.beneficiary_email);

  if (!beneficiaryUser) {
    // try migrating first
    try {
      await migrateUserEnrollments(ticket.beneficiary_email);
    } catch (error) {
      await interaction.editReply({
        content: `😱 Xảy ra lỗi khi tạo hồ sơ cho user \`${ticket.beneficiary_email}\`:
**${error.message}**
Rất có thể user chưa đăng nhập lần nào`,
        flags: MessageFlags.Ephemeral,
      });
      return; // we can't proceed without beneficiary user data
    } finally {
      // try fetching beneficiary user data again
      try {
        beneficiaryUser = await findExistingUserByEmail(
          ticket.beneficiary_email
        );
      } catch (error) {
        // this should never happen, but just in case
        await interaction.editReply({
          content: `😱 Xảy ra lỗi khi tìm user \`${ticket.beneficiary_email}\`:
    **${error.message}**`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }
  }

  // add enrollments to beneficiary user
  try {
    await addEnrollments(beneficiaryUser.id, ticket.requested_enrollments); // TODO: allow correction
  } catch (error) {
    await interaction.editReply({
      content: `😱 Xảy ra lỗi khi cấp access \`${ticket.requested_enrollments}\` cho user \`${ticket.beneficiary_email}\`:
**${error.message}**`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  } finally {
    await interaction.editReply({
      content: `🔥 Đã cấp quyền vào \`${ticket.requested_enrollments}\` xong cho \`${ticket.beneficiary_email}\``,
      flags: MessageFlags.Ephemeral,
    });

    // mark ticket as resolved
    const markResult = await markTicketAsResolved(ticketNumber);

    if (!markResult) {
      await interaction.followUp({
        content: `😱 Xảy ra lỗi khi đóng ticket số ${ticketNumber}.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // send confirmation message
    const channel = await client.channels.fetch(ticket.discord_channel_id);
    if (channel) {
      await channel.send(`🎉 Ticket số ${ticketNumber} cho sản phẩm ${ticket.requested_product} của bạn đã được duyệt!
Bạn đã được cấp access để xem nội dung \`${ticket.requested_enrollments}\` 🎉`);
    } else {
      console.error(
        `Failed to send confirmation message of ticket ${ticketNumber} to channel ${ticket.discord_channel_id}`
      );
    }
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
