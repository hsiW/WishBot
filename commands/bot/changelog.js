module.exports = {
    usage: 'Returns the last changelog for the bot.',
    delete: false,
    cooldown: 10,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            bot.getMessages('143904176613752832', 1).then(message => {
                resolve({
                    message: message[0].content
                });
            })
        });
    }
}