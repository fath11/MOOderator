const fs = require('node:fs');

function getSettings() {
  return JSON.parse(fs.readFileSync('config.json', 'utf8'));
}

function getLogChannel(message) {
  const logChannelId = getSettings().logChannelId;
  const logChannel = message.guild.channels.cache.get(logChannelId);
  if (!logChannel) {
      message.reply("Log channel not set. Use `/logchannel channel:your-server's-log-channel` and set one.");
      return;
  }

  return logChannel;
}

module.exports = {
  getSettings,
  getLogChannel
}