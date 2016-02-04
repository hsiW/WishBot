var options = require("./options/options.json");
var games = require("./options/games.json").games;
var Discord = require("discord.js");

var chalk = require("chalk");
var c = new chalk.constructor({enabled: true});

var channelC = c.green.bold;
var userC = c.cyan.bold;
var warningC = c.yellow.bold;
var errorC = c.red.bold;
var botC = c.magenta.bold;

function correctUsage(cmd) {
 var msg = "Usage: " + options.admin_command_prefix + "" + cmd + " " + admin_commands[cmd].usage;
 return msg;
}

var admin_commands = {
 "help": {
  description: "Sends a PM containing all of these Admin Commands.",
  usage: "[command]",
  delete: true,
  process: function(bot, msg, suffix) {
   if (admin_commands[suffix]) {
    bot.sendMessage(msg.author, correctUsage(suffix))
   } else {
    var msgArray = [];
    msgArray.push("**Admin Commands: **");
    msgArray.push("```");
    Object.keys(admin_commands).sort().forEach(function(cmd) {msgArray.push("" + options.admin_command_prefix + "" + cmd + ": " + admin_commands[cmd].description + "")})
    msgArray.push("```");
    bot.sendMessage(msg.author, msgArray);
   }
  }
 },
 "say": {
  usage: "[message]",
  description: "bot says message",
  delete: true,
  process: function(bot, msg, suffix) {bot.sendMessage(msg.channel, suffix)}
 },
 "playing": {
  usage: "[game]",
  description: "allows you to set a game for Onee-chan to play. If nothing specified it will be random.",
  delete: true,
  process: function(bot, msg, suffix) {
   if (suffix) {bot.setPlayingGame(suffix)}
   else {bot.setPlayingGame(games[Math.floor(Math.random() * (games.length))])}
  }
 },
 "restart": {
  usage: "[none]",
  description: "stops the bot",
  delete: true,
  process: function(bot, msg) {
    setTimeout(function() {
     console.log("@WishBot - Restarted bot.");
     process.exit(0);
    }, 1000);
   }
 },
 "setname": {
  usage: "[name]",
  description: "Changes the bots username",
  delete: true,
  process: function(bot, msg, suffix) {
   if (suffix) {bot.setUsername(suffix).then(console.log(channelC("#" + msg.channel.name) + ": " + botC("@WishBot") + " - Username set to " + warningC(suffix) + " by " + userC(msg.author.username)))}
   else {bot.setUsername("Onee-chan").then(console.log(channelC("#" + msg.channel.name) + ": " + botC("@WishBot") + " - Username set to " + warningC("Onee-chan") + " by " + userC(msg.author.username)))}
  }
 },
 "servers": {
  usage: "[none]",
  description: "lists servers bot is connected to",
  delete: true,
  process: function(bot, msg) {
   bot.sendMessage(msg.channel, bot.user + " is currently connected to the following servers:\n ```" + bot.servers + "```")
  }
 }
 /*,
 "eval": {
 	usage: "[command]",
 	description: 'Executes arbitrary javascript in the bot process.',
 	delete: false,
 	process: function(bot,msg,suffix) {
 			bot.sendMessage(msg.channel, eval(suffix,bot));
 	}
 }*/
};

exports.admin_commands = admin_commands;
