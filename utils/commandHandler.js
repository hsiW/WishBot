const admins = require('./../options/admins.json'), //List of Admin ID's which override permissions check as well as allow use of admin commands
    usageChecker = require('./../utils/usageChecker.js');

module.exports = (msg, args, cmd, bot) => {
    //Checks for Admin command types
    if (cmd.type === "admin" && !admins.includes(msg.author.id)) return;
    else {
        //Check if the used location passes the private check or if it passes the DM check to prevent some commands from being used in unintended locations
        if (cmd.privateCheck(msg) || (!msg.channel.guild && !cmd.dm) || (msg.channel.guild && !cmd.permissionsCheck(msg) && !admins.includes(msg.author.id))) return;
        //Cooldown check, admins ignore cooldowns
        else if (!admins.includes(msg.author.id) && cmd.cooldownCheck(msg.author.id)) bot.createMessage(msg.channel.id, `\`${cmd.name}\` is currently on cooldown for ${cmd.cooldownTime(msg.author.id).toFixed(1)}s`);
        //Process the command
        else {
            //Execute the command
            cmd.exec(msg, args, bot)
            if (msg.channel.guild) {
                //Command Logging in Guilds
                console.log(`${guildC("@" + msg.channel.guild.name + ":")}${channelC(" #" + msg.channel.name)}: ${warningC(cmd.name)} was used by ${userC(msg.author.username)}`);
                //Updates the timestamp for the guild to mark it as active
                usageChecker.updateTimestamp(msg.channel.guild);
            }
            //Comand Logging in PM's
            else console.log(`${guildC("@Private Message:")} ${warningC(cmd.name)} was used by ${userC(msg.author.username)}`);
        }
    }
}