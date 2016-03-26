var Discord = require("discord.js"), bot = new Discord.Client({forceFetchUsers: true});
var request = require('request');
var options = require("./options/options.json"), prefix = require("./options/options.json").prefixes;
var games = require("./lists/games.json").games;
var defaults = require("./bot_modules/Defaults.js").defaults;
var CmdHandler = require("./CommandHandler.js").Commands;
var db = require("./bot_modules/Database.js");
var chalk = require("chalk"), c = new chalk.constructor({enabled: true});
var serverC = c.black.bold, channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;
var tablesUnFlipped = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"]
var welcome = [];
var pg = require('pg');

pg.on('error', function() {console.log("Error with Database");})

bot.on("ready", function (){bot.setPlayingGame("Use -help for info");console.log(botC("@WishBot")+" - Ready! | Channels: " + channelC(bot.channels.length) + " | Servers: "+serverC(bot.servers.length)+" | Users: "+userC(bot.users.length)); serverPost();})

bot.on("message", function (msg) {
	if(msg.author === bot.user || msg.channel.isPrivate) return;
	else if((/[a-z]/i.test(msg.content[0]) == false) && msg.channel.server){
	db.Settings(msg, function(loadedEntity) {
	if((msg.content == "(╯°□°）╯︵ ┻━┻" || msg.content === "/tableflip") && msg.author.id != bot.user.id){bot.sendMessage(msg, tablesUnFlipped[Math.floor(Math.random() * (tablesUnFlipped.length))])}
	var suffix = msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2);
	if(msg.content.indexOf(bot.user.mention()) == 0){CmdHandler(bot, msg, suffix, loadedEntity); return;}
	else if (msg.content[0] === prefix[1]) {CmdHandler(bot, msg, suffix); return;}
	else if (loadedEntity && msg.content[0] === loadedEntity.Prefix){CmdHandler(bot, msg, suffix, loadedEntity); return;}
	else if (!loadedEntity && prefix.indexOf(msg.content[0]) == 0) {CmdHandler(bot, msg, suffix); return;}
	else if (msg.content.split(" ")[0] === "1nfo"){console.log(loadedEntity);}
	else if (msg.content.split(" ")[0] === "$$eval$$" && msg.author.id === "87600987040120832"){things(msg, suffix);}
});
}
});

bot.on("serverCreated", function (server){
	welcome.push("Hello!\nI'm **WishBot**, better known as "+bot.user+".\nI was written by **Mᴉsɥ** using *Discord.js.*")
	welcome.push("My \"server\" can be found by using `-server`.\nFor information on what I can do use `-help`")
	welcome.push("Thanks!")
	bot.sendMessage(server.defaultChannel, welcome)
	console.log(serverC("@"+server.name+":")+channelC(" #" + server.defaultChannel.name) + ": " + userC("@WishBot") + " - Joined Server!")
	console.log(botC("@WishBot")+" - Channels: " + channelC(bot.channels.length) + " | Servers: "+serverC(bot.servers.length));
	welcome = [];
});

function serverPost(){
	request.post({
		"url": "https://www.carbonitex.net/discord/data/botdata.php",
		"headers": {"content-type": "application/json"},
		"json": true,
		body: {
			"key": process.env.carbon_key,
			"servercount": bot.servers.length
		}
	},(error, response, body)=>{
		if(!error) console.log(botC("@WishBot")+" Successfully posted "+serverC(bot.servers.length)+" Servers to Carbon.");
		else console.log(errorC("Failed to post Servers to Carbon"));
	});
}

function things(msg, suffix) {
	var result;
	try { result = eval("try{"+suffix+"}catch(err){console.log(errorC(\" ERROR \")+err);bot.sendMessage(msg, \"```\"+err+\"```\");}");}
	catch (e) { console.log(errorC("ERROR") + e); bot.sendMessage(msg, "```" + e + "```"); }
	if (result && typeof result !== "object") {bot.sendMessage(msg, result);}
}

if(!options.private){bot.loginWithToken(options.token);console.log(warningC("Logged in using "+botC("Token")));}
else{bot.loginWithToken(process.env.token);console.log(warningC("Logged in using "+botC("Token")));}

setInterval(()=>{serverPost()}, 3600000);


setInterval(() => {bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))])}, 333333);
