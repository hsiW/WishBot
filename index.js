const Eris = require('eris'), //The bot's api library
    colour = new(require('chalk')).constructor({ //Used to make the console have pretty colours
        enabled: true //This isn't normally needed but PM2 doesn't work with chalk unless I do this
    }),
    fs = require('fs'), //For reading/writing to a file
    axios = require('axios'), //HTTP client for requests to and from websites
    reload = require('require-reload')(require);

var options = reload('./options/options.json'),
    commandLoader = reload('./utils/commandLoader.js'),
    utils = reload('./utils/utils.js'),
    database = reload('./utils/database.js'),
    processCmd = reload('./utils/commandHandler.js'),
    usageChecker = reload('./utils/usageChecker.js'),
    playing = reload('./lists/playing.json'), //List of playing status's for the bot to use
    //Unflipped tables for use with the auto-table-unfipper
    unflippedTables = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"],
    urls = ['https://www.twitch.tv/winningthewaronpants'], //Twitch URLS the bot pulls from to link to in the Streaming Status
    //Bot Constructor Creation check https://abal.moe/Eris/docs/Client for more info
    bot = new Eris(options.token, {
        getAllUsers: true,
        messageLimit: 0,
        maxShards: 8, //Set to lower if hosting yourself as 8 is overkill in most cases(its even overkill for Yuki-chan now)
        disableEvents: {
            TYPING_START: true,
            GUILD_EMOJI_UPDATE: true,
            GUILD_INTEGRATIONS_UPDATE: true,
            GUILD_BAN_ADD: true,
            GUILD_BAN_REMOVE: true,
            MESSAGE_UPDATE: true,
            MESSAGE_DELETE: true,
            MESSAGE_DELETE_BULK: true
        }
    });

//Make Promises faster and more efficent by using BlueBirds Implmentation of them
global.Promise = require('bluebird'),
//Console Log Colours
botC = colour.magenta.bold,
userC = colour.cyan.bold,
guildC = colour.black.bold,
channelC = colour.green.bold,
miscC = colour.blue.bold,
warningC = colour.yellow.bold,
errorC = colour.red.bold;

//Ready Event
bot.on("ready", () => {
    //Sets the status's of every shard seperately
    setRandomStatus()
    //This stuff below is sent to the console when the bot is ready
    console.log(`${botC(bot.user.username + ' is now Ready with')} ${errorC(bot.shards.size)} ${botC('Shards.')}`);
    console.log(`Current # of Commands Loaded: ${warningC(Object.keys(commands).length)}`)
    console.log(`Users: ${userC(bot.users.size)} | Channels: ${channelC(Object.keys(bot.channelGuildMap).length)} | Guilds: ${guildC(bot.guilds.size)}`)
    //Run inactivity checker and output the number of inactive servers
    usageChecker.checkInactivity(bot).then(response => console.log(botC(response))).catch(err => console.log(errorC(err)));
})

//On Message Creation Event
bot.on("messageCreate", msg => {
    //If bot isn't ready or if the message author is a bot who isn't Kimi do nothing with the message
    if (!bot.ready || (msg.author.bot && msg.author.id !== "174669219659513856")) return;
    //else if (msg.author.id !== '87600987040120832') return; //Used only if I want to disable the bot for everyone but me while testing/debugging
    else {
        //If used in guild and the guild has a custom prefix set the msgPrefix as such otherwise grab the default prefix
        var msgPrefix = msg.channel.guild && database.getPrefix(msg.channel.guild.id) !== undefined ? database.getPrefix(msg.channel.guild.id) : options.prefix;
        //Use Eval on the message if it starts with sudo and used by Mei
        if (msg.content.split(" ")[0] === "sudo" && msg.author.id === "87600987040120832") {
            evalInput(msg, msg.content.split(" ").slice(1).join(' '));
            return;
        }
        //Hot reload all possible files
        if (msg.content.startsWith(options.prefix + 'reload') && msg.author.id === "87600987040120832") reloadModules(msg);
        //If stuff that isn't a command is used in a PM treat it as using cleverbot by adding the correct prefix as well as the 'chat' command text to the message
        if (!msg.channel.guild && !msg.content.startsWith(options.prefix)) msg.content = msgPrefix + "chat " + msg.content;
        //If used in a Guild
        if (msg.channel.guild) {
            //If bot cannot send messages in the current channel
            if (!msg.channel.permissionsOf(bot.user.id).has('sendMessages')) return;
            //If Message is a tableFlip and the Guild has tableflip(tableunflip) on return an unflipped table
            if (msg.content === "(╯°□°）╯︵ ┻━┻") database.checkSetting(msg.channel.guild.id, 'tableflip').then(() => bot.createMessage(msg.channel.id, unflippedTables[~~(Math.random() * (unflippedTables.length))])).catch(err => utils.fileLog(err));
            //Check if message starts with a bot user mention and if so replace with the correct prefix and the 'chat' command text
            if (msg.content.replace(/<@!/, "<@").startsWith(bot.user.mention)) msg.content = msg.content.replace(/<@!/g, "<@").replace(bot.user.mention, msgPrefix + "chat");
            //Prefix command override so that prefix can be used with the default command prefix to prevent forgotten prefixes
            if ((msg.content.startsWith(options.prefix + 'setprefix') || msg.content.startsWith(options.prefix + 'checkprefix')) && msgPrefix !== options.prefix) msg.content = msg.content.replace(options.prefix, msgPrefix)
        }
        //If the message stats with the set prefix
        if (msg.content.startsWith(msgPrefix)) {
            var formatedMsg = msg.content.substring(msgPrefix.length, msg.content.length), //Format message to remove command prefix
                cmdTxt = formatedMsg.split(" ")[0].toLowerCase(), //Get command from the formatted message
                args = formatedMsg.split(' ').slice(1).join(' '); //Get arguments from the formatted message
            if (commandAliases.hasOwnProperty(cmdTxt)) cmdTxt = commandAliases[cmdTxt]; //If the cmdTxt is an alias of the command
            if (cmdTxt === 'channelmute') processCmd(msg, args, commands[cmdTxt], bot); //Override channelCheck if cmd is channelmute to unmute a muted channel
            //Check if a Command was used and runs the corresponding code depending on if it was used in a Guild or not, if in guild checks for muted channel and disabled command
            else if (commands.hasOwnProperty(cmdTxt)) database.checkChannel(msg.channel.id).then(() => database.checkCommand(msg.channel.guild, cmdTxt).then(() => processCmd(msg, args, commands[cmdTxt], bot)))
        }
    }
});

function evalInput(msg, args) {
    var result;
    //Trys to run eval on the text and output either an error or the result if applicable 
    try {
        result = eval("try{" + args + "}catch(err){console.log(err);msg.channel.createMessage(\"```\"+err+\"```\");}");
    } catch (e) {
        console.log(e)
        msg.channel.createMessage("```" + e + "```");
    }
    //If result isn't undefined and it isn't an object return to channel
    if (result && typeof result !== 'object') msg.channel.createMessage(result);
    console.log(result)
}

//New Guild Member Event
bot.on("guildMemberAdd", (guild, member) => {
    //Checks to make sure guild and a member was sent
    if (guild && member) {
        //Checks to see if the guild has a welcome set
        database.checkSetting(guild.id, 'welcome').then(response => {
            sendGuildMessage(response, guild, member);
        }).catch(err => console.log(errorC(err)));
    }
})

//Guild Member Left Event
bot.on("guildMemberRemove", (guild, member) => {
    //Checks to make sure guild and a member was sent
    if (guild && member) {
        //Checks to see if the guild has a leave set
        database.checkSetting(guild.id, 'leave').then(response => {
            sendGuildMessage(response, guild, member);
        }).catch(err => console.log(errorC(err)))
    }
})

//Replaces the correct strings with the correct variables then sends the message to the channel
function sendGuildMessage(response, guild, member) {
    if (response.channel === '' || (response.channel !== '' && !bot.guilds.get(guild.id).channels.get(response.channel).permissionsOf(bot.user.id).has('sendMessages'))) return;
    else {
        usageChecker.updateTimestamp(guild);
        bot.createMessage(response.channel, response.response.replace(/\[GuildName]/g, guild.name).replace(/\[ChannelName]/g, guild.channels.get(response.channel).name).replace(/\[ChannelMention]/g, guild.channels.get(response.channel).mention).replace(/\[UserName]/g, member.user.username).replace(/\[UserMention]/g, member.user.mention)).catch(err => console.log(errorC('err')));
    }
}

//Guild Joined Event
bot.on('guildCreate', guild => {
    //Post Guild Count
    postGuildCount()
    //Add guild to usageChecker database
    usageChecker.addToUsageCheck(guild.id);
})

//Guild Left Event
bot.on('guildDelete', guild => {
    //Post Guild Count
    postGuildCount()
    //Remove Guild from database and log if error
    database.removeGuild(guild.id).catch(err => utils.fileLog(err))
    //Remove guild from guildPrefix array if it exists in it
    database.removeGuildfromJson(guild.id)
    //Remove from usageChecker database
    usageChecker.removeFromUsageCheck(guild.id);
})

//Load Commands then Connect(Logs any errors to console and file)
commandLoader.load().then(() => {
    bot.connect().then(console.log(warningC('Connecting with Token')))
}).catch(err => utils.fileLog(err));

//Posts Guild Count to Discord Bots and Carbonitex
function postGuildCount() {
    //Check that the bot is ready so premature guild creates won't cause a crash as well as checking if theres a bot/carbon key
    if (bot.ready && options.bot_key !== '' && options.carbon_key !== '') {
        //Post Guild Count to Discord Bots and if error log to file and console
        axios({
            method: 'post',
            url: `https://bots.discord.pw/api/bots/${bot.user.id}/stats`,
            headers: {
                "Authorization": options.bot_key,
                "content-type": "application/json"
            },
            data: {
                "server_count": bot.guilds.size
            }
        }).catch(err => console.log(errorC(err)))
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
        }).catch(err => console.log(errorC(err)));
    }
}

//Set random bot status(includes random game as well as random streaming url)
function setRandomStatus() {
    bot.shards.forEach(shard => {
        shard.editStatus({
            name: playing[~~(Math.random() * (playing.length))],
            type: 1,
            url: urls[~~(Math.random() * (urls.length))]
        });
    })
}

//Hot Reload ALl Modules
function reloadModules(msg) {
    try {
        utils = reload('./utils/utils.js');
        database = reload('./utils/database.js');
        options = reload('./options/options.json');
        processCmd = reload('./utils/commandHandler.js');
        usageChecker = reload('./utils/usageChecker.js');
        commandHandler = reload('./utils/commandHandler.js');
        playing = reload('./lists/playing.json');
        commandLoader.load().then(() => {
            console.log(botC('@' + bot.user.username + ': ') + errorC('Successfully Reloaded All Modules'));
            msg.channel.createMessage('Successfully Reloaded All Modules').then(message => utils.messageDelete(message))
        });
    } catch (e) {
        console.log(errorC('Error Reloading Modules: ' + e))
    }
}

//Changes the bots status every 10mins
setInterval(() => setRandomStatus(), 6e+5);

//Changes the bots avatar every 2hrs
setInterval(() => {
    //Reads avatar directory and randomly picks an avatar to switch to
    fs.readdir(`${__dirname}/avatars/`, (err, files) => {
        if (err) utils.fileLog(err)
        else {
            var avatar = files[~~(Math.random() * (files.length))];
            //Reads the avatar image file and changes the bots avatar to it
            fs.readFile(`${__dirname}/avatars/${avatar}`, (err, image) => {
                if (err) utils.fileLog(err)
                else {
                    bot.editSelf({
                        avatar: `data:image/jpg;base64,${image.toString('base64')}`
                    }).then(() => console.log(botC('Changed avatar to ' + avatar))).catch(err => utils.fileLog(err));
                }
            })
        }
    });
}, 7.2e+6);

//Bot Error Event
bot.on("error", err => utils.fileLog(err)) //Logs error to file and console

//Bot Warn Event(Outputs issues that aren't major)
/*bot.on("warn", (warn, id) => {
    console.log(warningC(warn, id));
})*/

//Debug event only used to find errors and usually disabled
//bot.on("debug", console.log)

//Shard Resume Event
bot.on('shardResume', id => {
    console.log(`${botC("@" + bot.user.username)} - ${warningC("SHARD #" + id + "RECONNECTED")}`);
})

//Shard Disconnect Event
bot.on("shardDisconnect", (err, id) => {
    console.log(`${botC("@" + bot.user.username)} - ${warningC("SHARD #" + id + "DISCONNECTED")}`);
    utils.fileLog(err); //Logs reason/error to file and console
})

//Whole Bot Disconnect Event
bot.on("disconnect", err => {
    console.log(`${botC("@" + bot.user.username)} - ${errorC("DISCONNECTED")}`);
    utils.fileLog(err); //Logs Disconnect reason/error to file and console
    throw 'Bot Disconnected'
})