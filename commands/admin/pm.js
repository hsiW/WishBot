module.exports = {
    delete: false,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            let user = bot.users.get(args.split(' ')[0]),
                message = args.split(' ').slice(1).join(' ');
            if (user != null) {
                user.getDMChannel().then(pm => pm.createMessage('**Message from ' + msg.author.username + '**: ```' + message + '```').then(() => resolve({
                    message: `Sucessfully sent message to ${user.username}.`,
                    delete: true
                })))
            } else resolve({
                message: 'No user found.',
                delete: true
            })
        });
    }
}