import "dotenv/config";
import { Client, IntentsBitField } from "discord.js";
import { CommandKit } from "commandkit";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MODERATOR_IDS } from "../moderator_config";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const __dirname = dirname(fileURLToPath(import.meta.url));

new CommandKit({
  client,
  eventsPath: join(__dirname, "events"),
  commandsPath: join(__dirname, "commands"),
  devGuildIds: [
    "456441614206763019", // ext.INKt.ion studio
    "478115306078863361", // Dẫu Phải Giải Phẫu
    "478043322456211457", // Dẫu Phải Rigging
  ],
  devUserIds: MODERATOR_IDS,
  bulkRegister: true,
});

client.login(process.env.DISCORD_TOKEN);
