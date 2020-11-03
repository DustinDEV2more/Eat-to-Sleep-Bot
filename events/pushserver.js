const { client, config} = require('../index.js')
const { RichEmbed } = require('discord.js')
const mongoose = require("mongoose")
var schedule = require('node-schedule');

client.on("message", message => {
    if (message.content.startsWith("!d bump") == false) return;
    var memberdb = require("../models/MEMBER")

    setTimeout(async () => {

        var botrespond = client.channels.cache.get(message.channel.id).lastMessage
        

        if (botrespond.author.id != "302050872383242240") return;
        if (botrespond.embeds[0].description.includes("Bump erfolgreich")){
        var memberdata = await memberdb.findOne({"info.id": message.member.id})


            message.channel.send(`Vielen Dank für deinen Bump <@${message.member.id}>.\nDir wurden 300<:EatSleepCoin:725823305008939058> gutgeschrieben. Du hast nun insgesammt ${memberdata.coins.amount + 300}<:EatSleepCoin:725823305008939058>`)
        await memberdb.findOneAndUpdate({"info.id": message.member.id}, {"coins.amount": memberdata.coins.amount + 300})
            
       
        }

    }, 3000)    

})