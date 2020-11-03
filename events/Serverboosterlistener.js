const { client, config} = require('../index.js')
const { RichEmbed } = require('discord.js')
const colour = require("../colours.json")
const Main = require('../index.js')
const fs      = require("fs");

const MEMBER = require("../models/MEMBER")

client.on("guildMemberUpdate", (oldm, newm) => {
    if (oldm.roles.find(r => r.name === "Server Booster") == false && newm.roles.find(r => r.name === "Server Booster") == true){
        newm.guild.channels.cache.get("586177035278483466").send(
            new RichEmbed().setThumbnail("https://pbs.twimg.com/media/EWdeUeHXkAQgJh7.png")
            .setColor("#ff19f3")
            .setTitle("Neuer Server Boost")
            .setDescription(`Vielen Dank an @${oldm.user.tag} für deinen Server Boost! Als kleines Danke bekommst du die Server Boost Rolle und 500 Level in unserem Level System`)
        ).then(async () => {
            var MEMBERDATA = await MEMBER.findOne({"info.id": newm.id})
            var aktuell = MEMBERDATA.ranks.rank
            await MEMBER.findOneAndUpdate({"info.id": newm.id}, {"ranks.rank": aktuell + 500})
        })
    }
})

