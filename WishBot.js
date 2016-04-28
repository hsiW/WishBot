//Imported Libs
var Discord = require("discord.js"),
    bot = new Discord.Client({
        forceFetchUsers: true,
        maxCachedMessages: 5,
        autoReconnect: true
    });
var chalk = require("chalk"),
    c = new chalk.constructor({
        enabled: true
    });
var request = require('request');

//Options Stuff
var options = require('require-all')(__dirname + '/options');

//Lists Stuff
var games = require('./lists/games.json').games;

//Lib Things
var processCmd = require('./CommandHandler.js').commandHandler;
var Admin = require('./bot_modules/Admin.js');
var Custom = require('./bot_modules/Custom.js');
var Cleverbot = require("./bot_modules/Cleverbot.js");
Database = require('./bot_modules/Database.js');
var Defaults = require('./bot_modules/Defaults.js');
var Ignored = require('./bot_modules/Ignored.js');
var Interactions = require('./bot_modules/Interactions.js');
var Management = require('./bot_modules/Management.js');
var Misc = require('./bot_modules/Misc.js');
var Mod = require('./bot_modules/Mod.js');
var Search = require('./bot_modules/Search.js');
var Utilities = require('./bot_modules/Utilities.js');
var WordPlay = require('./bot_modules/WordPlay.js');

//Variable things I Use
serverC = c.black.bold, channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;
var tablesUnFlipped = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"]
Commands = {};
Object.assign(Commands, Admin.admin, Cleverbot.chatbot, Defaults.defaults, Interactions.interactions, Management.management, Misc.misc, Mod.mod, Search.searches, Utilities.utilities, WordPlay.words, Custom.custom);
admins = options.admins.admins;
var msgPrefix;
var welcome = [];

bot.on("ready", () => {
    bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
    console.info(botC("@WishBot") + " - Ready!");
    Database.checkInactivity(bot);
})

bot.on("message", msg => {
    if (msg.author.bot || msg.channel.isPrivate || ignoredUsers.hasOwnProperty(msg.author.id)) return;
    else if (msg.content == "(╯°□°）╯︵ ┻━┻") {
        if (serverSettings.hasOwnProperty(msg.channel.server.id) && serverSettings[msg.channel.server.id]["unflip"] === false) return;
        else bot.sendMessage(msg, tablesUnFlipped[Math.floor(Math.random() * (tablesUnFlipped.length))]);
    } else {
        serverSettings.hasOwnProperty(msg.channel.server.id) && serverSettings[msg.channel.server.id].hasOwnProperty("Prefix") ? msgPrefix = serverSettings[msg.channel.server.id]["Prefix"] : msgPrefix = options.options.prefix;
        if (msg.content.indexOf(bot.user.mention()) == 0) msg.content = msg.content.replace("<@" + bot.user.id + ">", msgPrefix + "chat");
        if (msg.content.startsWith(options.options.prefix + "prefix")) processCmd(bot, msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2), "prefix", options.options.prefix);
        else if (msg.content === options.options.prefix + "reload") reload(msg);
        else if (msg.content.startsWith(msgPrefix)) {
            var formatedMsg = msg.content.substring(msgPrefix.length, msg.content.length);
            var cmdTxt = formatedMsg.split(" ")[0].toLowerCase();
            if (options.alias.hasOwnProperty(cmdTxt)) cmdTxt = options.alias[cmdTxt];
            if (Commands.hasOwnProperty(cmdTxt)) processCmd(bot, msg, formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1), cmdTxt, msgPrefix);
        }
    }
});

bot.on("serverDeleted", server => {
    console.log(serverC("@" + server.name + ": ") + botC("@WishBot") + " - " + errorC("Left Server"));
    Database.remove(server);
    Custom.remove(server);
})

bot.on("serverCreated", server => {
    console.log(serverC("@" + server.name + ": ") + botC("@WishBot") + " - " + errorC("Joined Server"));
    welcome.push("Hello!\nI'm **WishBot**, better known as " + bot.user + ".\nI was written by **Mᴉsɥ** using *Discord.js.*")
    welcome.push("My \"server\" can be found by using `-server`.\nFor information on what I can do use `-help`")
    welcome.push("Thanks!")
    bot.sendMessage(server.defaultChannel, welcome)
    welcome = [];
})

bot.on("error", err => {
    console.log(botC("@WishBot") + " - " + errorC("ERROR: " + err));
})

bot.on("serverNewMember", function(server, user) {
    if (serverSettings.hasOwnProperty(server.id) && serverSettings[server.id].hasOwnProperty("welcome"))bot.sendMessage(server.defaultChannel, "Welcome " + user + " to **" + server.name + "**!");  
})

function serverPost() {
    request.post({
        "url": "https://www.carbonitex.net/discord/data/botdata.php",
        "headers": {
            "content-type": "application/json"
        },
        "json": true,
        body: {
            "key": options.carbon_key,
            "servercount": bot.servers.length
        }
    }, (error, response, body) => {
        if (!error) console.log(botC("@WishBot") + " Successfully posted " + serverC(bot.servers.length) + " Servers to Carbon.");
        else console.log(errorC("Failed to post Servers to Carbon"));
    });
}

function reload(msg) {
    delete require.cache[require.resolve('./CommandHandler.js')];
    delete require.cache[require.resolve('./bot_modules/Admin.js')];
    delete require.cache[require.resolve('./bot_modules/Custom.js')];
    delete require.cache[require.resolve('./bot_modules/Cleverbot.js')];
    delete require.cache[require.resolve('./bot_modules/Database.js')];
    delete require.cache[require.resolve('./bot_modules/Defaults.js')];
    delete require.cache[require.resolve('./bot_modules/Ignored.js')];
    delete require.cache[require.resolve('./bot_modules/Interactions.js')];
    delete require.cache[require.resolve('./bot_modules/Management.js')];
    delete require.cache[require.resolve('./bot_modules/Misc.js')];
    delete require.cache[require.resolve('./bot_modules/Mod.js')];
    delete require.cache[require.resolve('./bot_modules/Search.js')];
    delete require.cache[require.resolve('./bot_modules/Utilities.js')];
    delete require.cache[require.resolve('./bot_modules/WordPlay.js')];
    processCmd = require('./CommandHandler.js').commandHandler;
    Admin = require('./bot_modules/Admin.js');
    Custom = require('./bot_modules/Custom.js');
    Cleverbot = require('./bot_modules/Cleverbot.js');
    Database = require('./bot_modules/Database.js');
    Defaults = require('./bot_modules/Defaults.js');
    Ignored = require('./bot_modules/Ignored.js');
    Interactions = require('./bot_modules/Interactions.js');
    Management = require('./bot_modules/Management.js');
    Misc = require('./bot_modules/Misc.js');
    Mod = require('./bot_modules/Mod.js');
    Search = require('./bot_modules/Search.js');
    Utilities = require('./bot_modules/Utilities.js');
    WordPlay = require('./bot_modules/WordPlay.js');
    Commands = {};
    Object.assign(Commands, Admin.admin, Cleverbot.chatbot, Defaults.defaults, Interactions.interactions, Management.management, Misc.misc, Mod.mod, Search.searches, Utilities.utilities, WordPlay.words, Custom.custom);
    bot.sendMessage(msg, "Finished reloading all modules.", function(error, sentMessage) {
        bot.deleteMessage(sentMessage, {
            "wait": 2000
        });
    });
    bot.deleteMessage(msg);
    console.log(botC("@WishBot") + " - " + errorC("All Modules Reloaded") + " by " + userC(msg.author.username));
}

bot.loginWithToken(options.options.token);
console.log(warningC("Logged in using " + botC("Token")));

if (options.carbon_key) {
    setInterval(() => serverPost(), 3600000);
}
setInterval(() => bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]), 333333);
setInterval(() => Database.checkInactivity(bot), 21600000);