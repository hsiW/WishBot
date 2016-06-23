var mysql = require('mysql');
var options = require('./../../options/options.json');


module.exports = {
    usage: "",
    delete: true,
    cooldown: 5,
    process: (bot, msg, suffix) => {
        if (suffix) {
            if (msg.mentions.length === 1) {
                processProfile(bot, msg, bot.users.get(msg.mentions[0]))
            } else if (suffix.startsWith('create')) {
                bot.createMessage(msg.channel.id, "CREATING")
                createUser(msg.author).catch(console.log).then(bot.createMessage(msg.channel.id, "SUCESS"))
            } else if (suffix.split(' ')[0] === ('edit')) {
                editUser(msg.author, suffix.split(' ')[1], suffix.substring((6 + suffix.split(' ')[1].length), suffix.length)).then(bot.createMessage(msg.channel.id, "SOMETHING")).catch(console.log);
            }
        } else processProfile(bot, msg, msg.author);
    }
}

function editUser(user, edit, change) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT user_profile FROM user_settings WHERE user_id = ' + user.id, (err, rows) => {
            if (err) reject(err);
            else {
                var userProfile = JSON.parse(rows[0].user_profile);
                console.log("'" + change + "'")
                if (edit === "name") userProfile.name = change;
                else if (edit === "status") userProfile.status = change;
                else if (edit === "birthday") userProfile.birthday = change;
                else if (edit === "age") userProfile.age = change;
                else if (edit === "location") userProfile.location = change;
                else if (edit === "animeplanet") userProfile.animeplanet = change;
                else if (edit === "hummingbird") userProfile.hummingbird = change;
                else if (edit === "myanimelist") userProfile.myanimelist = change;
                else if (edit === "twitch") userProfile.twitch = change;
                else if (edit === "bio") userProfile.bio = change;
                else console.log('none');
                saveUser(user, userProfile).catch(reject).then(resolve());
            }
        });
    })
}

function saveUser(user, userProfile) {
    return new Promise((resolve, reject) => {
        var data = {
            user_id: user.id,
            user_profile: JSON.stringify(userProfile)
        }
        pool.query('UPDATE user_settings SET ? WHERE user_id = ' + user.id, data, (err, res) => {
            if (err) reject(err);
            else resolve();
        })
    });
}


function createUser(user) {
    return new Promise((resolve, reject) => {
        var user_default = {
            name: user.username,
            status: null,
            birthday: null,
            age: null,
            location: null,
            animeplanet: null,
            hummingbird: null,
            myanimelist: null,
            twitch: null,
            bio: null
        };
        var data = {
            user_id: user.id,
            user_profile: JSON.stringify(user_default)
        }
        pool.query('INSERT INTO user_settings SET ?', data, (err, res) => {
            if (err) reject(err);
            else resolve();
        })
    });
}

function processProfile(bot, msg, person) {
    var msgArray = [`__**Profile for ${person.username}**__`];
    pool.query('SELECT * FROM user_settings WHERE user_id = ' + person.id, (err, rows) => {
        if (err) console.log(errorC('Error while performing Query'));
        else if (rows.length < 1) {
            msgArray.push(`📝 **Name:** ${person.username}`);
        } else if (rows.length === 1) {
            var user = JSON.parse(rows[0].user_profile);
            console.log(user);
            msgArray.push(`📝 **Name:** ${user.name}`);
            if (user.status != null) msgArray.push(`🖊 **Status:** ${user.status}`);
            if (user.birthday != null) msgArray.push(`🎉 **Birthday:** ${user.birthday}`);
            if (user.age != null) msgArray.push(`🎂 **Age:** ${user.age}`);
            if (user.location != null) msgArray.push(`🌎 **Location:** :flag_${user.location}:`);
            if (user.animeplanet != null) msgArray.push(`🔖 **Anime Planet:** ${user.animeplanet}`);
            if (user.hummingbird != null) msgArray.push(`📘 **Hummingbird:** ${user.hummingbird}`);
            if (user.myanimelist != null) msgArray.push(`📕 **myAnimeList:** ${user.myanimelist}`);
            if (user.twitch != null) msgArray.push(`🎮 **Twitch:** ${user.twitch}`);
            if (user.bio != null) msgArray.push(`📚 **Bio:** ${user.bio}`);
        }
        bot.createMessage(msg.channel.id, msgArray.join('\n'));
    })
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
        twitch: "Xanizl",
        bio: "CREATIVE BIO"
    },
    "134755682170699776": {
        name: "SudoBot",
        age: "∞",
        bio: "Being a bot"
    }
}