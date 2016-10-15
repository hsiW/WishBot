let options = require("./../options/options.json"),
    axios = require('axios'),
    winston = require('winston'),
    fileLog = new(winston.Logger)({
        transports: [
            new(winston.transports.File)({
                filename: 'error.log',
                prettyPrint: true
            })
        ]
    });

exports.toTitleCase = str => {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

exports.getName = (msg, name) => {
    let nameRegex = new RegExp(name, "i");
    if (!msg.channel.guild) {
        msg.user = msg.author;
        return msg;
    } else if (!name) return msg.channel.guild.members.get(msg.author.id);
    else return msg.channel.guild.members.find(member => (member.nick || member.user.username).match(nameRegex)) ? msg.channel.guild.members.find(member => (member.nick || member.user.username).match(nameRegex)) : msg.channel.guild.members.get(msg.author.id);
}

exports.sortObj = (obj, type, caseSensitive) => {
    let temp_array = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (!caseSensitive) {
                key = (key['toLowerCase'] ? key.toLowerCase() : key);
            }
            temp_array.push(key);
        }
    }
    temp_array.sort();
    let temp_obj = {};
    for (let i = 0; i < temp_array.length; i++) {
        temp_obj[temp_array[i]] = obj[temp_array[i]];
    }
    return temp_obj;
};

exports.minutesToString = mins => {
    let months = ~~ (mins / 43800),
        days = ~~ ((mins / 1440) % 30),
        hours = ~~ ((mins / 60) % 24),
        minutes = ~~ (mins % 60);
    return months + "month(s) | " + days + "day(s) | " + hours + "hour(s) | " + minutes + "minute(s)";
}

exports.daysToString = day => {
    let months = ~~ (day / 30),
        days = ~~ (day % 30),
        hours = ~~ ((day % 24) % 30),
        minutes = ~~ ((day / 1440) % 60);
    return months + "month(s) | " + days + "day(s) | " + hours + "hour(s) | " + minutes + "minute(s)";
}

exports.splitArray = (array, size) => {
    let sets = [],
        chunks,
        i = 0;
    chunks = array.length / size;
    for (let i = 0, j = 0; i < chunks; i++, j += size) {
        sets[i] = array.slice(j, j + size);
    }
    return sets;
}

exports.messageDelete = msg => {
    setTimeout(() => {
        msg.delete()
    }, 5000)
}

exports.fileLog = err => {
    console.log(errorC(err))
    fileLog.error(err)
}

exports.get_image = (msg, apiURL) => {
    return new Promise(resolve => {
        axios.get(apiURL, {
            headers: {
                'Authorization': 'Client-ID ' + options.imgur_id
            }
        }).then(response => {
            if (response.data.data.length !== 0) returnSFWImage(response.data.data).then(res => resolve(res))
            else resolve(null)
        })
    })
}

function returnSFWImage(data) {
    return new Promise(resolve => {
        while (data.length > 0) {
            let index = ~~ (Math.random() * data.length);
            if (!data[index].nsfw && !data[index].is_album) resolve(data[index]);
            data.splice(index, 1);
        }
        resolve(null);
    });
}