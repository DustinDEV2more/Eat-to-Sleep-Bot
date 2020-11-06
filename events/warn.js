const { client, config} = require('../index.js')
const RichEmbed  = require('discord.js').RichEmbed
const colour = require("../colours.json")
const Main = require('../index.js')
const fs      = require("fs");

const MEMBER = require("../models/MEMBER")

client.on("message",async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ")
    let alias = messageArray[0].replace(prefix, "");
    let args = messageArray.slice(1);
    let permissions = message.guild.members.cache.get(message.author.id).permissions

    if (message.content.startsWith(prefix + "warn")){
        if(permissions.has("BAN_MEMBERS")){
            var badmemberid = args[0].replace("<@", "").replace(">", "").replace("!", "")
            var warngrund = message.content.replace(`${prefix}warn ${args[0]} `, "").replace("--ad", "").replace("--kick", "").replace("--bann", "").replace("--ban", "")
            var memberdb = await MEMBER.find({"info.id": badmemberid})
            if (!message.guild.members.find(x => x.id === badmemberid)){
                message.channel.send(new RichEmbed().setTitle("Fehler").setDescription("Ich konnte denn User auf diesem Server nicht finden").setColor(colour.rot))
                return;
            }
            
            if (!memberdb[0]){
                message.channel.send(new RichEmbed().setTitle("Database Fehler").setDescription("Ich konnte denn User nicht in der Database finden. Ich habe jetzt einen Eintrag in der Database für ihn angelget. Bitte versuche es noch einmal").setColor(colour.rot))
                var newmember = new MEMBER({
                    info:{
                        id: badmemberid
                    }
               })
               newmember.safe()
               return;
            }
            var embed_color = null
            var type = null
            //If ad warn
            if ( message.content.includes("--ad") ){
                memberdb[0].warns.push({type: "ad", from: message.member.id, description: warngrund})
                await MEMBER.findOneAndUpdate({"info.id": badmemberid}, {"warns": memberdb[0].warns})
                embed_color = "#8e24aa"
                type = "AD"
            }
            //If kick warn
            else if ( message.content.includes("--kick") ){
                memberdb[0].warns.push({type: "kick", from: message.member.id, description: warngrund})
                await MEMBER.findOneAndUpdate({"info.id": badmemberid}, {"warns": memberdb[0].warns})
                message.guild.members.cache.kick(badmemberid, {reason: warngrund})
                embed_color = colour.rot
                type = "KICK"
            }
            //If bann warn
            else if ( message.content.includes("--bann") || message.content.includes("--ban") ){
                memberdb[0].warns.push({type: "ban", from: message.member.id, description: warngrund})
                await MEMBER.findOneAndUpdate({"info.id": badmemberid}, {"warns": memberdb[0].warns})
                message.guild.members.cache.ban(badmemberid).ban(badmemberid, {reason: warngrund})
                embed_color = colour.rot
                type = "BAN"
            }
            //normal warn
            else {
            memberdb[0].warns.push({type: "warn", from: message.member.id, description: warngrund})
            await MEMBER.findOneAndUpdate({"info.id": badmemberid}, {"warns": memberdb[0].warns})
            embed_color = colour.gelb
            type = "WARN"
            }
            
            message.guild.channels.cache.get("597165525319155749").send(new RichEmbed()
            .setColor(embed_color)
            .setTitle("CASE " + memberdb[0]["_id"])
            .addField("EXECUTOR", message.guild.members.cache.get(message.author.id).user.tag, true)
            .addField("VICTIM", message.guild.members.cache.get(badmemberid).user.tag, true)
            .addField("TYPE", type, true)
            .addField("DESCRIPTION", warngrund, true)
            )

            message.channel.send(new RichEmbed()
            .setColor(embed_color)
            .setTitle("Verwarnung gespeichert")
            .addField("VICTIM", message.guild.members.cache.get(badmemberid).user.tag, true)
            .addField("TYPE", type, true)
            .addField("DESCRIPTION", warngrund, true)
            )

        }
        }
    

    else if (message.content.includes('discord.gg/'||'discordapp.com/invite/')) {
        if (message.member.hasPermission("PRIORITY_SPEAKER") == false){
            message.delete().then(async () =>{

            var memberdb = await MEMBER.find({"info.id": message.author.id})
            memberdb[0].warns.push({type: "ad", from: client.user.id, description: `Versuchte einen Discord Invite in ${message.channel.name} zu senden`})            
            await MEMBER.findOneAndUpdate({"info.id": message.member.id}, {"warns": memberdb[0].warns})
            
            message.guild.channels.cache.get("597165525319155749").send(new RichEmbed()
            .setColor("#8e24aa")
            .setTitle("CASE " + memberdb[0]["_id"])
            .addField("EXECUTOR", client.user.tag, true)
            .addField("VICTIM", message.author.tag, true)
            .addField("TYPE", "AD", true)
            .addField("DESCRIPTION", `Versuchte einen Discord Invite in ${message.channel.name} zu senden`, true)
            )

            message.channel.send(new RichEmbed()
            .setColor("#8e24aa")
            .setTitle("Automatische Verwarnung gespeichert")
            .addField("VICTIM", message.author.tag, true)
            .addField("TYPE", "AD", true)
            .addField("DESCRIPTION", `Versuchte einen Discord Invite in ${message.channel.name} zu senden`, true)
            )

            }
            )
        }
      }

      if (message.content.includes('@everyone'||'@here')) {
        if (message.member.hasPermission("MENTION_EVERYONE") == false){
            message.delete().then(async () =>{

            var memberdb = await MEMBER.find({"info.id": message.author.id})
            memberdb[0].warns.push({type: "warn", from: client.user.id, description: `Versuchte @everyone oder @here in ${message.channel.name} zu senden`})            
            await MEMBER.findOneAndUpdate({"info.id": message.member.id}, {"warns": memberdb[0].warns})
            
            message.guild.channels.cache.get("597165525319155749").send(new RichEmbed()
            .setColor(colour.gelb)
            .setTitle("CASE " + memberdb[0]["_id"])
            .addField("EXECUTOR", client.user.tag, true)
            .addField("VICTIM", message.author.tag, true)
            .addField("TYPE", "WARN", true)
            .addField("DESCRIPTION", `Versuchte @everyone oder @here in ${message.channel.name} zu senden`, true)
            )

            message.channel.send(new RichEmbed()
            .setColor(colour.gelb)
            .setTitle("Automatische Verwarnung gespeichert")
            .addField("VICTIM", message.author.tag, true)
            .addField("TYPE", "WARN", true)
            .addField("DESCRIPTION", `Versuchte @everyone oder @here in ${message.channel.name} zu senden`, true)
            )

            }
            )
        }}
})

