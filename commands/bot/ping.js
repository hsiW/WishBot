module.exports = {
    usage: 'Pings this bot, useful for checking if the bots working correctly. *(Not usually accurate)*',
    delete: false,
    cooldown: 5,
    process: msg => {
        return Promise.resolve({
            message: "PONG!",
            edit: message => 'PONG! | *' + (new Date(message.timestamp) - new Date(msg.timestamp)) + '*ms'
        });
    }
}