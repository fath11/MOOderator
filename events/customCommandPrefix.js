const { Events } = require('discord.js');
const prefix = "!"

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
      case "ihatemyself":
        const duration = 60 * 1000; // 1 minute in milliseconds
        message.reply("DO NOT SAY THAT. You deserves to be loved and cared, you are special, believe in yourself, we care about you. \n You should take some time off of Discord and take a rest, stay strong for me will ya 💪");
        try {
          await message.member.timeout(duration, 'Take a rest from this evil place...');
        } catch (error) {
          console.error('Failed to timeout the user:', error);
        }
        break;
    }
  }
}