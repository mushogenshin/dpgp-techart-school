import {
  addTicket,
  getUsrNumPendingTickets,
  prettifyTicketData,
} from "../../firestore/tickets";
import { getEnrollmentDescFromProduct } from "../../firestore/enrollments";
import { MODERATOR_IDS } from "../../../moderator_config";

const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

const MAX_PENDING_TICKETS_ALLOWED = 4;
const MAX_FAILED_ATTEMPTS = 3;
const COOLDOWN_AMOUNT_MS = 180 * 1000; // 3 minutes

// Per-user maps
const cooldowns = new Map();
const failedAttempts = new Map();

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "register",
  description: "Báo nộp tiền học 👆",
  // NOTE: this global command allows all contexts: guild, DM, private channel
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
export const run = async ({ interaction, client, _handler }) => {
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
      content:
        ":face_with_raised_eyebrow: Email không hợp lệ. Vui lòng nhập lại email đúng định dạng.",
      flags: MessageFlags.Ephemeral,
    });

    accumulateFailedAttemps(userId);
    return;
  }

  // validate desugared product code
  const product = interaction.options.getInteger("product");
  const enrollmentDesc = await getEnrollmentDescFromProduct(product);
  if (!enrollmentDesc) {
    await interaction.editReply({
      content: `:package: Mã số sản phẩm **${product}** không hợp lệ.
Vui lòng tham khảo lệnh \`/list\` để lấy mã số sản phẩm mong muốn.`,
      flags: MessageFlags.Ephemeral,
    });

    accumulateFailedAttemps(userId);
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
    enrollmentDesc,
    email,
    screenshot
  );

  const msg = ticketAddResult
    ? `Đã gửi request thành công! 
## Số ticket của bạn là ${ticketAddResult.number}. Mod đã nhận được thông báo.
Chúng tôi sẽ xử lý và thông báo lại cho bạn sau.\n
:point_right: Trong khi chờ đợi, nếu email này chưa đăng nhập vào [website](https://school.dauphaigiaiphau.wtf) lần nào,
vui lòng đăng nhập vào website ngay bây giờ để chúng tôi có thể cấp access bài giảng sau đó.\n
Nếu đã từng đăng nhập, vui lòng chờ chúng tôi xử lý request của bạn.
Xin cảm ơn! :pray:`
    : ":cold_sweat: Có lỗi xảy ra khi gửi request, vui lòng thử lại sau hoặc contact admin.";

  // announce result to user
  await interaction.editReply({
    content: msg,
    flags: MessageFlags.Ephemeral,
  });

  // notify dev users
  const summary = prettifyTicketData(ticketAddResult);
  for (const adminUserId of MODERATOR_IDS) {
    const adminUser = await client.users.fetch(adminUserId);
    if (!adminUser) {
      console.error(`Failed to notify admin user ${adminUserId}`);
      continue;
    }
    await adminUser.send(`:warning: New ticket received:\n${summary}`);
  }
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
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: false, // `false` makes this a global command
};
