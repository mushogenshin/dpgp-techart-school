import "dotenv/config";

import { Client, IntentsBitField } from "discord.js";
import { CommandKit } from "commandkit";

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

new CommandKit({
  client,
  eventsPath: join(__dirname, "bot_events"),
  commandsPath: join(__dirname, "bot_commands"),
  devGuildIds: ["456441614206763019"],
  devUserIds: ["454667337229139988"],
  bulkRegister: true,
});

client.login(process.env.DISCORD_TOKEN);
