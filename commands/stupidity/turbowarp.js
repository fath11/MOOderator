const { SlashCommandBuilder } = require('discord.js');

const jokes = [
  "i am having a flashback...",
  "dango is delicious 😋 ",
  "shoveling up a dango I buried <:turtle_upvote:1153598913232781343> ",
  "dont krill us",
  "garbomuffin? Is that a food 🤨 ",
  "turbowarp you should join our server :troll",
  "we love writing essays",
  "turbowarp we should collab <:SunXiaoDisilly:1203609161733115925> ",
  "Roses are red, and so are you, but i am blue, and you should be too",
  "is that scratch 3.5 <:SunXiaoDithink:1203609168540340294>",
  "penguin mod should know you are the new kid in town <:cooltle:1159364254714040330>",
  "gandi ide is better *-this message is sponsered by penguin mod*",
  "i like turbowarp <:turtle:1153873922975080479> ",
  "these commands are like the cringiest, please stop"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('turbowarp')
    .setDescription('Turbowap'),
  async execute(interaction) {
    const randomRoast = jokes[Math.floor(Math.random() * jokes.length)];
    await interaction.reply(randomRoast);
  },
};
