let axios = require('axios'),
    fs = require('fs');

module.exports = {
    delete: true,
    process: function(bot, msg, suffix) {
        if (suffix) {
            axios.get(suffix).then(response => {
                if (response.status === 200) {
                    var data = "data:" + response.headers["content-type"] + ";base64," + response.data.toString('base64');
                    bot.editSelf({
                        avatar: data
                    }).then(() => bot.createMessage(msg.channel.id, 'Successfully changed avatar'), err => bot.createMessage(msg.channel.id, err));
                }
            }).catch(console.log);
        } else {
            fs.readdir(`${__dirname}/../../avatars/`, (err, files) => {
                let avatar = files[Math.floor(Math.random() * (files.length))];
                fs.readFile(`${__dirname}/../../avatars/${avatar}`, (err, image) => {
                    let data = "data:image/" + avatar.split('.')[1] + ";base64," + image.toString('base64');
                    bot.editSelf({
                        avatar: data
                    }).then(() => console.log(botC('Changed avatar')), err => console.log(errorC(err)));
                })
            });
        }
    }
}