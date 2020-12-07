var { client } = require("./index")
const {MessageEmbed} = require("discord.js")
var config = require("./config.json")
const fs = require("fs")

//read command folder
var commanddir = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//save every file to the client.commands 
for (const file of commanddir) {
    
    var command = require("./commands/" + file)
    client.commands.set(command.call, command);

}

//listen for commands and execute then
client.on("message", (message) => {

    var prefix = config.prefix;
    var messageArray = message.content.split(" ")
    var alias = messageArray[0].replace(prefix, "");
    var args = messageArray.slice(1);

    if (message.author.bot) return;
    if (message.channel.type == "dm") return message.channel.send("Es können keine Commands in privaten channeln mit mir ausgeführt werden");
    if (message.content.startsWith(prefix) == false) return;
    if (!client.commands.has(alias)) return;

    try {
        client.commands.get(alias).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(new MessageEmbed().setColor("RED").setTitle("Ein Fehler ist aufgetreten!").setDescription(`Keine Sorge. Ziemlich warscheinlich ist es nicht deine Schuld\n\`\`\`fix\n${error}\`\`\``));
    }

})