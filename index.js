var Discord = require("discord.js")
var Mongoose = require("mongoose")

var config = require("./config.json")

var client = new Discord.Client();
client.commands = new Discord.Collection()
module.exports.client = client;

require("./command-handler")

client.on("ready", () => {
    console.log(`${client.user.tag} is now online`)
    client.user.setPresence({ activity: { name: 'E̾a̾t̾,̾ ̾S̾l̾e̾e̾p̾,̾ ̾B̾e̾t̾a̾ ̾B̾o̾t̾' }, status: "dnd" })

    //slash command register
    client.api.applications(client.user.id).guilds("585511241628516352").commands.post({
        data: {
            name: "test",
            description: "Dustins erster discord slash command!"
        }
    });

    client.api.applications(client.user.id).guilds("585511241628516352").commands.post({
        data: {
            name: "daily",
            description: "Gibt dir jeden Tag coins"
        }
    });
})

client.login(config.discord)

//Database
Mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true})

//Listen to slash commands
client.ws.on("INTERACTION_CREATE", async int => {
    console.log("Ein slash command wurde verwendet: " + int.data.name)
    const command = int.data.name
        const embed = require("./Embed")
        const args = int.data.options

    if (command == "test"){
        client.api.interactions(int.id, int.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: "no u"
                }
            }
        })
    }

    if (command == "daily"){
        const MEMBER = require("./Models/MEMBER")
        
        var memberdb = await MEMBER.findOne({"id": int.member.user.id})
        if (!memberdb) return;

        var datenow = new Date()
        var last_daily = memberdb.currencys.coins.last_daily
        if (last_daily == null || memberdb.currencys.coins.last_daily.setHours(last_daily.getHours() + 24) < datenow){
            //last daily was redeemed 24 Hours ago or was never redeemed before
            var newlog = memberdb.currencys.coins.log
            newlog.push({"description": "daily coins", "value": 150, "date": datenow})

           await MEMBER.findOneAndUpdate({"id": int.member.user.id}, {"currencys.coins.amount": memberdb.currencys.coins.amount + 150, "currencys.coins.last_daily": datenow, "currencys.coins.log": newlog})
           client.api.interactions(int.id, int.token).callback.post({
            data: {
                type: 4,
                data: await createAPIMessage(int, embed.success("Tägliche Belohnung eingelöst", "Deine Tägliche Belohnung wurde eingelöst. Ich habe 150<:EatSleepCoin:725823305008939058> zu deinem Account hinzugefügt"))
                
            }
        })
    
    }
        else {
            //last daily was redeemed within the last 24 hours
            client.api.interactions(int.id, int.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(int, embed.error_user("Tägliche Belohnung bereits eingelöst", `Du hast deine tägliche Belohnung bereits eingelöst`))
                    
                }
            })
        }

    }
})

async function createAPIMessage(int, content) {
    const apimessage = await Discord.APIMessage.create(client.channels.resolve(int.channel_id), content)
    .resolveData()
    .resolveFiles();
return {...apimessage.data, files: apimessage.files}
}

require("./webserver/webmain")