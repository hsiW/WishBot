var pun = require('./../../lists/puns.json');

module.exports = {
    usage: 'Returns a **random pun**.',
    process: () => {
        return Promise.resolve({
            message: pun[~~(Math.random() * (pun.length))]
        })
    }
}