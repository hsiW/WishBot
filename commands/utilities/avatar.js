var request = require('request').defaults({
    encoding: null
});
var getName = require('./../../utils/utils.js').getName;

module.exports = {
    usage: "Prints the avatar of the user mentioned or the message authors avatar if none mentioned.\n`avatar [user mention] or [none]`",
    delete: true,
    cooldown: 5,
    process: function(bot, msg, suffix) {
        msg.mentions.length === 1 ? user = msg.channel.guild.members.get(msg.mentions[0]) : user = getName(msg, suffix);
        console.log(user.user);
        if (user) {
            request("https://discordapp.com/api/users/" + user.user.id + "/avatars/" + user.user.avatar + ".jpg", function(err, response, buffer) {
                bot.createMessage(msg.channel.id, "**" + user.user.username + "'s** avatar is:", {
                    file: buffer,
                    name: user.user.username + '.jpg'
                });
            });
        } else {
            bot.createMessage(msg.channel.id, suffix + " is not a valid user.")
        }
    }
}