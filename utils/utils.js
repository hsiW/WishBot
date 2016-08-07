exports.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

exports.getName = function(msg, name) {
    let nameRegex = new RegExp(name, "i");
    if (!name) return msg.channel.guild.members.get(msg.author.id).user;
    else return msg.channel.guild.members.find(member => member.user.username.match(nameRegex)) ? msg.channel.guild.members.find(member => member.user.username.match(nameRegex)).user : msg.channel.guild.members.get(msg.author.id).user;
}

exports.sortObj = function(obj, type, caseSensitive) {
    let temp_array = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (!caseSensitive) {
                key = (key['toLowerCase'] ? key.toLowerCase() : key);
            }
            temp_array.push(key);
        }
    }
    if (typeof type === 'function') {
        temp_array.sort(type);
    } else if (type === 'value') {
        temp_array.sort(function(a, b) {
            let x = obj[a];
            let y = obj[b];
            if (!caseSensitive) {
                x = (x['toLowerCase'] ? x.toLowerCase() : x);
                y = (y['toLowerCase'] ? y.toLowerCase() : y);
            }
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    } else {
        temp_array.sort();
    }
    let temp_obj = {};
    for (let i = 0; i < temp_array.length; i++) {
        temp_obj[temp_array[i]] = obj[temp_array[i]];
    }
    return temp_obj;
};

exports.minutesToString = function(mins) {
    let months = Math.floor(mins / 43800);
    let days = Math.floor((mins / 1440) % 30);
    let hours = Math.floor((mins / 60) % 24);
    let minutes = Math.floor(mins % 60);
    return months + "month(s) | " + days + "day(s) | " + hours + "hour(s) | " + minutes + "minute(s)";
}

exports.daysToString = function(day) {
    let months = Math.floor(day / 30)
    let days = Math.floor(day % 30)
    let hours = Math.floor((day % 24) % 30)
    let minutes = Math.floor((day / 1440) % 60)
    return months + "month(s) | " + days + "day(s) | " + hours + "hour(s) | " + minutes + "minute(s)";
}

exports.secondsToString = function(second) {
    let days = Math.floor(second / 86400)
    let hours = Math.floor((second / 3600) % 24)
    let minutes = Math.floor((second / 60) % 60)
    let seconds = Math.floor(second % 60)
    return days + "day(s) | " + hours + "hour(s) | " + minutes + "minute(s) | " + seconds + "second(s)";
}

exports.splitArray = function(array, size) {
    let sets = [],
        chunks,
        i = 0;
    chunks = array.length / size;
    for (let i = 0, j = 0; i < chunks; i++, j += size) {
        sets[i] = array.slice(j, j + size);
    }
    return sets;
}

exports.messageDelete = function(bot, msg, time) {
    if (!time) time = 5000;
    setTimeout(() => {
        bot.deleteMessage(msg.channel.id, msg.id).catch(err => console.log(errorC(err)));
    }, time)
}