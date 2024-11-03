const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const fs = require('node:fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete X messages above. (max 100)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Amount of messages to purge.')
        .setMaxValue(100)
        .setMinValue(2)
        .setRequired(true)),

  execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    
    const logChannelId = JSON.parse(fs.readFileSync('./config.json', 'utf8')).logChannelId;
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    if (!logChannel) {
        interaction.reply("Log channel not set. Use `/logchannel channel:your-server's-log-channel` and set one.");
        return;
    }

    interaction.channel.bulkDelete(amount).then(() => {
      interaction.reply({ content: `Purged ${amount} messages!`, ephemeral: true })
      logChannel.send(`<@${interaction.user.id}> purged ${amount} messages!`)
      interaction.channel.send(`https://tenor.com/view/mib-flash-forget-will-smith-gif-13783743`)
    })
  },
};
