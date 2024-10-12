const { SlashCommandBuilder } = require('discord.js');

const jokes = [
  'whats a "scratch addons?" 🤨 ',
  "ivan can you help me do mmo 🥺 ",
  "stop stealing my bump 🤬 ",
  "when is next scratch gamejam 😔 ",
  "mods someone is advertising 😱 ",
  "i love turtles 😋 ",
  "we should make the gandi mascot a turtle 😁 ",
  "can yall read the faq before randomly asking people things 😠 ",
  'whats a "custom extension" 🧐 ',
  "can you collab with me 🥹 ",
  "why is there incredibox everywhere 🤯 ",
  "i love getting ngs 🤑 ",
  "everyone on this server is nice and kind 😇 ",
  "ivan where are you???",
  "dont tell anyone about this but i secretly hate devious",
  "dont tell anyone about this but i love how devious devious is"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gandi')
    .setDescription('Gandi IDE'),
  async execute(interaction) {
    const randomRoast = jokes[Math.floor(Math.random() * jokes.length)];
    await interaction.reply(randomRoast);
  },
};
