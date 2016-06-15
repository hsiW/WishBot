var quote = require("./../lists/animequotes.json").animequotes;
var pun = require("./../lists/puns.json").puns;

var words = {
    "quote": {
        usage: "Prints out a random anime quote or the quote at the position mentioned\n`quote [number] or [none]`",
        delete: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (suffix && /^\d+$/.test(suffix) && quote.length >= parseInt(suffix) - 1) bot.createMessage(msg.channel.id, quote[suffix - 1]);
            else bot.createMessage(msg.channel.id, quote[Math.floor(Math.random() * (quote.length))]);
        }
    },
    "pun": {
        usage: "Prints out a random pun or the pun at the position mentioned\n`pun [number] or [none]`",
        delete: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (suffix && /^\d+$/.test(suffix) && pun.length >= parseInt(suffix) - 1) bot.createMessage(msg.channel.id, pun[suffix - 1]);
            else bot.createMessage(msg.channel.id, pun[Math.floor(Math.random() * (pun.length))]);
        }
    },
    "reverse": {
        usage: "Reverses the mentioned terms\n`reverse [terms]`",
        delete: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            bot.createMessage(msg.channel.id, (suffix.split("").reverse().join("")));
        }
    },
    "vquote": {
        usage: "Sends a call quote to The People Chat's quote channel\n⚠Will not work on any other server⚠\n`vquote [quote]`",
        delete: true,
        privateServer: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (!suffix) bot.createMessage(msg.channel.id, "You'll need to have a quote to quote something, **" + msg.author.username + "**-senpai.");
            else bot.createMessage("136558567082819584", "__From voice chat:__ \n" + suffix);
        }
    },
    "tquote": {
        usage: "Sends a text quote to The People Chat's quote channel\n⚠Will not work on any other server⚠\n`tquote [quote]`",
        delete: true,
        privateServer: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg, suffix) {
            if (!suffix) bot.createMessage(msg.channel.id, "You'll need to have a quote to quote something, **" + msg.author.username + "**-senpai.");
            else bot.createMessage("136558567082819584", "__From text chat:__ \n" + suffix);
        }
    },
    "randomquote": {
        usage: "Prints a random quote from The People Chat's quote channel\n⚠Will not work on any other server⚠",
        delete: true,
        privateServer: true,
        cooldown: 2,
        type: "words",
        process: function(bot, msg) {
            bot.getChannelMessages("136558567082819584", 100).then(messages => {
                var message = messages[Math.floor((Math.random() * messages.length) + 1)];
                bot.createMessage(msg.channel.id, message.content).catch(err=> errorC(err))
                console.log(message)
            }).catch(err => console.log(errorC(err)));

        }
    }
}

/*var ids = [];
var getStuff = (before) => {
    bot.getChannelMessages(channelID, 100, before).then((messages)=>{
        ids = ids.concat(messages.map(m=>m.id));
        if(messages.length===100)
            getStuff(messages[messages.length-1].id);
        else
            require("fs").writeFileSync("messageIDs.json",JSON.stringify(ids));
    }
};
getStuff();*/ //future stuff

exports.words = words;