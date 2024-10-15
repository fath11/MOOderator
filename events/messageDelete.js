const { Events, AuditLogEvent, EmbedBuilder, messageLink } = require('discord.js');
const fs = require('node:fs');

const MAX_MESSAGE_LENGTH = 50; // Maximum length for each message part
const MAX_MESSAGES = 5; // Maximum number of messages to include above and below

function truncateMessage(message) {
    if (message.length > MAX_MESSAGE_LENGTH) {
        return message.slice(0, MAX_MESSAGE_LENGTH - 3) + '...';
    }
    return message;
}

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.partial) {
            try {
                await message.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        const logChannelId = JSON.parse(fs.readFileSync('./config.json', 'utf8')).logChannelId;
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (!logChannel) {
            message.reply("Log channel not set. Use `/logchannel channel:your-server's-log-channel` and set one.");
            return;
        }

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete,
        });

        const deletionLog = fetchedLogs.entries.first();

        let replyEmbed = undefined
        if (message.reference) {
            const replyMessage = await message.channel.messages.fetch(message.reference.messageId);
            const replyMessageContent = replyMessage ? replyMessage.content : 'Reply message not found';

            replyEmbed = new EmbedBuilder()
            .setColor(0x696969)
            .setTitle('Replying to')
            .setDescription(replyMessageContent)
            .setFooter({
                text: `by ${replyMessage.author.tag} at ${replyMessage.createdAt.toLocaleString()}`,
                iconURL: replyMessage.author.displayAvatarURL()
            })
            .setURL(messageLink(replyMessage.channel.id, replyMessage.id));
        }

        // Fetch messages around the deleted message
        const messagesBefore = await message.channel.messages.fetch({ limit: 5, before: message.id });
        const messagesBeforeArray = Array.from(messagesBefore.values());

        const messagesAfter = await message.channel.messages.fetch({ limit: 5, after: message.id });
        const messagesAfterArray = Array.from(messagesAfter.values());

        let additionalContext = messagesBeforeArray.reverse().map(msg => (`**${truncateMessage(msg.content)}** - ${msg.author.tag} \n`))
        additionalContext.push('\n *deleted message* \n\n')
        additionalContext = additionalContext.concat(...messagesAfterArray.reverse().map(msg => (`**${truncateMessage(msg.content)}** - ${msg.author.tag} \n`)))

        if (deletionLog) {
            const deletedMessageEmbed = new EmbedBuilder()
                .setColor(0xfc0303)
                .setTitle('Deleted message')
                .setDescription(message.content)
                .setFooter({
                    text: `by ${message.author.tag} at ${message.createdAt.toLocaleString()}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setURL(messageLink(message.channel.id, message.id));
            
            const additionalContextEmbed = new EmbedBuilder()
                .setColor(0x696969)
                .setTitle('Additional context')
                .setDescription(`${additionalContext.join('')}`)   

            let embeds = [deletedMessageEmbed, additionalContextEmbed]
            if (replyEmbed) embeds = [replyEmbed, deletedMessageEmbed, additionalContextEmbed]
            
            logChannel.send({
                content: `<@${deletionLog.executor.id}> deleted a message by <@${message.author.id}> in <#${message.channel.id}>`,
                embeds: embeds
            });
        }
    }
}
