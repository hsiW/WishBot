//Imported Libs
const Eris = require('eris');
var options = require('./options/options.json');
var bot = new Eris(options.token, {
    getAllUsers: true,
    messageLimit: 5,
    autoReconnect: true,
    disableEveryone: true,
    maxShards: 8
});
var chalk = require("chalk"),
    c = new chalk.constructor({
        enabled: true
    });
var request = require('request');

//Options Stuff
var alias = require('./options/alias.json');
admins = require('./options/admins.json').admins;

//Lib Things
var processCmd = require('./CommandHandler.js').commandHandler;
var Admin = require('./bot_modules/Admin.js');
var Custom = require('./bot_modules/Custom.js');
var Cleverbot = require("./bot_modules/Cleverbot.js");
Database = require('./bot_modules/Database.js');
var Defaults = require('./bot_modules/Defaults.js');
var Ignored = require('./bot_modules/Ignored.js');
var Interactions = require('./bot_modules/Interactions.js');
var Misc = require('./bot_modules/Misc.js');
var Mod = require('./bot_modules/Mod.js');
var Search = require('./bot_modules/Search.js');
var Utilities = require('./bot_modules/Utilities.js');
var WordPlay = require('./bot_modules/WordPlay.js');

//Variable things I Use
serverC = c.black.bold, channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;
var tablesUnFlipped = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"]
Commands = {};
Object.assign(Commands, Admin.admin, Cleverbot.chatbot, Defaults.defaults, Interactions.interactions, Misc.misc, Mod.mod, Search.searches, Utilities.utilities, WordPlay.words, Custom.custom);
var msgPrefix;
var welcome = '';

bot.on("ready", () => {
    bot.shards.forEach((shard) => {
        shard.editGame({
            name: "#" + shard.id + " | " + shard.guildCount + " in Shard"
        });
    })
    console.info(botC("@Onee-chan") + " - Ready!");
    Database.checkInactivity(bot);
})

bot.on("messageCreate", msg => {
    if (msg.author.bot || !msg.channel.guild || ignoredUsers.hasOwnProperty(msg.author.id)) return;
    else if (msg.content == "(╯°□°）╯︵ ┻━┻") {
        if (serverSettings.hasOwnProperty(msg.channel.guild.id) && serverSettings[msg.channel.guild.id]["unflip"] === false) return;
        else bot.createMessage(msg.channel.id, tablesUnFlipped[Math.floor(Math.random() * (tablesUnFlipped.length))]);
    } else {
        serverSettings.hasOwnProperty(msg.channel.guild.id) && serverSettings[msg.channel.guild.id].hasOwnProperty("Prefix") ? msgPrefix = serverSettings[msg.channel.guild.id]["Prefix"] : msgPrefix = options.prefix;
        if (msg.content.startsWith('<@' + bot.user.id + '>')) msg.content = msg.content.replace("<@" + bot.user.id + ">", msgPrefix + "chat");
        if (msg.content.startsWith(options.prefix + "prefix")) processCmd(bot, msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2), "prefix", options.prefix);
        else if (msg.content === options.prefix + "reload" && admins.indexOf(msg.author.id) > -1) reload(msg);
        else if (msg.content.startsWith(msgPrefix)) {
            var formatedMsg = msg.content.substring(msgPrefix.length, msg.content.length);
            var cmdTxt = formatedMsg.split(" ")[0].toLowerCase();
            if (alias.hasOwnProperty(cmdTxt)) cmdTxt = alias[cmdTxt];
            if (Commands.hasOwnProperty(cmdTxt)) processCmd(bot, msg, formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1), cmdTxt, msgPrefix);
        }
    }
});

bot.on("guildDelete", server => {
    serverPost();
    console.log(serverC("@" + server.name + ": ") + botC("@WishBot") + " - " + errorC("Left Server"));
    Database.remove(server);
    Custom.remove(server);
})

bot.on("guildCreate", server => {
    serverPost();
    console.log(serverC("@" + server.name + ": ") + botC("@WishBot") + " - " + errorC("Joined Server"));
    welcome += "Hello!\nI'm **WishBot**, better known as " + bot.user.username + ".\nI was written by **Mᴉsɥ** using *Discord.js.*";
    welcome += "My \"server\" can be found by using `-server`.\nFor information on what I can do use `-help`";
    welcome += "Thanks!";
    bot.createMessage(server.id, welcome)
    welcome = '';
})

bot.on("guildMemberAdd", function(server, user) {
    if (serverSettings.hasOwnProperty(server.id) && serverSettings[server.id].hasOwnProperty("welcome")) bot.createMessage(server.id, "Welcome <@" + user.id + "> to **" + server.name + "**!");
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
            "servercount": bot.guilds.size
        }
    }, (error, response, body) => {
        if (!error) console.log(botC("@WishBot") + " Successfully posted " + serverC(bot.guilds.size) + " Servers to Carbon.");
        else console.log(errorC("Failed to post Servers to Carbon"));
    });
}

function reload(msg) {
    try {
        delete require.cache[require.resolve('./options/alias.json')];
        delete require.cache[require.resolve('./CommandHandler.js')];
        delete require.cache[require.resolve('./bot_modules/Admin.js')];
        delete require.cache[require.resolve('./bot_modules/Custom.js')];
        delete require.cache[require.resolve('./bot_modules/Cleverbot.js')];
        delete require.cache[require.resolve('./bot_modules/Database.js')];
        delete require.cache[require.resolve('./bot_modules/Defaults.js')];
        delete require.cache[require.resolve('./bot_modules/Ignored.js')];
        delete require.cache[require.resolve('./bot_modules/Interactions.js')];
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
        Misc = require('./bot_modules/Misc.js');
        Mod = require('./bot_modules/Mod.js');
        Search = require('./bot_modules/Search.js');
        Utilities = require('./bot_modules/Utilities.js');
        WordPlay = require('./bot_modules/WordPlay.js');
        alias = require('./options/alias.json');
        Commands = {};
        Object.assign(Commands, Admin.admin, Cleverbot.chatbot, Defaults.defaults, Interactions.interactions, Misc.misc, Mod.mod, Search.searches, Utilities.utilities, WordPlay.words, Custom.custom);
        bot.createMessage(msg.channel.id, "🆗");
        bot.deleteMessage(msg.channel.id, msg.id);
        console.log(botC("@WishBot") + " - " + errorC("All Modules Reloaded") + " by " + userC(msg.author.username));
    }
    catch(err){
        bot.createMessage(msg.channel.id, "```"+err+"```")
        console.log(errorC(err.stack))
    }
}

bot.on("error", err => {
    console.log(botC("@Onee-chan") + " - " + errorC("ERROR:\n" + err.stack));
})
/*
bot.on("debug", err => {
    console.log(botC("@Onee-chan") + " - " + warningC("Debug: " + err));
})
*/
bot.connect().then(console.log(warningC("Logged in with " + botC("Token")))).catch(err => console.log(errorC(err.stack)));

setInterval(() => Database.checkInactivity(bot), 21600000);

var interruptedAlready = false;
process.on('SIGINT ', function() {
    if (interruptedAlready) {
        console.log(errorC("Caught second interrupt signal... Exiting"));
        process.exit(1);
    }
    interruptedAlready = true;
    console.log(warningC("Caught interrupt signal... Disconnecting"));
    bot.disconnect();
});