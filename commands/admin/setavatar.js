var request = require('request').defaults({
    encoding: null
});

module.exports = {
    delete: true,
    process: function(bot, msg, suffix) {
        request.get(suffix, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var data = "data:" + response.headers["content-type"] + ";base64," + body.toString('base64');
                bot.editSelf({
                    avatar: data
                }).then(bot.createMessage(msg.channel.id, "Success")).catch(err => bot.createMessage(msg.channel.id, err));
            }
        });
    }
}