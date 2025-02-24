import { queryApprovedTickets } from "../../firestore/tickets";
import { getEnrollmentDescFromProduct } from "../../firestore/enrollments";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "announce",
  description: "Gửi tin nhắn hàng loạt 🗣️",
  // NOTE: this non-global command is not available in DM
  options: [
    {
      name: "product",
      description: "Mã sản phẩm của những bạn đã đăng ký",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "message",
      description: "Nội dung tin nhắn",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "attachment",
      description: "File đính kèm",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, client, _handler }) => {
  await interaction.deferReply();

  const productCode = interaction.options.getInteger("product");
  const enrollmentDesc = await getEnrollmentDescFromProduct(productCode);

  if (!enrollmentDesc) {
    return interaction.editReply({
      content: `:woman_getting_face_massage: Không tìm thấy sản phẩm có mã \`${productCode}\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  // fetch all approved tickets
  const approvedTickets = await queryApprovedTickets(productCode);

  if (approvedTickets.length === 0) {
    return interaction.editReply({
      content: `Không có đăng ký nào được duyệt cho sản phẩm \`${productCode}\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  const msg = interaction.options.get("message");
  const media = interaction.options.get("attachment");

  const failedChannels = [];

  // send announcement to each approved ticket
  for (const ticket of approvedTickets) {
    try {
      const channel = await client.channels.fetch(ticket.discord_channel_id);
      if (channel) {
        await channel.send({
          content: msg.value,
          files: media ? [media.attachment] : [],
        });
        await interaction.followUp({
          content: `- \`${ticket.author_display_name}\` (ticket ${ticket.number}) đã nhận được tin`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        failedChannels.push([ticket.number, ticket.author_display_name]);
      }
    } catch (error) {
      console.error(
        `Failed to send message to ${ticket.author_display_name} of ticket ${ticket.number}:`,
        error
      );
      failedChannels.push([ticket.number, ticket.author_display_name]);
    }
  }

  const success = approvedTickets.length - failedChannels.length;
  var replyMsg =
    success > 0
      ? `Đã gửi tin nhắn đến ${success} người`
      : `Không gửi được tin nhắn nào`;

  if (failedChannels.length > 0) {
    replyMsg += `\n\n:face_with_spiral_eyes: Gặp lỗi khi gửi tin cho:\n${failedChannels
      .map(([number, name]) => `- ${name} (ticket ${number})`)
      .join("\n")}`;
  }

  await interaction.followUp({
    content: replyMsg,
    flags: MessageFlags.Ephemeral,
  });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
