module.exports = {
    usage: "Use this in case of lewd",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix) {
            if (msg.mentions.length === 1) {
                if (users.hasOwnProperty(msg.mentions[0])) processProfile(bot, msg, bot.users.get(msg.mentions[0]))
            } else {
                bot.createMessage(msg.channel.id, "GOT A SUFFIX")
            }
        } else {
            if (users.hasOwnProperty(msg.author.id)) processProfile(bot, msg, msg.author)
        }
    }
}

function processProfile(bot, msg, person) {
    var user = users[person.id];
    var msgArray = [`__**Profile for ${person.username}**__`];
    msgArray.push(`📝 **Name:** ${user.name}`)
    if (user.hasOwnProperty('status')) msgArray.push(`🖊 **Status:** ${user.status}`);
    if (user.hasOwnProperty('birthday')) msgArray.push(`🎉 **Birthday:** ${user.birthday}`);
    if (user.hasOwnProperty('age')) msgArray.push(`🎂 **Age:** ${user.age}`);
    if (user.hasOwnProperty('location')) msgArray.push(`🌎 **Location:** :flag_${user.location}:`);
    if (user.hasOwnProperty('animeplanet')) msgArray.push(`🔖 **Anime Planet:** ${user.animeplanet}`);
    if (user.hasOwnProperty('hummingbird')) msgArray.push(`📘 **Hummingbird:** ${user.hummingbird}`);
    if (user.hasOwnProperty('myanimelist')) msgArray.push(`📕 **myAnimeList:** ${user.myanimelist}`);
    if (user.hasOwnProperty('bio')) msgArray.push(`📚 **Bio:** ${user.bio}`);
    bot.createMessage(msg.channel.id, msgArray.join('\n'));
}

var users = {
    "87600987040120832": {
        name: "Wish/Mei",
        status: "Working on a Better Bot",
        birthday: "April 27th",
        age: "21",
        location: "ca",
        animeplanet: "hsiW",
        hummingbird: "hsiW",
        myanimelist: "hsiW",
        bio: "CREATIVE BIO"

    },
    "134755682170699776": {
        name: "SudoBot",
        age: "∞",
        bio: "Being a bot"
    }
}