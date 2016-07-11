//Libs and Variables
const Eris = require('eris'),
    tablesUnFlipped = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"],
    reload = require('require-reload'),
    chalk = require('chalk'),
    c = new chalk.constructor({
        enabled: true
    });

let options = require('./options/options.json'),
    CommandLoader = require('./utils/CommandLoader.js'),
    processCmd = require('./utils/CommandHandler.js'),
    games = require('./lists/games.json'),
    alias = require('./options/alias.json'),
    bot = new Eris(options.token, {
        getAllUsers: true,
        messageLimit: 5,
        autoReconnect: true,
        disableEveryone: true,
        maxShards: options.shards,
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
    if (msg.author.bot || !msg.channel.guild) return;
    else {
        if (msg.content.split(" ")[0] === "sudo" && msg.author.id === "87600987040120832") evalText(msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2));
        if (msg.content.startsWith('<@' + bot.user.id + '>')) msg.content = msg.content.replace("<@" + bot.user.id + ">", msgPrefix + "chat");
        if (msg.content.startsWith(options.prefix + "prefix")) processCmd(bot, msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2), "prefix", options.prefix);
        else if (msg.content === "pls reload" && admins.indexOf(msg.author.id) > -1) reloadAll(msg);
        else if (msg.content.startsWith(options.prefix)) {
            let formatedMsg = msg.content.substring(options.prefix.length, msg.content.length);
            let cmdTxt = formatedMsg.split(" ")[0].toLowerCase();
            if (alias.hasOwnProperty(cmdTxt)) cmdTxt = alias[cmdTxt];
            if (commands.hasOwnProperty(cmdTxt)) processCmd(bot, msg, formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1), cmdTxt);
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
            alias = reload('./options/alias.json');
            admins = reload('./options/admins.json');
            UsageChecker = reload('./utils/UsageChecker.js')
        } catch (e) {
            console.error("Failed to reload! Error: ", e);
        }
        CommandLoader.load().then(() => {
            bot.createMessage(msg.channel.id, "🆗");
            bot.deleteMessage(msg.channel.id, msg.id);
            console.log(botC("@" + bot.user.username) + errorC(" All Modules Reloaded"));
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

bot.on("error", err => {
    console.log(botC("@" + bot.user.username) + " - " + errorC("ERROR:\n" + err.stack));
})

bot.on("disconnect", () => {
    console.log(botC("@" + bot.user.username) + " - " + errorC("DISCONNECTED"));
    process.exit(0);
})

bot.on('shardResume', id => {
    console.log(botC("@" + bot.user.username) + " - " + warningC("SHARD #" + id + "RECONNECTED"));
})

bot.on("shardDisconnect", (error, id) => {
    console.log(botC("@" + bot.user.username) + " - " + warningC("SHARD #" + id + "DISCONNECTED"));
    console.log(errorC(error));
})


/*bot.on("debug", err => {
    console.log(botC("@Onee-chan") + " - " + warningC("Debug: " + err));
})*/

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

setInterval(() => {
    bot.shards.forEach((shard) => {
        shard.editGame({
            name: games[Math.floor(Math.random() * (games.length))]
        });
    })
}, 900000);