let admins = require('./../options/admins.json'), //List of Admin ID's which override the mod permissions check as well as allow use of admin commands
    UsageChecker = require('./../utils/usageChecker.js');

module.exports = (msg, args, cmd, bot) => {
    //Checks for Mod and Admin command types
    if (cmd.type === "mod" && msg.channel.guild && !((msg.channel.permissionsOf(msg.author.id).has('manageGuild')) || admins.indexOf(msg.author.id) > -1)) return;
    else if (cmd.type === "admin" && admins.indexOf(msg.author.id) === -1) return;
    else {
        //Check if the used location passes the private check or if it passes the DM check to prevent some commands from being used in unintended locations
        if (cmd.privateCheck(msg) || (!cmd.dm && !msg.channel.guild)) return;
        //Cooldown check, admins ignore cooldowns
        else if (!(admins.indexOf(msg.author.id) > -1) && cmd.cooldownCheck(msg.author.id)) bot.createMessage(msg.channel.id, `\`${cmd.name}\` is currently on cooldown for ${cmd.cooldownTime(msg.author.id).toFixed(1)}s`);
        //Process the command
        else {
            cmd.process(msg, args, bot)
            //Command Logging in Guilds
            if (msg.channel.guild) console.log(serverC("@" + msg.channel.guild.name + ":") + channelC(" #" + msg.channel.name) + ": " + warningC(cmd.name) + " was used by " + userC(msg.author.username));
            //Comand Logging in PM's
            else console.log(serverC("@Private Message: ") + warningC(cmd.name) + " was used by " + userC(msg.author.username));
        }
        //Updates the timestamp for the guild to mark it as active
        UsageChecker.updateTimestamp(msg.channel.guild);
    }
}