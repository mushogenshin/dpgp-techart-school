import "dotenv/config";
// import { useCollection } from "./hooks/firestore/useCollection";

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

// const checkFirebaseConnection = async () => {
//   const { documents: allClasses } = useCollection("classes");
//   console.log(allClasses);
// };

new CommandKit({
  client,
  eventsPath: join(__dirname, "bot_events"),
  commandsPath: join(__dirname, "bot_commands"),
  devGuildIds: [
    "456441614206763019", // ext.INKt.ion studio
    // "478115306078863361", // Dẫu Phải Giải Phẫu
  ],
  devUserIds: ["454667337229139988"],
  bulkRegister: true,
});

client.login(process.env.DISCORD_TOKEN);
