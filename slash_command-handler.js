var { client } = require("./index")
var config = require("./config.json")
const fs = require("fs")
const embed = require("./Embed");
const { options } = require("./webserver/routes/api");

// client.api.applications(client.user.id).guilds("604747271862485012").commands.get().then(res => {
//     res.forEach(element => {
//     client.api.applications(client.user.id).guilds("604747271862485012").commands(element.id).delete()
//     });
// })

async function createAPIMessage(int, content) {
    const Discord = require("discord.js")
    const apimessage = await Discord.APIMessage.create(client.channels.resolve(int.channel_id), content)
    .resolveData()
    .resolveFiles();
return {...apimessage.data, files: apimessage.files}
}

//read command folder
var commanddir = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

//save every file to the client.commands 
for (const file of commanddir) {
    
    var command = require("./commands/slash/" + file).command
    client.slash_commands.set(command.name, command);

    client.api.applications(client.user.id).guilds("604747271862485012").commands.post({
        data: {
            name: command.name,
            description: command.description,

            options: command.options
        }
    });
    

}


//Listen to slash commands
client.ws.on("INTERACTION_CREATE", async int => {
    console.log("Ein slash command wurde verwendet: " + int.data.name)
    const command = int.data.name
    const args = int.data.options

    if (!client.slash_commands.has(command)) return;

    try {
        client.slash_commands.get(command).execute(int, args, createAPIMessage, client);
    } catch (error) {
        console.error(error);
    
        client.api.interactions(int.id, int.token).callback.post({
            data: {type: 4, data: await createAPIMessage(int, embed.error_system("Ein Fehler beim Ausführen des Befehls ist aufgetreten", "```" + error + "```"))}
        })
    }

    
})