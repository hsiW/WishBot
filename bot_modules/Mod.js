 var mod = {
     "stats": {
         usage: "Prints out stats for this bot",
         delete: true,
         cooldown: 20,
         type: "mod",
         process: function(bot, msg, suffix, cmdIndex, cmdUsage) {
             var statMsg = "__**" + bot.user.username + " Stats:**__"
             statMsg += "```ruby\nTotal Server(s): " + bot.guilds.size;
             statMsg += "\nTotal Channel(s): " + (Object.keys(bot.channelGuildMap).length + bot.privateChannels.size);
             statMsg += "\nTotal User(s): " + bot.users.size + "";
             statMsg += "\nMemory Usage: " + (process.memoryUsage().rss / 1024 / 1000).toFixed(2) + "MB";
             var commandUsage = 0;
             for (i = 0; i < cmdUsage.length; i++) commandUsage = commandUsage + cmdUsage[i];
             statMsg += "\nCommand Total: " + commandUsage + " (" + (commandUsage / (Math.round(bot.uptime / 60000))).toFixed(2) + "/min)```";
             bot.createMessage(msg.channel.id, statMsg);
         }
     },
     "echo": {
         usage: "Echo's the entered text",
         delete: true,
         cooldown: 2,
         type: "words",
         process: function(bot, msg, suffix) {
             if (!suffix) suffix = "echo";
             bot.createMessage(msg.channel.id, "💭 - " + suffix)
         }

     }
 }

 exports.mod = mod;