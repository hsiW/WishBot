module.exports = {
    usage: "Returns a **Sneaky Lenny** to the current channel.",
    aliases: ['slenny'],
    process: () => {
    	//This lenny is sneakier than the rest
        return Promise.resolve({
            message: '┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴'
        })
    }
}