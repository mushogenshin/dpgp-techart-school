import { getTicketByNumber, flagTicketAsSpam } from "../../firestore/tickets";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "flag",
  description: "Đánh dấu spam ☢️",
  // NOTE: this non-global command is not available in DM
  options: [
    {
      name: "ticket",
      description: "Number của ticket cần flag",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  await interaction.deferReply();

  const ticketNumber = interaction.options.getInteger("ticket");

  // fetch the requested ticket data
  const ticket = await getTicketByNumber(ticketNumber);

  if (!ticket) {
    return interaction.editReply({
      content: `Không tìm thấy ticket số ${ticketNumber} :face_with_raised_eyebrow:.
Thử dùng lệnh \`/tickets\` để xem những đơn đang chờ xử lý.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  // flag ticket as spam
  const flagResult = await flagTicketAsSpam(ticketNumber);

  if (!flagResult) {
    return interaction.followUp({
      content: `:scream: Xảy ra lỗi khi flag ticket số ${ticketNumber}.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  interaction.editReply({
    content: `:bug: Đã flag xong đơn \`${ticketNumber}\` cho sự kiện \`${ticket.requested_product}\``,
    flags: MessageFlags.Ephemeral,
  });

  // send confirmation message
  const channel = await client.channels.fetch(ticket.discord_channel_id);
  if (channel) {
    var msg = ticket.is_one_time
      ? `::face_with_spiral_eyes:: Ghi danh cho hoạt động ${ticket.requested_product} của bạn bị cho là spam!`
      : `::face_with_spiral_eyes:: Ticket số ${ticketNumber} cho sản phẩm ${ticket.requested_product} của bạn bị cho là spam!`;

    msg += `\n Cẩn thận trước khi bị ban!`;

    await channel.send(msg);
  } else {
    console.error(
      `Failed to send confirmation message of ticket ${ticketNumber} to channel ${ticket.discord_channel_id}`
    );
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
