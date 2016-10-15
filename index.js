const Eris = require('eris'), //The bot's api library
    chalk = require('chalk'), //Used to make the console have pretty colours
    fs = require('fs'), //For reading/writing to a file
    axios = require('axios'), //HTTP client for requests to and from websites
    options = require('./options/options.json'),
    CommandLoader = require('./utils/CommandLoader.js'),
    utils = require('./utils/utils.js'),
    Database = require('./utils/Database.js'),
    //List of playing status's for the bot to use
    playing = require('./lists/playing.json'),
    processCmd = require('./utils/CommandHandler.js'),
    UsageChecker = require('./utils/UsageChecker.js'),
    //This isn't normally needed but PM2 doesn't work with chalk unless I do this
    colour = new chalk.constructor({
        enabled: true
    }),
    //Unflipped tables for use with the auto-table-unfipper
    unflippedTables = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"];

let urls = ['https://www.twitch.tv/winningthewaronpants'], //Twitch URLS the bot pulls from to link to in the Streaming Status
    //Bot Constructor Creation - https://abal.moe/Eris/Client.html
    bot = new Eris(options.token, {
        getAllUsers: true,
        messageLimit: 0,
        maxShards: 4,
        autoReconnect: true,
        disableEveryone: true,
        disabledEvents: {
            VOICE_STATE_UPDATE: true,
            TYPING_START: true,
            GUILD_EMOJI_UPDATE: true,
            GUILD_INTEGRATIONS_UPDATE: true,
            GUILD_BAN_ADD: true,
            GUILD_BAN_REMOVE: true,
            MESSAGE_UPDATE: true,
            CHANNEL_CREATE: true,
            CHANNEL_DELETE: true
        }
    });

//Make Promises faster and more efficent by using BlueBirds Implmentation of them
global.Promise = require('bluebird'),
//Console Log Colours
botC = colour.magenta.bold,
userC = colour.cyan.bold,
serverC = colour.black.bold,
channelC = colour.green.bold,
miscC = colour.blue.bold,
warningC = colour.yellow.bold,
errorC = colour.red.bold;

//Ready Event
bot.on("ready", () => {
    //Sets the status's of every shard seperately
    bot.shards.forEach((shard) => {
        shard.editStatus({
            name: playing[~~(Math.random() * (playing.length))], //Picks a random playing status
            type: 1,
            url: urls[~~(Math.random() * (urls.length))] //Picks a random URL
        });
    })
    //This stuff below is sent to the console when the bot is ready
    console.log(botC(bot.user.username + " is now Ready."));
    console.log('Current # of Commands Loaded: ' + warningC(Object.keys(commands).length))
    console.log("Users: " + userC(bot.users.size) + " | Channels: " + channelC(Object.keys(bot.channelGuildMap).length) + " | Servers: " + serverC(bot.guilds.size))
    //Run inactivity checker and output the number of inactive servers
    UsageChecker.checkInactivity(bot).catch(err => console.log(errorC(err)));
})

//On Message Creation Event
bot.on("messageCreate", msg => {
    //If bot isn't ready or if the message author is a bot who isn't Kimi do nothing with the message
    if (!bot.ready || (msg.author.bot && msg.author.id !== "174669219659513856")) return;
    else if (msg.author.id !== '87600987040120832') return;
    else {
        //If used in guild and the guild has a custom prefix set the msgPrefix as such otherwise grab the default prefix
        let msgPrefix = msg.channel.guild && Database.checkPrefix(msg.channel.guild) != undefined ? Database.checkPrefix(msg.channel.guild) : options.prefix;
        //Use Eval on the message if it starts with sudo and used by Mei
        if (msg.content.split(" ")[0] === "sudo" && msg.author.id === "87600987040120832") {
            evalText(msg, msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2));
            return;
        }
        //If stuff that isn't a command is used in a PM treat it as using cleverbot by adding the correct prefix as well as the 'chat' command text to the message
        if (!msg.channel.guild && !msg.content.startsWith(options.prefix)) msg.content = msgPrefix + "chat " + msg.content;
        //If used in a Guild
        if (msg.channel.guild) {
            //If Message is a tableFlip and the Guild has tableflip(tableunflip) on return an unflipped table
            if (msg.content === "(╯°□°）╯︵ ┻━┻") Database.checkSetting(msg.channel.guild, 'tableflip').then(() => bot.createMessage(msg.channel.id, tablesUnFlipped[~~(Math.random() * (unflippedTables.length))])).catch(err => utils.fileLog(err))
                //Check if message starts with a bot user mention and if so replace with the correct prefix and the 'chat' command text
            if (msg.content.replace(/<@!/g, "<@").startsWith(bot.user.mention)) msg.content = msg.content.replace(/<@!/g, "<@").replace(bot.user.mention, msgPrefix + "chat");
            //Prefix command override so that prefix can be used with the default command prefix to prevent forgotten prefixes
            if (msg.content.startsWith(options.prefix + "prefix")) msg.content = msg.content.replace(options.prefix, msgPrefix)
        }
        //If the message stats with the set prefix
        if (msg.content.startsWith(msgPrefix)) {
            let formatedMsg = msg.content.substring(msgPrefix.length, msg.content.length), //Format message to remove command prefix
                cmdTxt = formatedMsg.split(" ")[0].toLowerCase(), //Get command from the formated message
                args = formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1); //Get arguments from the formated message
            if (cmdTxt === 'channelmute') processCmd(msg, args, commands[cmdTxt], bot); //Override channelCheck if cmd is channelmute to unmute a muted channel
            //Check if a Command was used and runs the corresponding code depending on if it was used in a Guild or not, if in guild checks for muted channel and disabled command
            else if (commands.hasOwnProperty(cmdTxt) && msg.channel.guild) processCmd(msg, args, commands[cmdTxt], bot) //Database.checkChannel(msg.channel).then(() => Database.checkCommand(msg.channel.guild, cmdTxt).then(() => processCmd(bot, msg, formatedMsg.substring((formatedMsg.split(" ")[0]).length + 1), cmdTxt))).catch(console.log);
            else if (commands.hasOwnProperty(cmdTxt) && !msg.channel.guild) processCmd(msg, args, commands[cmdTxt], bot)
        }
    }
});


function evalText(msg, suffix) {
    let result;
    //Trys to run eval on the text and output either an error or the result if applicable 
    try {
        result = eval("try{" + suffix + "}catch(err){utils.fileLog(err);bot.createMessage(msg.channel.id, \"```\"+err+\"```\");}");
    } catch (e) {
        utils.fileLog(e);
        bot.createMessage(msg.channel.id, "```" + e + "```");
    }
    if (result && typeof result !== "object") bot.createMessage(msg.channel.id, result);
    else if (result && typeof result === "object") bot.createMessage(msg.channel.id, "```xl\n" + result + "```");
}

//New Guild Member Event
bot.on("guildMemberAdd", (guild, member) => {
    //Checks to make sure guild and a member was sent
    if (guild && member) {
        //Checks to see if the guild has a welcome set and if so replaces the correct strings with the correct info
        Database.checkSetting(guild, 'welcome').then(response => {
            let message = response.response.replace(/\[GuildName]/g, guild.name).replace(/\[ChannelName]/g, guild.channels.get(response.channel.toString()).name).replace(/\[ChannelMention]/g, guild.channels.get(response.channel.toString()).mention).replace(/\[UserName]/g, member.user.username).replace(/\[UserMention]/g, member.user.mention);
            bot.createMessage(response.channel, message);
        }).catch(err => utils.fileLog(err));
    }
})

//Guild Member Left Event
bot.on("guildMemberRemove", (guild, member) => {
    //Checks to make sure guild and a member was sent
    if (guild && member) {
        //Checks to see if the guild has a leave set and if so replaces the correct strings with the correct info
        Database.checkSetting(guild, 'leave').then(response => {
            let message = response.response.replace(/\[GuildName]/g, guild.name).replace(/\[ChannelName]/g, guild.channels.get(response.channel.toString()).name).replace(/\[ChannelMention]/g, guild.channels.get(response.channel.toString()).mention).replace(/\[UserName]/g, member.user.username);
            bot.createMessage(response.channel, message)
        }).catch(err => utils.fileLog(err))
    }
})

//Guild Joined Event
bot.on('guildCreate', () => postGuildCount())

//Guild Left Event
bot.on('guildDelete', guild => {
    postGuildCount()
    //Remove Guild from Database
    Database.removeGuild(guild).catch(err => utils.fileLog(err))
})

//Load Commands then Connect(Logs any errors to console and file)
CommandLoader.load().then(() => {
    bot.connect().then(console.log(warningC("Logged in using Token")))
}).catch(err => utils.fileLog(err));

//Posts Guild Count to Discord Bots and Carbonitex
function postGuildCount() {
    //Check that the bot is ready so premature guild creates won't cause a crash
    if (bot.ready) {
        //Post Guild Count to Discord Bots and if error log to file and console
        axios({
            method: 'post',
            url: "https://bots.discord.pw/api/bots/" + bot.user.id + "/stats",
            headers: {
                "Authorization": options.bot_key,
                "content-type": "application/json"
            },
            data: {
                "server_count": bot.guilds.size
            }
        }).catch(err => utils.fileLog(err));
        //Post Guild Count to Carbonitex and if error log to file and console
        axios({
            method: 'post',
            url: "https://www.carbonitex.net/discord/data/botdata.php",
            headers: {
                "content-type": "application/json"
            },
            data: {
                "key": options.carbon_key,
                "servercount": bot.guilds.size
            }
        }).catch(err => utils.fileLog(err));
    }
}

//Changes the bots status every 10mins
setInterval(() => {
    bot.shards.forEach((shard) => {
        shard.editStatus({
            name: playing[~~(Math.random() * (playing.length))],
            type: 1,
            url: urls[~~(Math.random() * (urls.length))]
        });
    })
}, 6e+5);

//Changes the bots avatar every 2hrs
setInterval(() => {
    //Reads avatar directory and randomly picks an avatar to switch to
    fs.readdir(`${__dirname}/avatars/`, (err, files) => {
        let avatar = files[~~(Math.random() * (files.length))];
        //Reads the avatar image file and changes the bots avatar to it
        fs.readFile(`${__dirname}/avatars/${avatar}`, (err, image) => {
            let data = "data:image/jpg;base64," + image.toString('base64');
            bot.editSelf({
                avatar: data
            }).then(() => console.log(botC('Changed avatar to ' + avatar))).catch(err => utils.fileLog(err));
        })
    });
}, 7.2e+6);

//Bot Error Event
bot.on("error", err => utils.fileLog(err)) //Logs error to file and console

//Bot Warn Event(Outputs issues that aren't major)
bot.on("warn", (warn, id) => {
    console.log(warningC(warn, id));
})

//Debug event only used to find errors and usually disabled
//bot.on("debug", console.log)

//Shard Resume Event
bot.on('shardResume', id => {
    console.log(botC("@" + bot.user.username) + " - " + warningC("SHARD #" + id + "RECONNECTED"));
})

//Shard Disconnect Event
bot.on("shardDisconnect", (err, id) => {
    console.log(botC("@" + bot.user.username) + " - " + warningC("SHARD #" + id + "DISCONNECTED"));
    utils.fileLog(err); //Logs reason/error to file and console
})

//Whole Bot Disconnect Event
bot.on("disconnect", err => {
    console.log(botC("@" + bot.user.username) + " - " + errorC("DISCONNECTED"));
    utils.fileLog(err); //Logs Disconnect reason/error to file and console
    process.exit(0);
})