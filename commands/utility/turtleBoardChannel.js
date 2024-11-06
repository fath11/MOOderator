const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const configPath = './config.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('turtleboardchannel')
		.setDescription('Change/View which channel is for TurtleBoard.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addChannelOption(option => 
			option.setName('channel')
				.setDescription('Channel to set')),

	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

		if (channel) {
			config.turtleBoardChannelId = channel.id;

			fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8', (err) => {
				if (err) {
					console.error('Error writing to config file:', err);
					return;
				}
				console.log('TurtleBoard channel ID updated successfully!', config.turtleBoardChannelId);
			});

			await interaction.reply(`<#${channel.id}> is now the new TurtleBoard channel!`);
		} else {
			await interaction.reply(`<#${config.turtleBoardChannelId}> is set as the TurtleBoard channel.`);
		}
	},
};
