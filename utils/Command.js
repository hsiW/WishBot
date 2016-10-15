let utils = require('./utils.js');

module.exports = class Command {
    constructor(name, type, settings) {
        this.name = name; //Command Name
        this.type = type; //Comand Type
        this.usage = settings.usage || ''; //Command Usage for in the help message
        this.lastExecTime = {}; //Last Execution time for use in coolDown Check
        this.execTimes = 0; //# of Execution times since startup
        this.job = settings.process; //The Function of the command
        this.delete = !(settings.delete === false); //Setting to delete command on use(true by default)
        this.dm = !(settings.dm === false); //Setting for command to work in DM's(Private messages)(true by default)
        this.cooldown = settings.cooldown || 0; //The cooldown for the command
        this.togglable = !(settings.togglable === false); //Wheather the command is toggable or not with the toggle command(true by default)
        this.privateServer = settings.privateServer || null; //Array of servers the command is resticted to(no restriction by default)
    }
    //The template help message which is used in `help [cmdName]`
    help() {
        return `__**Command Info for:**__ \`${this.name}\`

${this.usage}

**Cooldown:** \`${this.cooldown}s\` | **Delete on Use:** \`${this.delete}\` | **DM:** \`${this.dm}\` | **Uses:** \`${this.execTimes}\``;
    }

    //Function to get the current cooldown time for the user(is used when a command is on cooldown to show the time left til off cooldown)
    cooldownTime(user) {
        let now = Date.now();
        return ((this.lastExecTime[user] + (this.cooldown * 1000)) - now) / 1000;
    }

    //Command Processing
    process(msg, args, bot) {
        //Checks if the command deletes on use as well as if the bot has delete permissions before running the msg deletion
        if (this.delete && msg.channel.guild && msg.channel.permissionsOf(bot.user.id).has('manageMessages')) msg.delete();
        //Main Processing of Command(uses Promises)
        //Commands return a Promise which can contain a 'Message' and 'Upload' to send message being the message content, upload being whatever file you'd like to
        //Commands also can return a edit function which allows you to edit messages while also taking the inital sent message object
        //They can also return a delete after 5s boolean which deletes the sent message after 5s
        this.job(msg, args, bot).then(response => msg.channel.createMessage(response.message, response.upload).then(message => {
            if (response.edit) message.edit(response.edit(message)) //Edit sent message 
            if (response.delete) utils.messageDelete(message); //Check for delete sent message
        }).catch(err => utils.fileLog(err))); //Log to console and file if errored
        this.execTimes++; //Adds 1 the current number of execution times(Uses)
    }

    //Cooldown Check(returns true if the command shouldn't be processed)
    cooldownCheck(user) {
        //If the user has a lastExecTime
        if (this.lastExecTime.hasOwnProperty(user)) {
            let now = Date.now();
            if ((this.lastExecTime[user] + (this.cooldown * 1000)) > now) //If the user last used the command within the cooldown period return true
                return true;
            else { //If the user last used the command outside the command cooldown period return false and update the lastExecTime to now
                this.lastExecTime[user] = now;
                return false;
            }
        }
        //If the user hasn't used the command since the last restart 
        else {
            this.lastExecTime[user] = Date.now(); //Add the user to the lastExecTime object and set their time to now
            return false;
        }
    }

    //Private Server Command Check(returns true if command shouldn't be processed)
    privateCheck(msg) {
        if (this.privateServer === null) //If the command doesn't have a private server array return false
            return false;
        else if (!msg.channel.guild) //Prevents private server commands from working in DM's by returning true if not used in a guild
            return true;
        else if (this.privateServer.indexOf(msg.channel.guild.id) > -1) //Guild is in the array of privateServers so return false
            return false;
        else //If all else fails return true
            return true;
    }
}