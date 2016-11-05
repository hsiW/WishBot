let Database = require('./../../utils/database.js');

module.exports = {
    usage: 'Changes the current prefix to the inputted term. Spaces cannot be used. Sending nothing will revert it to the default prefix\n`prefix [new prefix]`',
    dm: false,
    delete: false,
    togglable: false,
    cooldown: 20,
    process: (msg, args) => {
        return new Promise(resolve => {
            //Changes guild prefix to the entered args
            Database.changePrefix(msg.channel.guild.id, args).then(prefix => {
                //If successful
                resolve({
                    message: "📋 Successfully changed prefix to `" + prefix + "` 📋",
                    delete: true
                })
            }).catch(err => {
                //If rejected
                resolve({
                    message: "⛔ " + err + " ⛔",
                    delete: true
                })
            })
        });
    }
}