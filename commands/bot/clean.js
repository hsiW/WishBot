let utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Cleans the mentioned number of this bots messages from the current channel. Can only delete 100 messages at a time without the bot having `manageMessages`, otherwise its limitless.\n`delete [number]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (/^\d+$/.test(suffix)) {
            if (msg.channel.permissionsOf(bot.user.id).has('manageMessages')) bot.purgeChannel(msg.channel.id, parseInt(suffix), message => message.author.id === bot.user.id).then(count => bot.createMessage(msg.channel.id, `Finished cleaning  **${count}** bot messages in last **${suffix}** message(s) of ${msg.channel.mention}, **${msg.author.username}**-senpai.`).then(message => utils.messageDelete(bot, message))).catch();
            else {
                bot.getMessages(msg.channel.id, 100, msg.id).then(messages => {
                    let toDelete = parseInt(suffix, 10),
                        dones = 0;
                    for (i = 0; i <= 100; i++) {
                        if (toDelete <= 0 || i === 100) {
                            bot.createMessage(msg.channel.id, `Finished cleaning **${dones}** message(s) in ${msg.channel.mention}`).then(message => utils.messageDelete(bot, message));
                            return;
                        } else if (messages[i].author.id === bot.user.id) {
                            bot.deleteMessage(msg.channel.id, messages[i].id).catch();
                            dones++;
                            toDelete--;
                        }
                    }
                }).catch(console.log);
            }
        } else bot.createMessage(msg.channel.id, "Using the clean command requires a number, **" + msg.author.username + "**-senpai.").then(message => utils.messageDelete(bot, message)).catch();
    }
}