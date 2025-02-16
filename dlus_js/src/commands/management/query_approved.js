import {
  queryApprovedTickets,
  prettifyTicketData,
} from "../../firestore/tickets";
import { getEnrollmentDescFromProduct } from "../../firestore/enrollments";

import { parse } from "json2csv";
// import { writeFileSync } from "node:fs";

const {
  ApplicationCommandOptionType,
  MessageFlags,
  AttachmentBuilder,
} = require("discord.js");

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "query",
  description: "Xem các đăng ký đã được duyệt 📋",
  // NOTE: this non-global command is not available in DM
  options: [
    {
      name: "product",
      description: "Mã sản phẩm cần xem",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "details",
      description: "Liệt kê lại từng ticket",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  await interaction.deferReply();

  // fetch all approved tickets
  const productCode = interaction.options.getInteger("product");
  const enrollmentDesc = await getEnrollmentDescFromProduct(productCode);

  if (!enrollmentDesc) {
    return interaction.editReply({
      content: `:woman_getting_face_massage: Không tìm thấy sản phẩm có mã \`${productCode}\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  const approvedTickets = await queryApprovedTickets(productCode);

  if (approvedTickets.length === 0) {
    return interaction.editReply({
      content: `Không có đăng ký nào được duyệt cho sản phẩm \`${productCode}\``,
      flags: MessageFlags.Ephemeral,
    });
  }

  var msg = `Có ${approvedTickets.length} đăng ký đã được duyệt cho sản phẩm \`${productCode}\``;

  msg += enrollmentDesc.max_allowed
    ? `, còn ${enrollmentDesc.max_allowed - approvedTickets.length} slot trống`
    : ` (không giới hạn số lượng)`;

  await interaction.editReply({
    content: msg,
    flags: MessageFlags.Ephemeral,
  });

  const csvData = approvedTickets.map((ticket) => ({
    ticket_number: ticket.number,
    discord_user: ticket.author_display_name,
    email: ticket.beneficiary_email,
    created_at: ticket.created_at_local,
  }));

  console.log(csvData);

  const fields = ["ticket_number", "discord_user", "email", "created_at"];
  const opts = { fields };

  try {
    const csv = parse(csvData, opts);

    const timestamp = new Date().toISOString().replace(/[/:]/g, "-");
    const attachment = new AttachmentBuilder(Buffer.from(csv), {
      name: `product-${productCode}_approved-tickets_${timestamp}.csv`,
    });
    // writeFileSync(
    //   `product-${productCode}_approved-tickets_${timestamp}.csv`,
    //   csv
    // );

    await interaction.followUp({
      content: "Đây là file CSV tổng hợp:",
      files: [attachment],
      flags: MessageFlags.Ephemeral,
    });
  } catch (err) {
    console.error(err);
    await interaction.followUp({
      content: ":cold_sweat: Có lỗi khi tạo file CSV",
      flags: MessageFlags.Ephemeral,
    });
  }

  const verbose = interaction.options.getBoolean("details") ?? false;

  if (verbose) {
    for (let i = 0; i < approvedTickets.length; i++) {
      const ticket = approvedTickets[i];
      const prettyTicket = prettifyTicketData(ticket, "(--Đã approved--) ");
      await interaction.followUp({
        content: `[${i + 1}/${approvedTickets.length}] ${prettyTicket}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: true, // we don't want this command to be available to the public
};
