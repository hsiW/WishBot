module.exports = {
    usage: '**Pings** this bot, useful for checking if the bots working correctly. **(Not accurate)**',
    delete: false,
    cooldown: 5,
    process: msg => {
        return Promise.resolve({
            message: "PONG!", //Sends Pong! on message
            //Uses a function to configure the time between the message recieving th message and the new sent one so the time will be more accurate
            edit: message => 'PONG! | *' + (new Date(message.timestamp) - new Date(msg.timestamp)) + '*ms'
        });
    }
}