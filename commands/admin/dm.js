module.exports = {
    usage: 'DM a user using the bot. `dm [userID] [message]` to send a direct message to userID with message.',
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            //Try to get the user from the first part of the args
            let user = bot.users.get(args.split(' ')[0]),
                message = args.split(' ').slice(1).join(' '); //Message is the rest of args
            if (user !== null) {
                //Get the DM channel then dm the user
                user.getDMChannel().then(dm => dm.createMessage('**Message from ' + msg.author.username + '**: ```' + message + '```').then(() => resolve({
                    message: `Sucessfully sent message to ${user.username}.`,
                    delete: true
                })))
            }
            //If no user found  
            else resolve({
                message: 'No user found.',
                delete: true
            })
        });
    }
}