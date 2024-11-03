const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

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

    if (amount > 100) interaction.reply('Cannot purge more than 100 messages')
    if (amount < 2) interaction.reply('You must purge at least 2 messages')

    interaction.channel.bulkDelete(amount).then(() => {
      interaction.reply(`Purged ${amount} messages!`)
      interaction.channel.send(`https://tenor.com/view/mib-flash-forget-will-smith-gif-13783743`)
    })
  },
};
