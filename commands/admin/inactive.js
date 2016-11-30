var UsageChecker = require('./../../utils/usageChecker.js');

module.exports = {
    usage: "Leave or Check inactive guilds. `inactive get` or `inactive check` to return current inactive number as well as a file of server ID's. Otherwise will try to leave inactive servers.",
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            //Check inactivity and return the number of active guilds as well as a file with all the server ID's
            if (args === 'get' || args === 'check') {
                UsageChecker.checkInactivity(bot).then(response => resolve({
                    message: response,
                    upload: {
                        file: Buffer.from(JSON.stringify(inactiveGuilds, null, 4)),
                        name: 'inactive.json'
                    }
                }))
            } else {
                //Leave Inactive Guilds
                UsageChecker.checkInactivity(bot).catch(err => console.log(warningC(err))).then(UsageChecker.removeInactive(bot).then(response => resolve({
                    message: response,
                    delete: true
                })).catch(err => {
                    console.log(errorC(err))
                    resolve({
                        message: err,
                        delete: true
                    })
                }))
            }
        })
    }
}