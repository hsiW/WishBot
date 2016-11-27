module.exports = {
    usage: "Returns a **Sneaky Lenny** to the current channel.",
    aliases: ['slenny'],
    delete: false,
    cooldown: 5,
    process: () => {
        return Promise.resolve({
            message: '┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴'
        })
    }
}