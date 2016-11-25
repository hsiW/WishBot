const customTags = require('./../../database/CustomTags.json');

module.exports = {
    usage: "Returns a **JSON** containing the **old chans** of the server.",
    dm: false,
    delete: false,
    cooldown: 60,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            if (customTags.hasOwnProperty(msg.channel.guild.id)) {
                resolve({
                    message: 'Here are you old chans',
                    upload: {
                        file: Buffer.from(JSON.stringify(customTags[msg.channel.guild.id], null, 4)),
                        name: 'chans.json'
                    }
                })
            } else resolve({
                message: 'Your server does not have any old chans saved.',
                delete: true
            })
        });
    }
}