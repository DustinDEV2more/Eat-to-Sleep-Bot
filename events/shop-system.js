const { client, config, items} = require('../index.js')
const { RichEmbed } = require('discord.js')
const colour = require("../colours.json")
const fs = require("fs")


client.channels.cache.get("728261970851004446").fetchMessage("728262106176159755").then(m => {
var embed = new RichEmbed().setColor("RANDOM").setTitle("Eat, Sleep - Shop").setFooter("Um etwas zu kaufen musst du '_buy <item nummer>' in einen anderen Chat eingeben")

items.forEach(i => {
    embed.addField(`${i.id}. ` + i.name, `**Preis:** ${i.a}<:EatSleepCoin:725823305008939058>\n**Beschreibung:** ${i.des}`, true)
})

setTimeout(() => {m.edit(embed)
}, 10000)
})