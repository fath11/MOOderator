const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban someone for whatever reason.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for the ban')
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
			.setLabel('Confirm Ban')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(cancel, confirm);

		const response = await interaction.reply({
			content: `Are you sure you want to ban **${user}**?`,
			components: [row],
      embeds: [reasonEmbed]
		});

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

      const member = await interaction.guild.members.fetch(user.id);
      if (!member) {
        return interaction.reply('User not found in this guild.');
      }

      if (confirmation.customId === 'confirm') {
        await user.send({
          content: `You have been banned from **${interaction.guild.name}**`,
          embeds: [reasonEmbed]
        });

        await interaction.guild.members.ban(member, { reason });

        await confirmation.update({ content: `User **${user.tag}** has been banned`, components: [], embeds: [reasonEmbed] });
      } else if (confirmation.customId === 'cancel') {
        await confirmation.update({ content: 'Ban cancelled', components: [], embeds: [] });
      }

    } catch (error) {
      console.error('Failed to ban the user:', error);
      await interaction.editReply({ content: 'Confirmation not received, cancelling', components: [], embeds: []});
    }
  },
};
