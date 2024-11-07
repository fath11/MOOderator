const { Events, messageLink, EmbedBuilder } = require('discord.js');
const { getSettings } = require('../utils');

module.exports = {
	name: Events.MessageReactionRemove,
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
    if (message.author.id === user.id) return;

    const settings = getSettings();
    const turtleBoardChannel = settings.turtleBoardChannelId
    const turtleChannel = message.guild.channels.cache.get(turtleBoardChannel)
    if (!turtleChannel) return message.channel.send(`It appears that you do not have a \`${turtleBoardChannel}\` channel.`); 

    const fetchedMessages = await turtleChannel.messages.fetch({ limit: 50 });
    const turtles = fetchedMessages.find(m => m.content.startsWith("🐢") && m.content.includes(message.id));

    if (turtles) {
      const turtle = /^\🐢\s([0-9]{1,3})\s\-\s(https:\/\/discord\.com\/channels\/@me\/)([0-9]{17,20})\/([0-9]{17,20})/.exec(turtles.content);

      const turtMsg = await turtleChannel.messages.fetch(turtles.id);
      if(reaction.count < 7) {
        turtMsg.delete()
      }

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
	},
};