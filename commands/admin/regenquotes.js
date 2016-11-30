const fs = require('fs');

module.exports = {
    delete: false,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            bot.getMessages('136558567082819584', 100000000).then(messages => {
                messages = messages.map(message => message.content).reverse()
                fs.writeFileSync(__dirname + "/../../database/quote.json", JSON.stringify(messages, null, 4))
                resolve({
                    message: 'Regenerated the Quotes Database with `' + messages.length + '` quotes.',
                    delete: true
                })
            })
        });
    }
}