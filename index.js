var Discord = require("discord.js")
var Mongoose = require("mongoose")

var config = require("./config.json")

var client = new Discord.Client();
client.commands = new Discord.Collection()
client.slash_commands = new Discord.Collection()
client.music = new Discord.Collector()
module.exports.client = client;

require("./command-handler")

client.on("ready", () => {
    require("./slash_command-handler")
    console.log(`${client.user.tag} is now online`)
    client.user.setPresence({ activity: { name: 'E̾a̾t̾,̾ ̾S̾l̾e̾e̾p̾,̾ ̾B̾e̾t̾a̾ ̾B̾o̾t̾' }, status: "dnd" })
})

client.login(config.discord)

//Database
Mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})


require("./webserver/webmain")

require("./events/welcome")
require("./events/streaming-talk")
require("./events/overwatch-arcade")
require("./events/fetch-profile-changes")