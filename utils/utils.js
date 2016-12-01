const winston = require('winston'), //Used for logging to file
    fileLog = new(winston.Logger)({ //Creates log transport to log to error.log file
        transports: [
            new(winston.transports.File)({
                filename: 'error.log', //The name of the logging file
                showLevel: false,
                prettyPrint: true,
                json: false
            })
        ]
    });

//Covert string to having just first character uppercase and the rest lowercase
exports.toTitleCase = str => {
    //Finds words and replaces the word with a title case word, doesn't matter what it was previously(title case is the first letter of each word is uppercase and rest lowercase)
    return str.replace(/\w\S*/g, word => {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
}

//Used to escape regex and prevent errors
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;

//Thing to sort objects (converts object to array, sorts array then reconverts to object)
exports.sortObj = obj => {
    let temp_array = [],
        temp_obj = {};
    //Converts Object to array
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp_array.push(key);
        }
    }
    //Sorts array
    temp_array.sort();
    //Converts array back to object
    for (let i = 0; i < temp_array.length; i++) {
        temp_obj[temp_array[i]] = obj[temp_array[i]];
    }
    return temp_obj;
};

//Splits array into the number size you specify
exports.splitArray = (array, size) => {
    let sets = [],
        chunks = array.length / size,
        i = 0;
    //This code creates an array of arrays and its magic don't question it
    for (let i = 0, j = 0; i < chunks; i++, j += size) {
        sets[i] = array.slice(j, j + size);
    }
    return sets;
}

//Logs errors to the cconsole as well as the error.log
exports.fileLog = err => {
    console.log(errorC(err))
    fileLog.error(err)
}

//Try to get a user object from a typed name
exports.getName = (msg, name) => {
    //Creates name regex to search by
    let nameRegex = new RegExp(escapeRegExp(name), "i");
    //If not in a guild make the msg.user the msg.author(msg.user doesn't normally exit but it helps me do some commands easier)
    if (!msg.channel.guild) {
        msg.user = msg.author;
        return msg;
    } else if (!name) return msg.channel.guild.members.get(msg.author.id); //If no name passed return the member object of the user
    //Check to see if you're able to find the user by nickname or username and return the object if found, if not return the author's member object
    else return msg.channel.guild.members.find(member => (member.nick || member.user.username).match(nameRegex)) ? msg.channel.guild.members.find(member => (member.nick || member.user.username).match(nameRegex)) : msg.channel.guild.members.get(msg.author.id);
}

//Deletes the passed message after 5000ms
exports.messageDelete = msg => {
    setTimeout(() => {
        msg.delete();
    }, 5000)
}