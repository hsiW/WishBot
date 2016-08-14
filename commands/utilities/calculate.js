let math = require('mathjs');

module.exports = {
    usage: "Prints out the answer to the expression inputted. Keep in mind * is used for multiplying. Cannot currently solve for values. Can also convert between units by using:`[number]<current units> to <desired units>`\n`calculate [calculation]`",
    cooldown: 10,
    process: (bot, msg, suffix) => {
        bot.createMessage(msg.channel.id, `**${msg.author.username}** here is the answer to that calculation: \`\`\`xl\n${math.eval(suffix)}\`\`\``).catch();
    }
}