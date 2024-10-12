const { SlashCommandBuilder } = require('discord.js');

const roasts = [
  "can I adopt a penguin 🥺 ",
  "penguin sounds like a dinner <:SunXiaoDithink:1203609168540340294><:SunXiaoDithink:1203609168540340294>",
  "please don't raid us <:Pandasad:1203609153910611999> ",
  "no raiding",
  "at least let us borrow the tank. <:Mooworried:1203609143244496956>",
  "uwu",
  "roses are red, we both are blue, I was raided, and so are you.",
  "forgive us",
  "i don't know what that is <:cattle:1158055115052294275> ",
  "i love Penguin mod <:loveturtle:1156407675207299132> ",
  "turbowarp should know you are the new kid in town <:flextle:1158055134803267636>",
  "penguin mod you should join our server :troll",
  "penguin mod we should collab <:SunXiaoDisilly:1203609161733115925>",
  "we stole your joe <:Pandaevil:1203610048186556426>",
  "gandi ide is better *-this message is sponsored by turbowarp*",
  "turbowarp is simpler than you <:turtle_downvote:1156407649785630852> ",
  "are you talking about the costume editor?"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('penguin-mod')
    .setDescription('PenguinMod'),
  async execute(interaction) {
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    await interaction.reply(randomRoast);
  },
};
