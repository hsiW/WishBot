const options = require("./../options/options.json"),
    playing = require('./../lists/playing.json'), //List of playing status's for the bot to use
    axios = require('axios'),
    winston = require('winston'), //Used for logging to file
    fileLog = new(winston.Logger)({ //Creates log transport to log to error.log file
        transports: [
            new(winston.transports.File)({
                filename: 'error.log', //The name of the logging file
                showLevel: false
            })
        ]
    });

//Covert string to having just first character uppercase and the rest lowercase
exports.toTitleCase = str => {
    //Finds words and replaces the word with a title case word, doesn't matter what it was previously(title case is the first letter is uppercase and rest lowercase)
    return str.replace(/\w\S*/g, word => {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
}

exports.getName = (msg, name) => {
    //Creates name reject to search by
    let nameRegex = new RegExp(name, "i");
    //If not in a guild make the msg.user the msg.author(msg.user doesn't normally exit but it helpsme do some commands)
    if (!msg.channel.guild) {
        msg.user = msg.author;
        return msg;
    } else if (!name) return msg.channel.guild.members.get(msg.author.id); //If no name passed return the member object of the user
    //Check to see if you're able to find the user by nickname or username and return the object if found, if not return the author's member object
    else return msg.channel.guild.members.find(member => (member.nick || member.user.username).match(nameRegex)) ? msg.channel.guild.members.find(member => (member.nick || member.user.username).match(nameRegex)) : msg.channel.guild.members.get(msg.author.id);
}

//Thing to sort objects
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

//Deletes the passed message after 5000ms
exports.messageDelete = msg => {
    setTimeout(() => {
        msg.delete()
    }, 5000)
}

//Logs errors to the cconsole as well as the error.log
exports.fileLog = err => {
    console.log(errorC(err))
    fileLog.error(err)
}

//Gets a image from the passed imgur apiURL
exports.get_image = apiURL => {
    return new Promise(resolve => {
        //Get the image data from the imgur api using the imgur_id provided in options
        axios.get(apiURL, {
            headers: {
                'Authorization': 'Client-ID ' + options.imgur_id
            }
        }).then(response => {
            //If data isn't nothing search for a SFW image and resolve it
            if (response.data.data.length !== 0) returnSFWImage(response.data.data).then(res => resolve(res))
                //If nothing resolve null
            else resolve(null)
        })
    })
}

function returnSFWImage(data) {
    return new Promise(resolve => {
        //While loop on data
        while (data.length > 0) {
            //Gets a random index to check from
            let index = ~~ (Math.random() * data.length);
            //If that image isn't nsfw and not an album resolve the image data object
            if (!data[index].nsfw && !data[index].is_album) resolve(data[index]);
            //If NSFW or an album remove that image data object from the array and return to start
            data.splice(index, 1);
        }
        //If no images found resolve null
        resolve(null);
    });
}

//Set random bot status(includes random game as well as random streaming url)
exports.setRandomStatus = (bot, urls) => {
    bot.shards.forEach(shard => {
        shard.editStatus({
            name: playing[~~(Math.random() * (playing.length))],
            type: 1,
            url: urls[~~(Math.random() * (urls.length))]
        });
    })
}