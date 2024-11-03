const { Message } = require('discord.js');
const { Events, AuditLogEvent, EmbedBuilder, messageLink } = require('discord.js');
const fs = require('node:fs');

const MAX_MESSAGE_LENGTH = 1950; // Maximum length for each message part

function truncateMessage(message) {
    if (message.length > MAX_MESSAGE_LENGTH) {
        return message.slice(0, MAX_MESSAGE_LENGTH - 3) + '...';
    }
    return message;
}

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
      if(oldMessage.author.bot) return;
      if(oldMessage.content === newMessage.content) return;
      

      const logChannelId = JSON.parse(fs.readFileSync('./config.json', 'utf8')).logChannelId;
      const logChannel = newMessage.guild.channels.cache.get(logChannelId);
      if (!logChannel) {
          newMessage.reply("Log channel not set. Use `/logchannel channel:your-server's-log-channel` and set one.");
          return;
      }

      const oldMessageEmbed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle('Before edit:')
        .setDescription(truncateMessage(oldMessage.content))
      
      const newMessageEmbed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle('After edit:')
        .setDescription(truncateMessage(newMessage.content))
      
      logChannel.send({
          content: `A message by <@${newMessage.author.id}> was edited at ${messageLink(newMessage.channel.id, newMessage.id)}`,
          embeds: [oldMessageEmbed, newMessageEmbed],
      });
    }
}
