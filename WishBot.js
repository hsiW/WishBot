//Libs and Variables
const Eris = require('eris'),
    tablesUnFlipped = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"],
    reload = require('require-reload'),
    chalk = require('chalk'),
    fs = require('fs'),
    request = require('request'),
    c = new chalk.constructor({
        enabled: true
    });

let options = require('./options/options.json'),
    CommandLoader = require('./utils/CommandLoader.js'),
    processCmd = require('./utils/CommandHandler.js'),
    games = require('./lists/games.json'),
    utils = require('./utils/utils.js'),
    Database = require('./utils/Database.js'),
    regex,
    bot = new Eris(options.token, {
        getAllUsers: true,
        messageLimit: 5,
        maxShards: 4,
        autoReconnect: true,
        disableEveryone: true,
        moreMentions: false,
        disabledEvents: {
            VOICE_STATE_UPDATE: true,
            TYPING_START: true,
            GUILD_EMOJI_UPDATE: true,
            GUILD_INTEGRATIONS_UPDATE: true,
            GUILD_BAN_ADD: true,
            GUILD_BAN_REMOVE: true,
            MESSAGE_UPDATE: true
        }
    });

//Global Variables
admins = require('./options/admins.json'),
UsageChecker = require('./utils/UsageChecker.js'),
botC = c.magenta.bold,
userC = c.cyan.bold,
serverC = c.black.bold,
channelC = c.green.bold,
miscC = c.blue.bold,
warningC = c.yellow.bold,
errorC = c.red.bold;

bot.on("ready", () => {
    regex = new RegExp('^<@\!?' + bot.user.id + '+>');
    bot.shards.forEach((shard) => {
        shard.editGame({
            name: games[Math.floor(Math.random() * (games.length))]
        });
    })
    console.log(botC(bot.user.username + " is now Ready."));
    console.log('Current # of Commands Loaded: ' + warningC(Object.keys(commands).length))
    console.log("Users: " + userC(bot.users.size) + " | Channels: " + channelC(Object.keys(bot.channelGuildMap).length) + " | Servers: " + serverC(bot.guilds.size))
    UsageChecker.checkInactivity(bot);
})

bot.on("messageCreate", msg => {
    if ((msg.author.bot && msg.author.id !== "174669219659513856") || !msg.channel.guild) return;
    else {
        let msgPrefix = Database.checkPrefix(msg.channel.guild) != undefined ? Database.checkPrefix(msg.channel.guild) : options.prefix;
        if (msg.content === "(╯°□°）╯︵ ┻━┻") Database.checkSetting(msg.channel.guild, 'tableflip').then(() => bot.createMessage(msg.channel.id, tablesUnFlipped[Math.floor(Math.random() * (tablesUnFlipped.length))])).catch()
        if (msg.content.split(" ")[0] === "sudo" && msg.author.id === "87600987040120832") evalText(msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2));
        if (msg.content.match(regex)) msg.content = msg.content.replace(regex, msgPrefix + "chat");
        if (msg.content.startsWith(options.prefix + "prefix")) processCmd(bot, msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2), "prefix", options.prefix);
        else if (msg.content === "pls reload" && admins.indexOf(msg.author.id) > -1) reloadAll(msg);
        else if (msg.content.startsWith(msgPrefix)) {
            let formatedMsg = msg.content.substring(msgPrefix.length, msg.content.length);
            let cmdTxt = formatedMsg.split(" ")[0].toLowerCase();
            if (cmdTxt === 'channelmute') processCmd(bot, msg, formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1), cmdTxt);
            else if (commands.hasOwnProperty(cmdTxt)) Database.checkChannel(msg.channel).then(() => Database.checkCommand(msg.channel.guild, cmdTxt).then(() => processCmd(bot, msg, formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1), cmdTxt))).catch(console.log);
        }
    }
});

function reloadAll(msg) {
    try {
        delete commands;
        try {
            reload.emptyCache('./utils/CommandLoader.js');
            CommandLoader = require('./utils/CommandLoader.js');
            processCmd = reload('./utils/CommandHandler.js');
            games = reload('./lists/games.json');
            admins = reload('./options/admins.json');
            utils = reload('./utils/utils.js');
            UsageChecker = reload('./utils/UsageChecker.js')
        } catch (e) {
            console.error("Failed to reload! Error: ", e);
        }
        CommandLoader.load().then(() => {
            bot.createMessage(msg.channel.id, "🆗").then(message => utils.messageDelete(bot, message));;
            bot.deleteMessage(msg.channel.id, msg.id);
            console.log(botC("@" + bot.user.username) + errorC(" All Modules Reloaded"));
            console.log('Current # of Commands Loaded: ' + warningC(Object.keys(commands).length))
        }).catch(err => {
            bot.createMessage(msg.channel.id, "```" + err + "```")
            console.log(errorC(err.stack))
        });
    } catch (err) {
        bot.createMessage(msg.channel.id, "```" + err + "```")
        console.log(errorC(err.stack))
    }
}

function evalText(msg, suffix) {
    let result;
    try {
        result = eval("try{" + suffix + "}catch(err){console.log(errorC(\"ERROR \"+err));bot.createMessage(msg.channel.id, \"```\"+err+\"```\");}");
    } catch (e) {
        console.log(errorC("ERROR" + e));
        bot.createMessage(msg.channel.id, "```" + e + "```");
    }
    if (result && typeof result !== "object") bot.createMessage(msg.channel.id, result);
    else if (result && typeof result === "object") bot.createMessage(msg.channel.id, "```xl\n" + result + "```");
}

bot.on("guildMemberAdd", (guild, member) => {
    if (guild) {
        Database.checkSetting(guild, 'welcome').then(response => {
            let message = response.response.replace(/\[GuildName]/g, guild.name).replace(/\[ChannelName]/g, guild.channels.get(response.channel.toString()).name).replace(/\[ChannelMention]/g, guild.channels.get(response.channel.toString()).mention).replace(/\[UserName]/g, member.user.username).replace(/\[UserMention]/g, member.user.mention);
            bot.createMessage(response.channel, message);
        }).catch();
    }
})

bot.on("guildMemberRemove", (guild, member) => {
    if (guild) {
        Database.checkSetting(guild, 'leave').then(response => {
            let message = response.response.replace(/\[GuildName]/g, guild.name).replace(/\[ChannelName]/g, guild.channels.get(response.channel.toString()).name).replace(/\[ChannelMention]/g, guild.channels.get(response.channel.toString()).mention).replace(/\[UserName]/g, member.user.username);
            bot.createMessage(response.channel, message)
        }).catch()
    }
})

bot.on("error", err => {
    console.log(botC("@" + bot.user.username) + " - " + errorC("ERROR:\n" + err.stack));
})

bot.on("disconnect", err => {
    console.log(botC("@" + bot.user.username) + " - " + errorC("DISCONNECTED: " + err));
    process.exit(0);
})

bot.on('shardResume', id => {
    console.log(botC("@" + bot.user.username) + " - " + warningC("SHARD #" + id + "RECONNECTED"));
})

bot.on("error", err => {
    console.log(botC("@" + bot.user.username) + " - " + errorC("ERROR:\n" + err.stack));
})

bot.on("disconnect", err => {
    console.log(botC("@" + bot.user.username) + " - " + errorC("DISCONNECTED: " + err));
    process.exit(0);
})

bot.on('shardResume', id => {
    console.log(botC("@" + bot.user.username) + " - " + warningC("SHARD #" + id + "RECONNECTED"));
})

bot.on("shardDisconnect", (error, id) => {
    console.log(botC("@" + bot.user.username) + " - " + warningC("SHARD #" + id + "DISCONNECTED"));
    console.log(errorC(error));
})

CommandLoader.load().then(() => {
    bot.connect().then(console.log(warningC("Logged in using Token"))).catch(err => console.log(errorC(err.stack)));
}).catch(err => errorC(err.stack));

var interruptedAlready = false;
process.on('SIGINT', function() {
    if (interruptedAlready) {
        console.log(errorC("Caught second interrupt signal... Exiting"));
        process.exit(1);
    }
    interruptedAlready = true;
    console.log(warningC("Caught interrupt signal... Disconnecting"));
    bot.disconnect();
});

function postGuildCount() {
    request.post({
        "url": "https://www.carbonitex.net/discord/data/botdata.php",
        "headers": {
            "content-type": "application/json"
        },
        "json": true,
        body: {
            "key": options.carbon_key,
            "servercount": bot.guilds.size
        }
    }, (error, response, body) => {
        if (error) console.log(error);
        else {
            request.post({
                "url": "https://bots.discord.pw/api/bots/" + bot.user.id + "/stats",
                "headers": {
                    "content-type": "application/json",
                    "Authorization": options.bots_key
                },
                "json": true,
                body: {
                    "logoid": bot.user.avatar,
                    "server_count": bot.guilds.size
                }
            }, (err, response, body) => {
                if (!error) console.log(botC("@WishBot") + " Successfully posted " + serverC(bot.guilds.size) + " Servers to Carbon.");
                else console.log(errorC("Failed to post Servers to Carbon"));
            });
        }
    });
}
setInterval(() => {
    bot.shards.forEach((shard) => {
        shard.editGame({
            name: games[Math.floor(Math.random() * (games.length))]
        });
    })
}, 6e+5);

setInterval(() => {
    fs.readdir(`${__dirname}/avatars/`, (err, files) => {
        let avatar = files[Math.floor(Math.random() * (files.length))];
        fs.readFile(`${__dirname}/avatars/${avatar}`, (err, image) => {
            let data = "data:image/" + avatar.split('.')[1] + ";base64," + image.toString('base64');
            bot.editSelf({
                avatar: data
            }).then(() => console.log(botC('Changed avatar to ' + avatar.split('.')[0])), err => console.log(errorC(err)));
        })
    });
}, 3.6e+6);