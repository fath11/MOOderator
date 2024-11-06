const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const { getLogChannel } = require('../../utils')

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
    
    const logChannel = getLogChannel(interaction)

    interaction.channel.bulkDelete(amount).then(() => {
      interaction.reply({ content: `Purged ${amount} messages!`, ephemeral: true })
      logChannel.send(`<@${interaction.user.id}> purged ${amount} messages!`)
      interaction.channel.send(`https://tenor.com/view/mib-flash-forget-will-smith-gif-13783743`)
    })
  },
};
