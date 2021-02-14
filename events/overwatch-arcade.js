var {client} = require("../index")
const RichEmbed = require("discord.js").MessageEmbed
const schedule = require("node-schedule")
const fetch = require("node-fetch")
const { api } = require("../commands/musik")

var refresh_at_0 = schedule.scheduleJob("5 1 * * *", async function (){
    var apiresponse = await fetch("https://overwatcharcade.today/api/overwatch/today").then(res => res.json())
    console.log("triggered")
    if (apiresponse.is_today){
    console.log("updating messages...")
    updatemsgs(apiresponse);
    }
    else {
    console.log("wait for another 10 Minutes...")
        wait10minutes();
        function wait10minutes(){
            setTimeout(async () => {
            var apiresponsesecond = await fetch("https://overwatcharcade.today/api/overwatch/today").then(res => res.json())
                if (apiresponsesecond.is_today == false) return wait10minutes();
                if (apiresponsesecond.is_today == true) {
                    updatemsgs(apiresponsesecond);
                }
            }, 600000)
        }
    }
})

function updatemsgs(apires) {

    //Message 1
    var channel = client.channels.cache.get("808004526795784192")

    channel.messages.fetch("808009363536347146").then(msg => {
        var tile = apires.modes.tile_1
        var embed = new RichEmbed().setTitle(tile.name).setColor("#36393E").setThumbnail(tile.image)
        if (tile.players != "-") embed.addField("Spielbesetzung:", tile.players)
        if (tile.label != null) embed.setTitle(embed.title + ` \`[${tile.label}]\``)
        msg.edit(embed)
    })

    //message 2
    channel.messages.fetch("808009367018274856").then(msg => {
        var tile = apires.modes.tile_2
        var embed = new RichEmbed().setTitle(tile.name).setColor("#36393E").setThumbnail(tile.image)
        if (tile.players != "-") embed.addField("Spielbesetzung:", tile.players)
        if (tile.label != null) embed.setTitle(embed.title + ` \`[${tile.label}]\``)
        msg.edit(embed)
    })

    //message 3
    channel.messages.fetch("808009370281181204").then(msg => {
        var tile = apires.modes.tile_3
        var embed = new RichEmbed().setTitle(tile.name).setColor("#36393E").setThumbnail(tile.image)
        if (tile.players != "-") embed.addField("Spielbesetzung:", tile.players)
        if (tile.label != null) embed.setTitle(embed.title + ` \`[${tile.label}]\``)
        msg.edit(embed)
    })

    //message 4
    channel.messages.fetch("808009372885975151").then(msg => {
        var tile = apires.modes.tile_4
        var embed = new RichEmbed().setTitle(tile.name).setColor("#36393E").setThumbnail(tile.image)
        if (tile.players != "-") embed.addField("Spielbesetzung:", tile.players)
        if (tile.label != null) embed.setTitle(embed.title + ` \`[${tile.label}]\``)
        msg.edit(embed)
    })

    //message 5
    channel.messages.fetch("808009376358858762").then(msg => {
        var tile = apires.modes.tile_5
        var embed = new RichEmbed().setTitle(tile.name).setColor("#36393E").setThumbnail(tile.image)
        if (tile.players != "-") embed.addField("Spielbesetzung:", tile.players)
        if (tile.label != null) embed.setTitle(embed.title + ` \`[${tile.label}]\``)
        msg.edit(embed)
    })

    //message 6
    channel.messages.fetch("808009391843573810").then(msg => {
        var tile = apires.modes.tile_6
        var embed = new RichEmbed().setTitle(tile.name).setColor("#36393E").setThumbnail(tile.image)
        if (tile.players != "-") embed.addField("Spielbesetzung:", tile.players)
        if (tile.label != null) embed.setTitle(embed.title + ` \`[${tile.label}]\``)
        msg.edit(embed)
    })

    //message 7
    channel.messages.fetch("808009477189140530").then(msg => {
        var tile = apires.modes.tile_7
        var embed = new RichEmbed().setTitle(tile.name).setColor("#36393E").setThumbnail(tile.image)
        if (tile.players != "-") embed.addField("Spielbesetzung:", tile.players)
        if (tile.label != null) embed.setTitle(embed.title + ` \`[${tile.label}]\``)
        msg.edit(embed)
    })

        //info message
        
        channel.messages.fetch("808009733138153473").then(msg => {
            msg.edit(new RichEmbed().setColor("RANDOM").setDescription("Information by [overwatcharcade.today](https://overwatcharcade.today/) - User generated content").setTimestamp(new Date()).setFooter("Last Update: "))
        })

}