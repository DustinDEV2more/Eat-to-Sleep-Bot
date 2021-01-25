var client = require("../index").client
var config = require("../index").config
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

        var Webhook = new Discord.WebhookClient(config.tokens.webhook[0], config.tokens.webhook[1])
        
        if (!message.attachments.first()) {Webhook.send(message.content, {username: memberdb.more.roleplay.name, avatarURL: memberdb.more.roleplay.picture})}
        else {
            Webhook.send(message.content, {username: memberdb.more.roleplay.name, avatarURL: memberdb.more.roleplay.picture, files: [{name: message.attachments.first().filename, attachment: message.attachments.first().proxyURL}]}).catch(() => {message.reply("Sorry. Der Content den du zur Message hinzugefügt hast is just to fucking big for me and daddy discord")})
        }


})