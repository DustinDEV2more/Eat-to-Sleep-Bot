var { client } = require("./index")
var config = require("./config.json")
const fs = require("fs")
const embed = require("./Embed")


//read command folder
var commanddir = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//save every file to the client.commands 
for (const file of commanddir) {
    
    var command = require("./commands/" + file).command
    client.commands.set(command.call, command);

}

//listen for commands and execute then
client.on("message", (message) => {

    var prefix = config.prefix;
    var messageArray = message.content.split(" ")
    var alias = messageArray[0].replace(prefix, "").toLocaleLowerCase();
    var args = messageArray.slice(1);

    if (message.author.bot) return;
    if (message.channel.type == "dm") return message.channel.send("Es können keine Commands in privaten channeln mit mir ausgeführt werden");
    if (message.content.startsWith(prefix) == false) return;
    if (!client.commands.has(alias)) return;

    try {
        client.commands.get(alias).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(embed.error_system("Ein Fehler beim Ausführen des Befehls ist aufgetreten", "```" + error + "```"));
    }

})