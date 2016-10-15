module.exports = {
    usage: 'Returns a link to donate to the development of this bot.',
    delete: false,
    cooldown: 30,
    process: () => {
        return Promise.resolve({
            message: `__**You may donate to the developement using either of the following links:**__
Monthly: **<https://patreon.com/WishBot>**
Single Donation: **<https://www.paypal.me/WishBot>**`
        })
    }
}