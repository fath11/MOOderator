const { Events, messageLink, EmbedBuilder } = require('discord.js');
const { getSettings } = require('../utils');

async function removeUserReaction(message, userId) {
  const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(userId));
  try {
    for (const reaction of userReactions.values()) {
      await reaction.users.remove(userId);
    }
  } catch (error) {
    console.error('Failed to remove reactions.');
  }
}

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }

		const message = reaction.message;
    if (reaction.emoji.name !== "🐢") return;
    if (message.author.id === user.id) return removeUserReaction(message, message.author.id);
    if (message.author.bot) return;

    const settings = getSettings();
    const turtleBoardChannel = settings.turtleBoardChannelId
    const turtleChannel = message.guild.channels.cache.get(turtleBoardChannel)
    if (!turtleChannel) return message.channel.send(`It appears that you do not have a \`${turtleBoardChannel}\` channel.`); 

    const fetchedMessages = await turtleChannel.messages.fetch({ limit: 50 });
    const turtles = fetchedMessages.find(m => m.content.startsWith("🐢") && m.content.includes(message.id));

    if (turtles && reaction.count > 7) {
      const turtle = /^\🐢\s([0-9]{1,3})\s\-\s(https:\/\/discord\.com\/channels\/@me\/)([0-9]{17,20})\/([0-9]{17,20})/.exec(turtles.content);

      const turtMsg = await turtleChannel.messages.fetch(turtles.id);
      let attachments = []
      message.attachments.forEach((value, key) => {
          attachments.push(value)
      });

      const foundEmbed = turtles.embeds[0];
      const embed = new EmbedBuilder()
        .setColor(foundEmbed.color)
        .setDescription(foundEmbed.description)
        .setFooter({
          text: `by ${message.author.tag} at ${message.createdAt.toLocaleString()}`,
          iconURL: message.author.displayAvatarURL()
        })

      await turtMsg.edit({
        content:  `🐢 ${reaction.count} - ${messageLink(message.channel.id, message.id)}}`,
        attachments: attachments,
        embeds: [embed]
      });
    }
    if (!turtles && reaction.count >= 7) {
      let attachments = []
      message.attachments.forEach((value, key) => {
          attachments.push(value)
      });

      const embed = new EmbedBuilder()
        .setColor(parseInt("0x" + Math.floor(Math.random()*16777215).toString(16), 16))
        .setDescription(message.content)
        .setFooter({
          text: `by ${message.author.tag} at ${message.createdAt.toLocaleString()}`,
          iconURL: message.author.displayAvatarURL()
        })

      await turtleChannel.send({
        content:  `🐢 ${reaction.count} - ${messageLink(message.channel.id, message.id)}`,
        attachments: attachments,
        embeds: [embed]
      });
    }
	},
};