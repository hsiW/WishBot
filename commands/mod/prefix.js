let Database = require('./../../utils/database.js');

module.exports = {
    usage: 'Changes the current prefix to the inputted term. Spaces cannot be used.\n`prefix [new prefix]`',
    dm: false,
    delete: false,
    togglable: false,
    cooldown: 20,
    process: (msg, args) => {
        return new Promise(resolve => {
            Database.changePrefix(msg.channel.guild.id, args).then(() => {
                resolve({
                    message: "📋 Successfully changed prefix to `" + args + "` 📋",
                    delete: true
                })
            }).catch(err => {
                resolve({
                    message: "⛔ " + err + " ⛔",
                    delete: true
                })
            })
        });
    }
}