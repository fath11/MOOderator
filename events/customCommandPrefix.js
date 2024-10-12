const { Events } = require('discord.js');
const prefix = "!"

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
      case "banish":
        const duration = 60 * 1000; // 1 minute in milliseconds
        try {
          await message.member.timeout(duration, 'Taking a rest');
          message.reply("You are banished for 1 minute! \n It's time for you to exit Discord and take a rest.");
        } catch (error) {
          console.error('Failed to timeout the user:', error);
          message.reply('Failed to timeout the user.');
        }
        break;
    }
  }
}