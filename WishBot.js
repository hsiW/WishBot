var Discord = require("discord.js"), bot = new Discord.Client({forceFetchUsers: true, maxCachedMessages: 5});
var request = require('request');
var options = require("./options/options.json"), prefix = require("./options/options.json").prefixes;
var games = require("./lists/games.json").games;
var CmdHandler = require("./CommandHandler.js").Commands;
var db = require("./bot_modules/Database.js");
var chalk = require("chalk"), c = new chalk.constructor({enabled: true});
var serverC = c.black.bold, channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;
var tablesUnFlipped = ["┬─┬﻿ ︵ /(.□. \\\\)", "┬─┬ノ( º _ ºノ)", "┬─┬﻿ ノ( ゜-゜ノ)", "┬─┬ ノ( ^_^ノ)", "┬──┬﻿ ¯\\\\_(ツ)", "(╯°□°）╯︵ /(.□. \\\\)"]
var welcome = [];
var admins = require("./options/admins.json").admins;
var pg = require('pg');
var gotMessage = 0;

pg.on('error', function() {console.log("Error with Database");})

bot.on("ready", function (){
	bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]);
	console.log(botC("@WishBot")+" - Ready!");
})

bot.on("message", msg => {
	gotMessage = 1;
	if(msg.author === bot.user || msg.channel.isPrivate) return;
	else if((/[a-z]/i.test(msg.content[0]) == false) && msg.channel.server){
		if((msg.content == "(╯°□°）╯︵ ┻━┻") && msg.author.id != bot.user.id){bot.sendMessage(msg, tablesUnFlipped[Math.floor(Math.random() * (tablesUnFlipped.length))]); return;}
		db.Settings(msg, function(loadedEntity) {
			var suffix = msg.content.substring((msg.content.split(" ")[0].substring(1)).length + 2);
			if(msg.content.indexOf(bot.user.mention()) == 0) CmdHandler(bot, msg, suffix, loadedEntity);
			else if (msg.content.split(" ")[0] === "-=eval" && msg.author.id === "87600987040120832") things(msg, suffix);
			else if (msg.content === "-prefix") CmdHandler(bot, msg, suffix);
			else if (msg.content[0] === prefix[1] && (admins.indexOf(msg.author.id) > -1)) CmdHandler(bot, msg, suffix);
			else if (loadedEntity && msg.content[0] === loadedEntity.Prefix) CmdHandler(bot, msg, suffix, loadedEntity);
			else if (!loadedEntity && prefix.indexOf(msg.content[0]) == 0) CmdHandler(bot, msg, suffix);
		});
	}
});

bot.on("serverDeleted", server =>{
	console.log(serverC("@"+server.name+": ")+botC("@WishBot")+" - "+errorC("Left Server"));
})

bot.on("serverCreated", server =>{
	console.log(serverC("@"+server.name+": ")+botC("@WishBot")+" - "+errorC("Joined Server"));
})

bot.on("error", err =>{
	console.log(botC("@WishBot")+" - "+errorC("ERROR: "+err));
})

bot.on("warn", warn =>{
	console.log(botC("@WishBot")+" - "+warningC("Warning: "+warn));
})

function serverPost(){
	request.post({
		"url": "https://www.carbonitex.net/discord/data/botdata.php",
		"headers": {"content-type": "application/json"},
		"json": true,
		body: {
			"key": options.carbon_key,
			"servercount": bot.servers.length
		}
	},(error, response, body)=>{
		if(!error){
			console.log(botC("@WishBot")+" Successfully posted "+serverC(bot.servers.length)+" Servers to Carbon.");
			delete require.cache[require.resolve("discord.js")];
			Discord = require("discord.js");
			bot = new Discord.Client({forceFetchUsers: true, maxCachedMessages: 5});
		}
		else console.log(errorC("Failed to post Servers to Carbon"));
	});
}

function things(msg, suffix) {
	var result;
	try { result = eval("try{"+suffix+"}catch(err){console.log(errorC(\" ERROR \")+err);bot.sendMessage(msg, \"```\"+err+\"```\");}");}
	catch (e) { console.log(errorC("ERROR") + e); bot.sendMessage(msg, "```" + e + "```"); }
	if (result && typeof result !== "object") {bot.sendMessage(msg, result);}
}

bot.on("disconnected", ()=>
process.exit(0);
)

bot.loginWithToken(options.token);console.log(warningC("Logged in using "+botC("Token")));

if(options.carbon_key !== ""){
	setInterval(()=> serverPost(), 3600000);
}
setInterval(function(){
	if(gotMessage === 0){
		process.exit(0);
	}
	else {
		gotMessage = 0;
	}
}, 600000);

setInterval(() => bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))]), 333333);
