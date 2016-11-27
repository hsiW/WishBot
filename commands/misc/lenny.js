module.exports = {
    usage: "Returns a **Lenny** to the current channel.",
    delete: false,
    cooldown: 5,
    process: () => {
        return Promise.resolve({
            message: '( ͡° ͜ʖ ͡°)'
        })
    }
}