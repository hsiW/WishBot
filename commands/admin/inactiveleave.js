const UsageChecker = require('./../../utils/usageChecker.js');

module.exports = {
    delete: false,
    process: (msg, args, bot) => {
        return new Promise(resolve => {
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
        });
    }
}