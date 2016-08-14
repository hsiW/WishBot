let axios = require('axios'),
    getName = require('./../../utils/utils.js').getName,
    utils = require('./../../utils/utils.js');

module.exports = {
    usage: "Returns the users avatar, can take a username/nickname(can take a mention if a match isnt found) to return the avatar of that user.\n`avatar [user mention] or [none]`",
    cooldown: 5,
    process: (bot, msg, suffix) => {
        msg.mentions.length === 1 ? user = msg.mentions[0] : user = getName(msg, suffix).user;
        if (user) {
            axios.get(user.avatarURL, {
                responseType: 'arraybuffer'
            }).then(response => {
                bot.createMessage(msg.channel.id, "__**" + user.username + "'s** avatar is:__", {
                    file: response.data,
                    name: 'avatar.jpg'
                });
            }).catch(console.log);
        } else bot.createMessage(msg.channel.id, suffix + " is not a valid user.").then(message => utils.messageDelete(bot, message)).catch();
    }
}