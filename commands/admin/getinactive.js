const UsageChecker = require('./../../utils/usageChecker.js');

module.exports = {
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            UsageChecker.checkInactivity(bot).then(response => resolve({
                message: response,
                upload: {
                    file: Buffer.from(JSON.stringify(inactiveGuilds, null, 4)),
                    name: 'inactive.json'
                }
            }))
        })
    }
}