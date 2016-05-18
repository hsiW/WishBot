var cool = require('cool-ascii-faces');
var smug = require('./../lists/smug.json').smug;
var request = require('request').defaults({
    encoding: null
});

var misc = {
    "sing": {
        usage: "This bot prints a song in the current channel",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "*:notes: sings a beautiful song about Onii-chan :notes:*");
        }
    },
    "weedle": {
        usage: "This bot prints a weedle in the current channel",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "Weedle Weedle Weedle Wee\nhttp://media.giphy.com/media/h3Jm3lzxXMaY/giphy.gif");
        }
    },
    "flamethrower": {
        usage: "This bot prints a flamethrower in the current channel",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "(╯°□°)╯︵ǝɯɐlℲ");
        }
    },
    "smug": {
        usage: "This bot prints a random smug image in the current channel",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            request(smug[Math.floor(Math.random() * (smug.length))], function(err, response, buffer) {
                bot.createMessage(msg.channel.id, null, {
                    file: buffer,
                    name: 'smug.jpg'
                });
            });
        }
    },
    "nyan": {
        usage: "This bot prints a nyan in the current channel",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            request('http://i.imgur.com/czx5YDq.gif', function(err, response, buffer) {
                bot.createMessage(msg.channel.id, null, {
                    file: buffer,
                    name: 'nyan.gif'
                });
            });
        }
    },
    "lenny": {
        usage: "This bot prints a lenny in the current channel",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "( ͡° ͜ʖ ͡°)");
        }
    },
    "wewlad": {
        usage: "This bot prints a wewlad in the current channel(I'm so sorry)",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            request('http://i.imgur.com/iKTCAoN.png', function(err, response, buffer) {
                bot.createMessage(msg.channel.id, null, {
                    file: buffer,
                    name: 'wewlad.png'
                });
            });
        }
    },
    "lewd": {
        usage: "Use this in case of lewd",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            var links = ["http://i.imgur.com/jKLnvR7.png", "http://i.imgur.com/kYwtaCI.gif", "http://i.imgur.com/JhidQYX.png", "http://i.imgur.com/RoWXWGK.png", "http://i.imgur.com/GPdjr2C.jpg"]
            bot.createMessage(msg.channel.id, links[Math.floor(Math.random() * (links.length))]);
        }
    },
    "sneakylenny": {
        usage: "This bot prints a sneaky lenny in the current channel",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg) {
            bot.createMessage(msg.channel.id, "┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴")
        }
    },
    "dance": {
        usage: "This bot dances around in the current channel using either a random dance or the one mentioned\n`dance [1-4]",
        delete: true,
        cooldown: 5,
        type: "misc",
        process: function(bot, msg, suffix) {
            var links = ["http://i.imgur.com/Y5uT94n.gif", "http://i.imgur.com/hHtsgeO.gif", "http://i.imgur.com/N8tLq.gif", "https://i.imgur.com/RDsfpp1.gif", "http://i.imgur.com/6lW96Jz.gif", "http://i.imgur.com/rFkvWeW.gif", "http://i.imgur.com/YTLXZZ0.gif"]
            if (suffix && /^\d+$/.test(suffix) && links.length >= parseInt(suffix) - 1) bot.createMessage(msg.channel.id, "🎶 💃 *Dances Around* 💃 🎶\n" + links[suffix - 1]);
            else bot.createMessage(msg.channel.id, ":notes: :dancer: *Dances Around* :dancer: :notes:\n" + links[Math.floor(Math.random() * (links.length))]);

        }
    }
}

exports.misc = misc;