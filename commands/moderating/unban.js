const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban someone for whatever reason.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to unban')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for the unban')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    const reasonEmbed = new EmbedBuilder()
      .setColor(0xfc0303)
      .setTitle('Reason:')
      .setDescription(reason)

    const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Unban')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(cancel, confirm);

		const response = await interaction.reply({
			content: `Are you sure you want to unban **${user}**?`,
			components: [row],
      embeds: [reasonEmbed]
		});

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

      if (confirmation.customId === 'confirm') {
        await interaction.guild.members.unban(user.id);

        await confirmation.update({ content: `User **${user.tag}** has been unbanned`, components: [], embeds: [reasonEmbed] });
      } else if (confirmation.customId === 'cancel') {
        await confirmation.update({ content: 'unban cancelled', components: [], embeds: [] });
      }

    } catch (error) {
      console.error('Failed to unban the user:', error);
      await interaction.editReply({ content: 'Confirmation not received, cancelling', components: [], embeds: []});
    }
  },
};
