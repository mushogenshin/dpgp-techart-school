import "dotenv/config";
import admin from "firebase-admin";
import { Client, IntentsBitField } from "discord.js";
import { CommandKit } from "commandkit";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Initialize Firebase Admin SDK
import serviceAccount from "../.keys/dpgp-techart-daulauusau.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dpgp-techart.firebaseapp.com",
});

// Example function to access Firebase DB
const getClassData = async (classId) => {
  try {
    const userRef = admin.firestore().collection("classes").doc(classId);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      console.log("Document data:", doc.data());
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
};

// Example usage
getClassData("PYTA_2024");

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
