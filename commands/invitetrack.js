module.exports = {
	name: 'invite',
	description: 'Erstellt einen Invite Tag',
    usage: `invite invitelink invitetag` ,
	execute(message, args) {

        const INVITES = require("../models/INVITES")

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")
        
        async function dosd() {
            if (client.guilds.cache.get(message.guild.id).members.cache.get(message.author.id).hasPermission("ADMINISTRATOR")){
                var invitecode = args[0].replace("https://discord.gg/", "")
                var invitetag = args[1]
                console.log(invitecode, invitetag)
                var Invitedb  = await INVITES.find({"code": invitecode})
                if (Invitedb.length > 0) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Dieser Invite wurde bereits mit `" + Invitedb[0].code + "#" + Invitedb[0].tag + "` getagt. Sorry aber da musst du wohl einen neuen erstellen"))
                
                var embed = new RichEmbed().setColor(colour.grün).setDescription("Dein Invite wurde nun mit dem `" + invitecode + "#" + invitetag + "` Tag versehen")
               await new INVITES({"code": invitecode, "tag": invitetag}).save().then(() => {
                    message.channel.send(embed)
                })
            }
            else {
                message.channel.send("Du hast leider nicht die Berechtigung um Trackinginvites zu erstellen")
            }
        }
        dosd()
        

	},
};