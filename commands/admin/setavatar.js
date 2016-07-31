let axios = require('axios');

module.exports = {
    delete: true,
    process: function(bot, msg, suffix) {
        axios.get(suffix).then(response => {
            if (response.status === 200) {
                var data = "data:" + response.headers["content-type"] + ";base64," + response.data.toString('base64');
                bot.editSelf({
                    avatar: data
                }).then(() => bot.createMessage(msg.channel.id, 'Successfully changed avatar'), err => bot.createMessage(msg.channel.id, err));
            }
        }).catch(console.log);
    }
}