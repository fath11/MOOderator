const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

function parseDuration(duration) {
  const match = duration.match(/^(\d+)(s|m|h)$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    default: return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout someone for whatever reason.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('duration')
        .setDescription('Duration of the timeout. s = second, m = minute, h = hour')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for the timeout')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const duration = interaction.options.getString('duration');

    // Parse the duration
    const durationMs = parseDuration(duration);
    if (durationMs === null) {
      return interaction.reply('Invalid duration format. Use s for seconds, m for minutes, or h for hours.');
    }

    const reasonEmbed = new EmbedBuilder()
      .setColor(0xfc0303)
      .setTitle('Reason:')
      .setDescription(reason)

    const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Timeout')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(cancel, confirm);

		const response = await interaction.reply({
			content: `Are you sure you want to timeout **${user}** for **${duration}**?`,
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
        await member.timeout(durationMs, reason);
        await user.send({
          content: `You have been timed out for **${duration}**`,
          embeds: [reasonEmbed]
        });

        await confirmation.update({ content: `User **${user.tag}** has been timed out for **${duration}**`, components: [], embed: [reasonEmbed] });
      } else if (confirmation.customId === 'cancel') {
        await confirmation.update({ content: 'Timeout cancelled', components: [], embed: [] });
      }

    } catch (error) {
      await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [], embed: []});
    }
  },
};
