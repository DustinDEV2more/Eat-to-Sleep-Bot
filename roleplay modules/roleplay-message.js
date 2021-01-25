var client = require("../index").client
var MEMBER = require("../models/MEMBER")
var Discord = require("discord.js")

client.on("message", async message => {
    if (message.channel.id != "803000149524611104") return;
    if(message.author.bot) return; 
    if (message.content.startsWith("_")) return;
    if (message.deletable) message.delete()

    var memberdb = await MEMBER.findOne({"info.id": message.author.id})
    if (!memberdb) return;
    if (!memberdb.more.roleplay) return;

    //create a webhook
    await message.channel.createWebhook(memberdb.more.roleplay.name, memberdb.more.roleplay.picture)
    .then(
        async Webhook => {
        // var Webhook = new Discord.WebhookClient(Webhook.id, Webhook.token)
        await Webhook.send(message.content)
        setTimeout(async () => {
            await Webhook.delete()
        }, 10000);
        }
    )
    .catch(console.error)

})