module.exports = {
	name: 'usemyvoice',
	description: '-',
  usage: `usemyvoice ` ,
	execute(message, args) {
        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        var MEMBERS = require("../models/MEMBER")
        async function i() {
            var MEMBER = await MEMBERS.findOne({"info.id": message.member.id})

            if (MEMBER.more.ytvoice == true){
                message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du hast bereits dein Einverständniss zur benutzung deine Stimme in Streams und Videos bezüglich ESNR gegeben"))
            }
            else {
                var date = new Date()
                message.channel.send(new RichEmbed().setColor(colour.grün).setDescription("Vielen Dank. Du hast soeben zugestimmt das dir bewusst ist, das in bestimmten Talks deine Stimme für Streams und Videos benutzt werden kann. Du kannst nun alle Channel die etwas mit Streaming zu tuhen haben joinen. Have fun"))
               
                await MEMBERS.findOneAndUpdate({"info.id": message.member.id}, {"more.ytvoice": true})

               client.channels.cache.get("597165525319155749").send(
                new RichEmbed()
                .setColor(colour.grün)
                .setTitle("Use my Voice zustimmung")
               .addField("USER:", message.member.user.tag, true)
               .addField("DBID:", MEMBER["_id"])
               .setTimestamp(date))
            }
        }
        i()
        
    },
};