function getUser(bot, msg, suffix) {
    var nameRegex = new RegExp(suffix, "i");
    return usersCache = msg.channel.server.members.get('name', nameRegex);
}

var interactions = {
    "smite": {
        usage: "Smites the mentioned user or the message sender if no user mentioned\n`smite [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg, suffix) {
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendMessage(msg, suffix + " has been smited using the power granted to Bluee by the Cabbage Phoenix.");
                else bot.sendMessage(msg, "**" + msg.sender.name + "** has smited themself using power granted to Bluee by the Cabbage Phoenix.");
            } else bot.sendMessage(msg, "**" + msg.sender.name + "** has smited themself using power granted to Bluee by the Cabbage Phoenix.");
        }
    },
    "slap": {
        usage: "Slaps the mentioned user or the message sender if no user mentioned\nslap [mentioned user] or [none]",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg, suffix) {
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendMessage(msg, suffix + ", was slapped by , **" + msg.author.name + "**!");
                else bot.sendMessage(msg, "**" + msg.author.name + "** slapped themselves");
            } else bot.sendMessage(msg, "**" + msg.author.name + "** slapped themselves");
        }
    },
    "punt": {
        usage: "",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg, suffix) {
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendMessage(msg, suffix + ", was punted into the San Frasico Bay by , **" + msg.author.name + "**!");
                else bot.sendMessage(msg, "**" + msg.author.name + "** went to punt the air and fell into the San Francisco Bay.");
            } else bot.sendMessage(msg, "**" + msg.author.name + "** went to punt the air and fell into the San Francisco Bay.");
        }
    },
    "hug": {
        usage: "Hugs the mentioned user or puts a hug if none mentioned\n`hug [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg, suffix) {
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendMessage(msg, suffix + ", (>^_^)> <(^.^<) ,**" + msg.author.name + "**");
                else bot.sendMessage(msg, "(>^_^)> <(^.^<)");
            } else bot.sendMessage(msg, "(>^_^)> <(^.^<)");
        }
    },
    "poke": {
        usage: "Pokes the mentioned user or pokes this bot if none mentioned\n`poke [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg, suffix) {
            var randomPoke = Math.random() < 0.5 ? "http://i.imgur.com/J4Vr0Hg.gif" : "http://i.imgur.com/6KpNE1V.gif";
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendMessage(msg, suffix + " was poked by **" + msg.author.name + "**\n" + randomPoke);
                else bot.sendMessage(msg, bot.user + " was poked by **" + msg.author.name + "**\n" + randomPoke);
            } else bot.sendMessage(msg, bot.user + " was poked by **" + msg.author.name + "**\n" + randomPoke);
        }
    },
    "pet": {
        usage: "Pets the mentioned user or pets this bot if none mentioned\n`pet [mentioned user] or [none]`",
        delete: true,
        cooldown: 5,
        type: "interactions",
        process: function(bot, msg, suffix) {
            var links = ["http://i.imgur.com/Y3GB3K1.gif", "http://i.imgur.com/f7ByidM.gif", "http://i.imgur.com/LUpk6b6.gif"]
            if (suffix) {
                suffix = msg.mentions.length === 1 ? suffix = msg.mentions[0] : suffix = getUser(bot, msg, suffix);
                if (suffix != null) bot.sendMessage(msg, suffix + " was petted by **" + msg.author.name + "**\n" + links[Math.floor(Math.random() * (links.length))]);
                else bot.sendMessage(msg, bot.user + " was petted by **" + msg.author.name + "**\n" + links[Math.floor(Math.random() * (links.length))]);
            } else bot.sendMessage(msg, bot.user + " was petted by **" + msg.author.name + "**\n" + links[Math.floor(Math.random() * (links.length))]);
        }
    }
}

exports.interactions = interactions;