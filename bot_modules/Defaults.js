var prefix = require("./../options/options.json").prefixes;
var alias = require("./../options/alias.json");
var db = require("./Database.js");
var admins = require("./../options/admins.json").admins;

var defaults = {
  "alias": {
    usage: "Prints out a list of Command Aliases.",
		delete: true,
    cooldown: 10,
		process: function (bot, msg){
			var msgArray = ["The following are the current command aliases:\n```ruby"];
			Object.keys(alias).sort().forEach(function (ali){msgArray.push(alias[ali]+": "+ali);});
			msgArray.push("```\n```ruby\n[command]: [command alias]```\nIf you would like to suggest a new alias please use the `-request` command.")
			bot.sendMessage(msg.author, msgArray);
		}
	},
  "changelog": {
    usage: "Prints out the last 5 changes for this bot.",
		delete: true,
    cooldown: 10,
		process: function (bot, msg) {
			bot.getChannelLogs("143904176613752832", 5, function (error, messages) {
				if (error) {console.log("there was an error getting the logs"); return;}
				else {
					var msgArray = ["__**Changelog**__\n"];
					for (i = 4; i >= 0; i--) {
						msgArray.push(messages[i]);
						if(i != 0){msgArray.push("━━━━━━━━━━━━━━━━━━━");}
					}
					bot.sendMessage(msg.author, msgArray)
				}
			});
		}
	},
  "about": {
    usage: "Gives you basic information about this bot.",
		delete: true,
    cooldown: 30,
		process: function (bot, msg) {
			var msgArray = [];
			msgArray.push("Hello!")
			msgArray.push("I'm **WishBot**, better known as "+bot.user+".")
			msgArray.push("I was written by **M!sɥ** using *Discord.js*, a Javascript Lib.")
			msgArray.push("My \"server\" can be found by using `-server`.")
			msgArray.push("For information on what I can do use `-help`")
      msgArray.push("My source code can be found here:")
      msgArray.push("<https://github.com/hsiw/Wishbot>")
			msgArray.push("Thanks!")
			bot.sendMessage(msg, msgArray)
		}
	},
  "modules": {
    usage: "Lists Currently Enabled/Disabled Modules as well as what each does.",
		delete: true,
    cooldown: 15,
		process: function (bot, msg) {
      var enabled = ["__**Enabled Module(s):**__\n"];
      var disabled = ["\n__**Disabled Module(s):**__\n"];
      enabled.push("**Default** - *Enabled by Default*")
      db.Settings(msg, function(loadedEntity) {
        if(!loadedEntity)
        {
          enabled.push("**Cleverbot** - *Talk to "+bot.user.name+"*");
          enabled.push("**WordPlay** - *Use and Manipulate Words*");
          enabled.push("**Interactions** - *Interact with Other Members*");
          enabled.push("**Searches** - *Search Sites for Info or Data*");
          enabled.push("**Utilities** - *Basic Utility Commands*");
          enabled.push("**Misc** - *Miscellaneous Commands*");
          enabled.push("**Mod Utilities** - *Utilities for Mods*");
          enabled.push("**Mod Management** - *Basic Moderating Tools*");
        }
        else {
          loadedEntity.Cleverbot ? enabled.push("**Cleverbot** - *Talk to "+bot.user.name+"*") : disabled.push("**Cleverbot** - *Talk to "+bot.user.name+"*");
          loadedEntity.WordPlay ? enabled.push("**WordPlay** - *Use and Manipulate Words*") : disabled.push("**WordPlay** - *Use and Manipulate Words*");
          loadedEntity.Interactions ? enabled.push("**Interactions** - *Interact with Other Members*") : disabled.push("**Interactions** - *Interact with Other Members*");
          loadedEntity.Search ? enabled.push("**Searches** - *Search Sites for Info or Data*") : disabled.push("**Searches** - *Search Sites for Info or Data*");
          loadedEntity.Utilities ? enabled.push("**Utilities** - *Basic Utility Commands*") : disabled.push("**Utilities** - *Basic Utility Commands*");
          loadedEntity.Misc ? enabled.push("**Misc** - *Miscellaneous Commands*") : disabled.push("**Misc** - *Miscellaneous Commands*");
          loadedEntity.Mod ? enabled.push("**Mod Utilities** - *Utilities for Mods*") : disabled.push("**Mod Utilities** - *Utilities for Mods*");
          loadedEntity.Management ? enabled.push("**Mod Management** - *Basic Moderating Tools*") : disabled.push("**Mod Management** - *Basic Moderating Tools*");
          if(loadedEntity.Admin)  enabled.push("**Admin Utilities** - *Bot Admin Only Commands*");
        }
      if(disabled.length === 1){disabled.push("[NONE]")}
      bot.sendMessage(msg,enabled.join('\n')+'\n'+disabled.join('\n'));
    });
    }
	},
  "toggle": {
		usage: "Toggles the currently enabled modules. Not entering a module type with send a message of the options to the message author. Requires the user to have the `manageRoles` premission.\n`toggle [module to toggle]`",
		delete: true,
    cooldown: 5,
		process: function(bot, msg, suffix) {
      if(!suffix){
        var msgArray = ["__**Current Modules:**__"];
        msgArray.push("")
        msgArray.push("Cleverbot");
        msgArray.push("Interactions");
        msgArray.push("Misc");
        msgArray.push("Searches");
        msgArray.push("Utilities");
        msgArray.push("WordPlay");
        msgArray.push("Mod");
        msgArray.push("Management");
        bot.sendMessage(msg.author, msgArray);
      }
      else if(msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1)
      {
        db.toggle(bot, msg, suffix);
      }
      else {
        bot.sendMessage(msg, "This command requires the `manageRoles` premission to be used, Sorry.")
      }
		}
	},
  "uptime": {
    usage: "Prints out the bots current uptime(estimate).",
		delete: true,
    cooldown: 2,
		process: function (bot, msg) {
      bot.sendMessage(msg, "```ruby\nUptime: " + Math.round((bot.uptime / 3600000) % 60) + "h : " + Math.round((bot.uptime / 60000) % 60) + "m : " + Math.round((bot.uptime / 1000) % 60)+"s```")
    }
	},
  "server": {
    usage: "Prints out a link to this bots help/testing server.",
		delete: true,
    cooldown: 20,
		process: function (bot, msg) {bot.sendMessage(msg, "__**"+msg.author.username+"-senpai, heres a invite to my server:**__ https://discord.gg/0lBiROCNVaDaE8rR");}
	},
  "invite": {
    usage: "Prints out a link to invite this bot to your server",
		delete: true,
    cooldown: 20,
		process: function (bot, msg) {bot.sendMessage(msg, "__**"+msg.author.username+"-senpai, heres a link to invite me to your server:**__\nhttps://discordapp.com/oauth2/authorize?&client_id=161620224305528833&scope=bot&permissions=16886814");}
	},
  "prefix": {
    usage: "Prints out the current command prefix.",
		delete: true,
    cooldown: 20,
		process: function (bot, msg) {
      var savedPrefix = prefix[0];
      db.Settings(msg, function(loadedEntity) {
        if(loadedEntity){savedPrefix = loadedEntity.Prefix;}
        var msgArray = ["The current command prefix is: `"+savedPrefix+"`"];
        msgArray.push("\n To change this prefix use `changeprefix`");
        bot.sendMessage(msg, msgArray);
      });
    }
	},
  "changeprefix":{
    cooldown: 15,
    usage: "Changes the current command prefix. Can only be a symbol. Requires the user to have the `manageRoles` premission.\n`changeprefix` [prefix to change to]",
    delete: true,
    process: function(bot, msg, suffix)
    {
      if(suffix.length != 1){
        bot.sendMessage(msg, "Prefix can only be 1 character:\n```ruby\n"+suffix+"```")
        return;
      }
      else if (/[a-z]/i.test(suffix) || suffix === '@')
      {
        bot.sendMessage(msg, "Prefix can not be a letter or @:\n```ruby\n"+suffix+"```");
        return;
      }
      else if (msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) {
        db.prefixChange(bot, msg, suffix);
        return;
      }
      else {
        bot.sendMessage(msg, "This command requires the `manageRoles` premission to be used, Sorry.");
        return;
      }
    }
  },
  "featurerequest":{
    usage: "Sends a feature request to the maker of this bot\n`request [feature to request]`",
		delete: true,
    cooldown: 60,
		process: function (bot, msg, suffix) {
      if(!suffix){return;}
      if(msg.channel.server.id === "153365840274784256"){return;}
      bot.sendMessage(msg, "Your request for \"**"+suffix+"**\" was successfully sent, **"+msg.author.name+"**-senpai.")
      bot.sendMessage("142794318837579777", "__Requested on the server **"+msg.channel.server.name+"** by **"+msg.author.username+"**:__`"+msg.author.id+"`\n"+suffix);
    }
	},
  "ping": {
    cooldown: 5,
    usage: "Pings this bot, useful for checking if the bots working corrently.",
		process: function (bot, msg){
      var processTime = new Date();
      bot.sendMessage(msg, "PONG! | *"+(processTime - msg.timestamp)+" ms*");
    }
	}
}

exports.defaults = defaults;
