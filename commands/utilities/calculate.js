let math = require('mathjs');

module.exports = {
    usage: "Prints out the answer to the expression mentioned. Keep in mind * is used for multiplying. Cannot currently solve for values. Can also convert between units by doing:`[number]<current units> to <desired units>`\n`calculate [expression]`",
    cooldown: 10,
    process: (bot, msg, suffix) => {
        bot.createMessage(msg.channel.id, `**${msg.author.username}** here is the answer to that calculation: \`\`\`xl\n${math.eval(suffix)}\`\`\``).catch();
    }
}