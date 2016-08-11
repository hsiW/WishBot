let utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Cleans the mentioned number of this bots messages from the current channel.\n`delete [# from 1-100]`",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (/^\d+$/.test(suffix)) {
            if (!msg.channel.permissionsOf(bot.user.id).has('manageMessages')) {
                console.log('yes')
                bot.getMessages(msg.channel.id, 100).then(messages => {
                    let toDelete = parseInt(suffix, 10)
                    let dones = 0;
                    for (i = 0; i <= 100; i++) {
                        if (toDelete <= 0 || i === 100) {
                            bot.createMessage(msg.channel.id, `Finished cleaning **${dones}** message(s) in ${msg.channel.mention}`).then(message => utils.messageDelete(bot, message));
                            return;
                        }
                        if (messages[i].author.id === bot.user.id) {
                            bot.deleteMessage(msg.channel.id, messages[i].id).catch(err => errorC(err.stack));
                            dones++;
                            toDelete--;
                        }
                    }
                }).catch(err => console.log(errorC(err.stack)));
            } else bot.purgeChannel(msg.channel.id, parseInt(suffix), message => message.author.id === bot.user.id).then(count => bot.createMessage(msg.channel.id, `Finished cleaning  **${count}** bot messages in last **${suffix}** message(s) of ${msg.channel.mention}, **${msg.author.username}**-senpai.`).then(message => utils.messageDelete(bot, message))).catch(err => errorC(err));
        } else bot.createMessage(msg.channel.id, "Using the clean command requires a number, **" + msg.author.username + "**-senpai.").then(message => utils.messageDelete(bot, message));
    }
}