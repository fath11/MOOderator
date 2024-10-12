const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('incrediexplain')
		.setDescription('Explain what the f*ck is Incredibox.'),
	async execute(interaction) {
		await interaction.reply(`Incredibox is a beatboxing-based music video game created, developed, and published by the French company So Far So Good (SFSG).

Although some Incredibox recreation on Cocrea is really good*(most notably ones made by Sepezz)*, most of them are just content farms made with little to no efforts.
Those mindless copy-pasted low quality content farms are the generic platformer of cocrea which is why we absolutely hate Incredibox projects.

Some people misunderstood our hate as hating the entire Incredibox community including the original one and the ones thats actually good but this is **NOT TRUE**.
We hate the mindless copy-pasted low quality content farms thats plaguing Cocrea.

So if you are one of the person that likes those mindless copy-pasted low quality content farms, **Fuck. Off.**
      `);
	},
};