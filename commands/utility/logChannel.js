const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const configPath = './config.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logchannel')
		.setDescription('Change/View where the bot will send logs.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addChannelOption(option => 
			option.setName('channel')
				.setDescription('Channel to set')),

	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

		if (channel) {
			config.logChannelId = channel.id;

			fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8', (err) => {
				if (err) {
					console.error('Error writing to config file:', err);
					return;
				}
				console.log('Log channel ID updated successfully!', config.logChannelId);
			});

			await interaction.reply(`<#${channel.id}> is now the new log channel!`);
		} else {
			await interaction.reply(`<#${config.logChannelId}> is set as the log channel`);
		}
	},
};
