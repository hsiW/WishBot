module.exports = {
    usage: "Removes the bots messages from the current channel. Searches the mentioned number of messages to clean from. Defaults to 50 messages but can be changed with a mentioned number.\n`delete [number]`",
    cooldown: 10,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            /^\d+$/.test(args) ? args = parseInt(args) : args = 50; //Checks if args is a number(as well as it existing) and if so sets args to that number otherwise defaults to 50
            //Check to make sure the bot has access to the bulk delete endpoint which requires mangeMessages
            if (msg.channel.permissionsOf(bot.user.id).has('manageMessages')) {
                //Purges the bots messages from the number of messages the user requested
                msg.channel.purge(args, message => message.author.id === bot.user.id).then(deleted => resolve({
                    //When purge is finished return the relevant message which will be deleted after 5s 
                    message: `Finished cleaning  **${deleted}** bot messages in last **${args}** message(s) of ${msg.channel.mention}, **${msg.author.username}**-senpai.`,
                    delete: true
                }))
            } else {
                var deleted = 0; //Tracks the number of deleted messages
                //Get an array of the number of messages starting before the command message
                msg.channel.getMessages(args, msg.id).then(messages => {
                    //Runs loop to delete bots messages every 200ms probably
                    for (let message in messages) {
                        if (messages[message].author.id === bot.user.id) {
                            setTimeout(() => messages[message].delete(), 200)
                            deleted++; //Adds 1 to the deleted variable every delete
                        }
                    }
                    //When for loop is finished return the relevant message which will be deleted after 5s
                    resolve({
                        message: `Finished cleaning  **${deleted}** bot messages in last **${args}** message(s) of ${msg.channel.mention}, **${msg.author.username}**-senpai.`,
                        delete: true
                    })
                });
            }
        })
    }
}