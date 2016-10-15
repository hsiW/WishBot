let utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Removes the bots messages from the current channel. Defaults to 50 messages but can be changed with a mentioned number.\n`delete [number]`",
    cooldown: 10,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            /^\d+$/.test(args) ? args = parseInt(args) : args = 50;
            if (msg.channel.permissionsOf(bot.user.id).has('manageMessages')) msg.channel.purge(args, message => message.author.id === bot.user.id)
                .then(deleted => resolve({
                    message: `Finished cleaning  **${deleted}** bot messages in last **${args}** message(s) of ${msg.channel.mention}, **${msg.author.username}**-senpai.`,
                    delete: true
                }))
            else {
                var deleted = 0;
                msg.channel.getMessages(args, msg.id).then(messages => {
                    for (let message in messages) {
                        if (messages[message].author.id === bot.user.id) {
                            setTimeout(() => messages[message].delete(), 200)
                            deleted++;
                        }
                    }
                    resolve({
                        message: `Finished cleaning  **${deleted}** bot messages in last **${args}** message(s) of ${msg.channel.mention}, **${msg.author.username}**-senpai.`,
                        delete: true
                    })
                });
            }
        })
    }
}