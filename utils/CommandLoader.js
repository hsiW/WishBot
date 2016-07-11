let fs = require('fs'),
    Command = require('./Command.js');

commands = {};

exports.load = function() {
    return new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/../commands/`, (err, folders) => {
            if (err) reject(`Error reading commands directory: ${err}`);
            else if (folders) {
                folders.forEach(folder => {
                    fs.readdir(`${__dirname}/../commands/${folder}/`, (error, loaded) => {
                        if (err) reject(`Error reading commands directory: ${error}`);
                        else if (loaded.length < 1) console.log(errorC(folder + ' was empty and has been skipped.'))
                        else if (loaded) {
                            for (name of loaded) {
                                commands[name.replace('.js', '')] = new Command(name.replace('.js', ''), folder, require(`${__dirname}/../commands/${folder}/${name}`))
                            }
                        }
                    });
                });
            }
        });
        resolve();
    });
}