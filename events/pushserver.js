const { client, config} = require('../index.js')
const { RichEmbed } = require('discord.js')
const mongoose = require("mongoose")
var schedule = require('node-schedule');

client.on("message", async message => {
    if (message.content.startsWith("!d bump") == false) return;
    var memberdb = require("../models/MEMBER")

    message.react("🔄")

    // const filter = m => m.embeds[0].color == 2406327;
    // const filter = m => m.embeds[0].color == 15420513;
    const filter = m => m.author.id == "302050872383242240";

   message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
  .then(async collected => {
      console.log("triggered")
      collected = collected.first()

      if (collected.embeds[0].color == 2406327 == false) return message.react("❌");
      message.react("✅")

      var memberdata = await memberdb.findOne({"info.id": message.member.id})
      message.channel.send(`Vielen Dank für deinen Bump <@${message.member.id}>.\nDir wurden 300<:EatSleepCoin:725823305008939058> gutgeschrieben. Du hast nun insgesammt ${memberdata.coins.amount + 300}<:EatSleepCoin:725823305008939058>`)
      await memberdb.findOneAndUpdate({"info.id": message.member.id}, {"coins.amount": memberdata.coins.amount + 300})

  })
  .catch();

})