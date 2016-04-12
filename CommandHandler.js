var Cleverbot = require("./bot_modules/Cleverbot.js").Clever;
var chatbot = require("./bot_modules/Cleverbot.js").chatbot;
var utilities = require("./bot_modules/Utilities.js").utilities;
var misc = require("./bot_modules/Misc.js").misc;
var admin = require("./bot_modules/Admin.js").admin;
var admins = require("./options/admins.json").admins;
var mod = require("./bot_modules/Mod.js").mod;
var interactions = require("./bot_modules/Interactions.js").interactions;
var words = require("./bot_modules/WordPlay.js").words;
var defaults = require("./bot_modules/Defaults.js").defaults;
var searches = require("./bot_modules/Search.js").searches;
var management = require("./bot_modules/Management.js").management;
var db = require("./bot_modules/Database.js");
var ignoreDB = require("./bot_modules/Ignored.js");
var alias = require("./options/alias.json");
var chalk = require("chalk"), c = new chalk.constructor({enabled: true});
var prefix = require("./options/options.json").prefixes;
var serverC = c.black.bold, channelC = c.green.bold, userC = c.cyan.bold, warningC = c.yellow.bold, errorC = c.red.bold, botC = c.magenta.bold;

var cmdIndex = [];
var cmdUsage = [];
var lastExecTime = {}
setInterval(() => {lastExecTime = {}},3600000);

exports.Commands = function(bot, msg, suffix, loadedEntity){
  var msgPrefix = msg.content[0];
  var noData = false;
  if(!loadedEntity){ var noData = true;}
  if(msg.content.indexOf(bot.user.mention()) == 0 && (noData || loadedEntity.Cleverbot)){Cleverbot(bot, msg);
    console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - "+warningC(prefix[0]+"chat") + " was used by " + userC(msg.author.username));
    commandUsage("chat");
    return;}
  else {
    var cmdTxt = (msg.content.split(" ")[0].substring(1)).toLowerCase();
    if(alias.hasOwnProperty(cmdTxt)){cmdTxt = alias[cmdTxt]}
    if (utilities[cmdTxt] || defaults[cmdTxt] || misc[cmdTxt] || words[cmdTxt] || chatbot[cmdTxt] || interactions[cmdTxt] || searches[cmdTxt] || cmdTxt === "help")
    {
      if(cmdTxt === "help"){help(bot, msg, suffix, msgPrefix, loadedEntity, noData); return;}
      else if(chatbot[cmdTxt] && (noData || loadedEntity.Cleverbot)){var cmd = chatbot[cmdTxt]}
      else if(utilities[cmdTxt] && (noData || loadedEntity.Utilities)){var cmd = utilities[cmdTxt]}
      else if(misc[cmdTxt] && (noData || loadedEntity.Misc)){var cmd = misc[cmdTxt];}
      else if(words[cmdTxt] && (noData || loadedEntity.WordPlay)){var cmd = words[cmdTxt]}
      else if(interactions[cmdTxt] && (noData || loadedEntity.Interactions)){var cmd = interactions[cmdTxt]}
      else if(defaults[cmdTxt]){var cmd = defaults[cmdTxt]}
      else if(searches[cmdTxt] && (noData || loadedEntity.Search)){var cmd = searches[cmdTxt]}
      else {return;}
      processCmd(bot, msg, suffix, cmdTxt, cmd);
    }
    else if((msg.channel.permissionsOf(msg.sender).hasPermission("manageRoles") || admins.indexOf(msg.author.id) > -1) && (management[cmdTxt] || mod[cmdTxt]))
    {
      if(mod[cmdTxt] && (noData || loadedEntity.Mod)){var cmd = mod[cmdTxt]}
      else if(management[cmdTxt] && (noData || loadedEntity.Management)){var cmd = management[cmdTxt]}
      else {return;}
      processCmd(bot, msg, suffix, cmdTxt, cmd);
    }
    else if (msg.content[0] === prefix[1] && (admin[cmdTxt] || cmdTxt === "reload") && (admins.indexOf(msg.author.id) > -1))
    {
      if(admin[cmdTxt]){var cmd = admin[cmdTxt]}
      else if(cmdTxt === "reload"){reload(bot, msg); return;}
      else {return;}
      processCmd(bot, msg, suffix, cmdTxt, cmd);
    }
  }
}

function processCmd(bot, msg, suffix, cmdTxt, cmd){
  ignoreDB.Settings(msg, function(loadedUser){
    if(loadedUser !== null) return;
    else{
      commandUsage(cmdTxt);
      if(cmd == null){
        bot.sendMessage(msg, "There was an error with that command, Please try again");
        return;
      }
      else if(cmd.privateServer && msg.channel.server.id != "87601506039132160"){
        bot.sendMessage(msg, ":warning: I'm sorry but that command doesn't exist on this server. :warning:");
         bot.deleteMessage(msg);
         return;
       }
       else {
         if(!(admins.indexOf(msg.author.id) > -1) && cmd.cooldown > 0){
           if(!lastExecTime.hasOwnProperty(cmd)) lastExecTime[cmd] = {};
           if(!lastExecTime[cmd].hasOwnProperty(msg.author.id)) lastExecTime[cmd][msg.author.id] = new Date().valueOf();
           else {
             var currentTime = Date.now();
             if(currentTime < lastExecTime[cmd][msg.author.id] + (cmd.cooldown * 1000)){
               bot.sendMessage(msg, "**"+msg.author.name+"**-senpai that command is currently on cooldown for **"+ Math.round(((lastExecTime[cmd][msg.author.id] + cmd.cooldown * 1000) - currentTime) / 1000) + "** more seconds.", (err, sent) =>{
                 bot.deleteMessage(sent, {"wait": 10000});});
                 bot.deleteMessage(msg, {"wait": 15000});
                 return;
               }
               lastExecTime[cmd][msg.author.id] = currentTime;
             }
           }
           console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - "+warningC(msg.content[0]+""+cmdTxt) + " was used by " + userC(msg.author.username));
           try {
             cmd.process(bot, msg, suffix, cmdIndex, cmdUsage);
             if(cmd.delete) bot.deleteMessage(msg);
           }
           catch (err) {
             bot.sendMessage(msg,"```"+err+"```");
             console.log(errorC(err));
           }
         }
       }
   });
}

function commandUsage(cmdTxt){
  if(cmdIndex.indexOf(cmdTxt) > -1){cmdUsage[cmdIndex.indexOf(cmdTxt)] ++;}
  else{cmdIndex.push(cmdTxt); cmdUsage.push(1);}
}

function help(bot, msg, suffix, prefix, loadedEntity, noData){
  commandUsage("help");
  console.log(serverC("@"+msg.channel.server.name+":")+channelC(" #" + msg.channel.name) + ": "+botC("@WishBot")+" - "+warningC(msg.content[0]+"help") + " was used by " + userC(msg.author.username));
  if(utilities[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+utilities[suffix].usage+"\nCooldown: "+utilities[suffix].cooldown+" seconds")}
  else if(misc[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+misc[suffix].usage+"\nCooldown: "+misc[suffix].cooldown+" seconds")}
  else if(defaults[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+defaults[suffix].usage+"\nCooldown: "+defaults[suffix].cooldown+" seconds")}
  else if(chatbot[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+chatbot[suffix].usage)}
  else if(words[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+words[suffix].usage+"\nCooldown: "+words[suffix].cooldown+" seconds")}
  else if(interactions[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+interactions[suffix].usage+"\nCooldown: "+interactions[suffix].cooldown+" seconds")}
  else if(searches[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+searches[suffix].usage+"\nCooldown: "+searches[suffix].cooldown+" seconds")}
  else if(mod[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+mod[suffix].usage+"\nCooldown: "+mod[suffix].cooldown+" seconds")}
  else if(management[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+management[suffix].usage+"\nCooldown: "+management[suffix].cooldown+" seconds")}
  else if(admin[suffix]){bot.sendMessage(msg, "__Command Usage for **"+suffix+"**:\n__"+admin[suffix].usage)}
  else if(suffix.toLowerCase() === "mod")
  {
    var helpMsg ="__**Mod Commands:**__\n";
    if(noData || loadedEntity.Mod){
      helpMsg += "\n**Mod Utilities: **";
      helpMsg += Object.keys(mod).sort().map(cmd => "`" + cmd + "`").join(", ");
    }
    if(noData || loadedEntity.Management){
      helpMsg += "\n**Mod Management: **";
      helpMsg += Object.keys(management).sort().map(cmd => "`" + cmd + "`").join(", ");
    }
    bot.sendMessage(msg, helpMsg);
    bot.deleteMessage(msg);
  }
  else if (suffix.toLowerCase() === "admin") {
    var helpMsg = "__**Admin Commands:**__\n\n**Admin Utilities: **";
    helpMsg += Object.keys(admin).sort().map(cmd => "`" + cmd + "`").join(", ");
    bot.sendMessage(msg, helpMsg);
    bot.deleteMessage(msg);
  }
  else
  {
    var helpMsg = "__**General Commands:**__\n\n";
    helpMsg += "**Default: **";
    helpMsg += Object.keys(defaults).sort().map(cmd => "`" + cmd + "`").join(", ");
    if(noData || loadedEntity.Cleverbot){
      helpMsg += "\n**Cleverbot: **`chat`, `@"+bot.user.name+"`";
    }
    if(noData || loadedEntity.WordPlay){
      helpMsg += "\n**Word Play: **";
      helpMsg += Object.keys(words).sort().map(cmd => "`" + cmd + "`").join(", ");
    }
    if(noData || loadedEntity.Interactions){
      helpMsg += "\n**Interactions: **";
      helpMsg += Object.keys(interactions).sort().map(cmd => "`" + cmd + "`").join(", ");
    }
    if(noData || loadedEntity.Search){
      helpMsg += "\n**Searches: **";
      helpMsg += Object.keys(searches).sort().map(cmd => "`" + cmd + "`").join(", ");
    }
    if(noData || loadedEntity.Utilities){
      helpMsg += "\n**Utilities: **";
      helpMsg += Object.keys(utilities).sort().map(cmd => "`" + cmd + "`").join(", ");
    }
    if(noData || loadedEntity.Misc){
      helpMsg += "\n**Misc: **";
      helpMsg += Object.keys(misc).sort().map(cmd => "`" + cmd + "`").join(", ");
    }
    helpMsg += "\n\nFor usage and info about these commands use `"+prefix+"help [command]`\nTo View the Mod Commmands Help use `"+prefix[0]+"help mod`";
    bot.sendMessage(msg, helpMsg);
    bot.deleteMessage(msg);
  }
}

function reload(bot, msg){
  delete require.cache[require.resolve("./bot_modules/Cleverbot.js")];
  delete require.cache[require.resolve("./bot_modules/Utilities.js")];
  delete require.cache[require.resolve("./bot_modules/Misc.js")];
  delete require.cache[require.resolve("./bot_modules/Admin.js")];
  delete require.cache[require.resolve("./options/admins.json")];
  delete require.cache[require.resolve("./bot_modules/Mod.js")];
  delete require.cache[require.resolve("./bot_modules/Interactions.js")];
  delete require.cache[require.resolve("./bot_modules/WordPlay.js")];
  delete require.cache[require.resolve("./bot_modules/Defaults.js")];
  delete require.cache[require.resolve("./bot_modules/Search.js")];
  delete require.cache[require.resolve("./bot_modules/Management.js")];
  delete require.cache[require.resolve("./bot_modules/Database.js")];
  delete require.cache[require.resolve("./bot_modules/Ignored.js")];
  Cleverbot = require("./bot_modules/Cleverbot.js").Clever;
  chatbot = require("./bot_modules/Cleverbot.js").chatbot;
  utilities = require("./bot_modules/Utilities.js").utilities;
  misc = require("./bot_modules/Misc.js").misc;
  admin = require("./bot_modules/Admin.js").admin;
  admins = require("./options/admins.json").admins;
  mod = require("./bot_modules/Mod.js").mod;
  interactions = require("./bot_modules/Interactions.js").interactions;
  words = require("./bot_modules/WordPlay.js").words;
  defaults = require("./bot_modules/Defaults.js").defaults;
  searches = require("./bot_modules/Search.js").searches;
  management = require("./bot_modules/Management.js").management;
  db = require("./bot_modules/Database.js");
  ignoreDB = require("./bot_modules/Ignored.js");
  console.log(botC("@WishBot")+ " - " + errorC("Reload All Modules")+" was used by "+userC(msg.author.username));
  bot.sendMessage(msg, "All modules reloaded.")
}
