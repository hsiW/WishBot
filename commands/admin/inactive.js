var UsageChecker = require('./../../utils/usageChecker.js');

module.exports = {
    process: (msg, args, bot) => {
        return new Promise(resolve => {
            if (args === 'get' || args === 'check') {
                UsageChecker.checkInactivity(bot).then(response => resolve({
                    message: response,
                    upload: {
                        file: Buffer.from(JSON.stringify(inactiveGuilds, null, 4)),
                        name: 'inactive.json'
                    }
                }))
            } else {
                UsageChecker.checkInactivity(bot).catch(err => console.log(warningC(err))).then(UsageChecker.removeInactive(bot).then(success => resolve({
                    message: success,
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