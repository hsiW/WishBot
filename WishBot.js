//Imported Libs
const Eris = require('eris');
var options = require('./options/options.json');
var bot = new Eris(options.token, {
    getAllUsers: true,
    messageLimit: 5,
    autoReconnect: true,
    disableEveryone: true,
    maxShards: 1
});

var reloadAll = require('require-reload')(require),
    CommandLoader = require('./utils/CommandLoader.js'),
    processCmd = require('./utils/CommandHandler.js').commandHandler,
    help = require('./utils/CommandHandler.js').help,
    messageMentions = require('./utils/MessageMentions.js'),
    Database = require('./utils/Database.js'),
    games = require('./lists/games.json').games;
chalk = require("chalk");

admins = require('./options/admins.json').admins,
botC = chalk.magenta.bold,
userC = chalk.cyan.bold,
serverC = chalk.black.bold,
channelC = chalk.green.bold,
miscC = chalk.blue.bold;
warningC = chalk.yellow.bold,
errorC = chalk.red.bold;

bot.on("ready", () => {
    bot.shards.forEach((shard) => {
        shard.editGame({
            name: games[Math.floor(Math.random() * (games.length))]
        });
    })
    console.log(botC(bot.user.username + " is now Ready."));
    console.log("Users: " + userC(bot.users.size) + " | Channels: " + channelC(Object.keys(bot.channelGuildMap).length) + " | Servers: " + serverC(bot.guilds.size))
})

bot.on("messageCreate", msg => {
    if (msg.author.bot || !msg.channel.guild) return;
    else if (msg.mentions && msg.mentions.indexOf('87600987040120832') > -1) messageMentions(bot, msg);
    else {
        if (msg.content.split(" ")[0] === "sudo" && msg.author.id === "87600987040120832") evalText(msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2));
        else if (msg.content === "pls reload" && msg.author.id === "87600987040120832") reload(msg);
        else if (msg.content.startsWith(options.prefix) && msg.author.id === '87600987040120832') {
            var formatedMsg = msg.content.substring(options.prefix.length, msg.content.length);
            var cmdTxt = formatedMsg.split(" ")[0].toLowerCase();
            if (commands.hasOwnProperty(cmdTxt)) processCmd(bot, msg, formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1), cmdTxt);
            else if (cmdTxt === "help") help(bot, msg);
        }
    }
});

function reload(msg) {
    try {
        delete commands;
        try {
            processCmd = reloadAll('./utils/CommandHandler.js').commandHandler;
            reloadAll.emptyCache('./utils/CommandLoader.js');
            CommandLoader = require('./utils/CommandLoader.js');
        } catch (e) {
            console.error("Failed to reload! Error: ", e);
        }
        CommandLoader.load().then(() => {
            bot.createMessage(msg.channel.id, "🆗");
            bot.deleteMessage(msg.channel.id, msg.id);
            console.log(errorC("All Modules Reloaded"));
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
    var result;
    try {
        result = eval("try{" + suffix + "}catch(err){console.log(\" ERROR \"+err);bot.createMessage(msg.channel.id, \"```\"+err+\"```\");}");
    } catch (e) {
        console.log("ERROR" + e);
        bot.createMessage(msg.channel.id, "```" + e + "```");
    }
    if (result && typeof result !== "object") bot.createMessage(msg.channel.id, result);
    else if (result && typeof result === "object") bot.createMessage(msg.channel.id, "```xl\n" + result + "```");
}

bot.on("error", err => {
    console.log(botC("@Onee-chan") + " - " + errorC("ERROR:\n" + err.stack));
})

bot.on("disconnect", () => {
    console.log(botC("@Onee-chan") + " - " + errorC("DISCONNECTED"));
    process.exit(0);
})

/*
bot.on("debug", err => {
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