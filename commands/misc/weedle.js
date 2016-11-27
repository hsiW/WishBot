module.exports = {
    usage: "**Weedle Weedle Weedle Wee**.",
    delete: false,
    cooldown: 5,
    process: () => {
        return Promise.resolve({
            message: "**Weedle Weedle Weedle Wee**\nhttp://i.imgur.com/OTeiAnA.gif"
        })
    }
}