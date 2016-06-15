var interactions = {
    "smite": {
        usage: "Smites the mentioned user or the message sender if no user mentioned\n`smite [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg) {
            if (msg.mentions.length === 1) {
                bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " has been smited using the power granted to Bluee by the Cabbage Phoenix.");
            } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** has smited themself using power granted to Bluee by the Cabbage Phoenix.");
        }
    },
    "slap": {
        usage: "Slaps the mentioned user or the message sender if no user mentioned\n`slap [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg) {
            if (msg.mentions.length === 1) bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " was slapped by **" + msg.author.username + "**!");
            else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** slapped themselves!");
        }
    },
    "punt": {
        usage: "Punts the mentioned user into the San Francisco Bay\n`punt [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg) {
            if (msg.mentions.length === 1) {
                bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + ", was punted into the San Francisco Bay by, **" + msg.author.username + "**!");
            } else bot.createMessage(msg.channel.id, "**" + msg.author.username + "** went to punt nothing and fell into the San Francisco Bay.");
        }
    },
    "hug": {
        usage: "Hugs the mentioned user or puts a hug if none mentioned\n`hug [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg) {
            if (msg.mentions.length === 1) {
                bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + ", (>^_^)> <(^.^<) ,**" + msg.author.username + "**");
            } else bot.createMessage(msg.channel.id, "(>^_^)> <(^.^<)");
        }
    },
    "poke": {
        usage: "Pokes the mentioned user or pokes this bot if none mentioned\n`poke [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg) {
            var randomPoke = Math.random() < 0.5 ? "http://i.imgur.com/J4Vr0Hg.gif" : "http://i.imgur.com/6KpNE1V.gif";
            if (msg.mentions.length === 1) {
                bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " was poked by **" + msg.author.username + "**\n" + randomPoke);
            } else bot.createMessage(msg.channel.id, "<@" + bot.user.id + "> was poked by **" + msg.author.username + "**\n" + randomPoke);
        }
    },
    "pet": {
        usage: "Pets the mentioned user or pets this bot if none mentioned\n`pet [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg) {
            var links = ["http://i.imgur.com/Y3GB3K1.gif", "http://i.imgur.com/f7ByidM.gif", "http://i.imgur.com/LUpk6b6.gif"]
            if (msg.mentions.length === 1) {
                bot.createMessage(msg.channel.id, '<@' + msg.mentions[0] + '>' + " was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]);
            } else bot.createMessage(msg.channel.id, "<@" + bot.user.id + "> was petted by **" + msg.author.username + "**\n" + links[Math.floor(Math.random() * (links.length))]);
        }
    }
}

exports.interactions = interactions;