module.exports = class Command {
    constructor(name, type, settings) {
        this.name = name;
        this.usage = settings.usage || '';
        this.type = type;
        this.delete = settings.delete || false;
        this.cooldown = settings.cooldown || 0;
        this.togglable = settings.togglable || true;
        this.privateServer = settings.privateServer || null;
        this.lastExecTime = {};
        this.execTimes = 0;
        this.process = settings.process;
    }

    help() {
        return `__Command usage for **${this.name}:**__
${this.usage}

**Cooldown:** \`${this.cooldown}s\` | **Delete on Use:** \`${this.delete}\``;
    }
    cooldownTime(user) {
        let now = Date.now();
        return ((this.lastExecTime[user] + (this.cooldown * 1000)) - now) / 1000;
    }

    process(bot, msg, args) {
        if (typeof this.job === 'function') this.job(bot, msg, args);
        else throw new Error('Process is not set');
    }

    cooldownCheck(user) {
        if (this.lastExecTime.hasOwnProperty(user)) {
            let now = Date.now();
            if ((this.lastExecTime[user] + (this.cooldown * 1000)) > now)
                return true;
            else {
                this.lastExecTime[user] = now;
                return false;
            }
        } else {
            this.lastExecTime[user] = Date.now();
            return false;
        }
    }
    privateCheck(msg) {
        if (this.privateServer === null)
            return false;
        else if (this.privateServer.indexOf(msg.channel.guild.id) > -1)
            return false;
        else
            return true;
    }
}