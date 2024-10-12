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
      case "iamfeelinglucky":
        const luckyNumber = Math.floor(Math.random() * 101); // Generate a random number between 0 and 100
        let response;
        if (luckyNumber > 75) {
          response = `🎉 You got a lucky number: ${luckyNumber}! You're very lucky today!`;
        } else if (luckyNumber == 69) {
          response = `😊 You got the number 69. Not bad you naughty creature!`;
        } else if (luckyNumber > 50) {
          response = `😊 You got the number ${luckyNumber}. Not bad!`;
        } else if (!luckyNumber == 0) {
          response = `😕 You got the number ${luckyNumber}. Better luck next time!`;
        } else {
          response = `🫡 Well well well, you lost quite hard there... Now, Give. Me. Your. NG.`;
          try {
            await message.member.timeout(10 * 60 * 1000, 'gambled too much');
          } catch(e)  {
            response = `😡 You got 0 but i can't timeout you. Check your closet tonight.`
          }
        }

        await message.reply(response);
        break;
    }
  }
}