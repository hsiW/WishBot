const fs = require('fs'), //For reading/writing to/from files
    reload = require('require-reload')(require);

//Reads directory of commands assigning the command name as the file name(exluding the file extension) and the command type based on the folder the command was loaded from
exports.load = function() {
    return new Promise((resolve, reject) => {
        var Command = reload('./commandClass.js'); //The command class
        //Global Command Object in which all commands are loaded into(Can be acessed anywhere in the program)
        commands = {};
        //Global Command Alias object where all command alias objects are loaded into
        commandAliases = {};
        fs.readdir(`${__dirname}/../commands/`, (err, folders) => {
            if (err) reject(`Error reading commands directory: ${err}`);
            else if (folders) {
                folders.forEach(folder => {
                    fs.readdir(`${__dirname}/../commands/${folder}/`, (error, loaded) => {
                        if (error) reject(`Error reading commands directory: ${error}`);
                        //Skips folder if it is empty
                        else if (loaded.length < 1) console.log(errorC(`${folder} was empty and has been skipped.`))
                        else if (loaded) {
                            for (let name of loaded) {
                                //Assigning Command Files to the Global Command Object
                                //Try to load command and if theres an error log the file name as well as the error stack
                                try {
                                    commands[name.replace('.js', '')] = new Command(name.replace('.js', ''), folder, reload(`${__dirname}/../commands/${folder}/${name}`))
                                } catch (e) {
                                    console.log(errorC(`${name} - ${e.stack}`))
                                }
                            }
                            for (let command in commands) {
                                //Assigning Command Aliases to the Glboal Command Alias Object
                                if (commands[command].aliases) commands[command].aliases.forEach(alias => {
                                    commandAliases[alias] = command;
                                })
                            }
                        }
                    });
                });
                //Resolves Promise when all commands loaded
                resolve();
            }
        });
    });
}