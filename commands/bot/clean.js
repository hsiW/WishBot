module.exports = {
    usage: `Cleans the **bots messages** from the channel. Cleans from the **passed number** of messages. Defaults to **last 50 messages**.

\`clean [number]\``,
    delete: true,
    cooldown: 30,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            /^\d+$/.test(args) ? args = parseInt(args) : args = 50; //Checks if args is a number(as well as it existing) and if so sets args to that number otherwise defaults to 50
            //Check to make sure the bot has access to the bulk delete endpoint which requires mangeMessages
            if (msg.channel.guild && msg.channel.permissionsOf(bot.user.id).has('manageMessages')) {
                //Purges the bots messages from the number of messages the user requested
                msg.channel.purge(args, message => message.author.id === bot.user.id, msg.id).then(deleted => resolve({
                    //When purge is finished return the relevant message which will be deleted after 5s 
                    message: `Finished cleaning  **${deleted}** bot messages in last **${args}** message(s) of ${msg.channel.mention}, **${msg.author.username}**-senpai.`,
                    delete: true
                })).catch(err => console.log(errorC(err)))
            } else {
                var deleted = 0; //Tracks the number of deleted messages
                //Get an array of the number of messages starting before the command message
                msg.channel.getMessages(args, msg.id).then(messages => {
                    messages = messages.filter(message => message.author.id === bot.user.id) //Filters array to just the bots messages
                    //Runs loop to delete bots messages from array
                    messages.forEach(message => {
                        message.delete();
                        deleted++; //Adds 1 to the deleted variable every delete
                    })
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