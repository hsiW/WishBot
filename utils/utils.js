exports.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

exports.getName = function(msg, name) {
    var nameRegex = new RegExp(name, "i");
    if (!name) return msg.channel.guild.members.get(msg.author.id)
    else return msg.channel.guild.members.find(member => member.user.username.match(nameRegex)) ? msg.channel.guild.members.find(member => member.user.username.match(nameRegex)) : msg.channel.guild.members.get(msg.author.id);
}

exports.sortObj = function(obj, type, caseSensitive) {
    var temp_array = [];
    for (var key in obj) {
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
            var x = obj[a];
            var y = obj[b];
            if (!caseSensitive) {
                x = (x['toLowerCase'] ? x.toLowerCase() : x);
                y = (y['toLowerCase'] ? y.toLowerCase() : y);
            }
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    } else {
        temp_array.sort();
    }
    var temp_obj = {};
    for (var i = 0; i < temp_array.length; i++) {
        temp_obj[temp_array[i]] = obj[temp_array[i]];
    }
    return temp_obj;
};

exports.minutesToString = function(mins) {
    var months = Math.floor(mins / 43800);
    var days = Math.floor((mins / 1440) % 30);
    var hours = Math.floor((mins / 60) % 24);
    var minutes = Math.floor(mins % 60);
    return months + "month(s) : " + days + "day(s) : " + hours + "hour(s) : " + minutes + "minute(s)";
}

exports.daysToString = function(day) {
    var months = Math.floor(day / 30)
    var days = Math.floor(day % 30)
    var hours = Math.floor((day % 24) % 30)
    var minutes = Math.floor((day / 1440) % 60)
    return months + "month(s) : " + days + "day(s) : " + hours + "hour(s) : " + minutes + "minute(s)";
}

exports.secondsToString = function(second) {
    var days = Math.floor(second / 86400)
    var hours = Math.floor((second / 3600) % 24)
    var minutes = Math.floor((second / 60) % 60)
    var seconds = Math.floor(second % 60)
    return days + "day(s) : " + hours + "hour(s) : " + minutes + "minute(s) : " + seconds + "second(s)";
}

exports.getSeason = function() {
    var d = new Date()
    var season = d.getMonth() + 1;
    if (season === 1 || season === 2 || season === 3) return 0;
    else if (season === 4 || season === 5 || season === 6) return 1;
    else if (season === 7 || season === 8 || season === 9) return 2;
    else if (season === 10 || season === 11 || season === 12) return 3;
}

exports.splitArray = function(array, size) {
    var sets = [],
        chunks,
        i = 0;
    chunks = array.length / size;
    for (var i = 0, j = 0; i < chunks; i++, j += size) {
        sets[i] = array.slice(j, j + size);
    }
    return sets;
}