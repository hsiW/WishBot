module.exports = {
    delete: false,
    process: msg => {
        return new Promise(resolve => {
            let usage = [];
            for (command in commands) {
                if (commands[command].execTimes !== 0) usage.push({
                    name: command,
                    usage: commands[command].execTimes
                })
            }
            resolve({
                message: `\`\`\`
${usage.sort((a,b) => b.usage - a.usage).map(value => value.name + "(" + value.usage + ")").join('\n')}\`\`\`
`
            })
        });
    }
}