module.exports = {
    usage: 'Returns the last changelog for the bot.',
    delete: false,
    cooldown: 10,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            //Gets Messages from the changelog channel in the Yuki Server and returns the most recent changelog message
            bot.getMessages('143904176613752832', 1).then(message => {
                resolve({
                    message: message[0].content
                });
            })
        });
    }
}