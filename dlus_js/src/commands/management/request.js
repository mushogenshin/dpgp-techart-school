import { addTicket, getUsrNumPendingTickets } from "../../firestore/tickets";
import { getEnrollmentModuleId } from "../../firestore/enrollments";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

const MAX_PENDING_TICKETS_ALLOWED = 4;

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "register",
  description: "Báo nộp tiền học 👆",
  // NOTE: allowing all contexts: guild, DM, private channel
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
export const run = async ({ interaction, _client, _handler }) => {
  await interaction.deferReply();

  // only proceed if user has less than the maximum allowed pending tickets
  const numPendingTickets = await getUsrNumPendingTickets(interaction.user);
  if (numPendingTickets >= MAX_PENDING_TICKETS_ALLOWED) {
    await interaction.editReply({
      content: `Số lượng request của bạn đã vượt quá giới hạn (${MAX_PENDING_TICKETS_ALLOWED}). 
Vui lòng chờ xử lý các request cũ trước khi tạo request mới.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // validate email format
  const email = interaction.options.getString("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    await interaction.editReply({
      content: "Email không hợp lệ. Vui lòng nhập lại email đúng định dạng.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // validate desugared product code
  const product = interaction.options.getInteger("product");
  const moduleIds = await getEnrollmentModuleId(product);
  if (!moduleIds) {
    await interaction.editReply({
      content: `Mã số sản phẩm **${product}** không hợp lệ.
Vui lòng tham khảo lệnh \`/list\` để lấy mã số sản phẩm mong muốn.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // guards passed, proceed to create ticket
  // https://discord.js.org/docs/packages/discord.js/main/Attachment:Class
  const screenshot = interaction.options.get("screenshot");

  // add ticket to Firestore
  const ticketAddResult = await addTicket(
    interaction.user,
    interaction.channelId,
    product,
    moduleIds,
    email,
    screenshot
  );

  const msg = ticketAddResult
    ? `Đã gửi request thành công! 
## Số ticket của bạn là ${ticketAddResult}.
Chúng tôi sẽ xử lý và thông báo lại cho bạn sau. Xin cảm ơn! :pray:`
    : "Có lỗi xảy ra khi gửi request, vui lòng thử lại sau hoặc contact admin.";

  // announce result
  await interaction.editReply({
    content: msg,
    flags: MessageFlags.Ephemeral,
  });
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: false, // `false` makes this a global command
};
