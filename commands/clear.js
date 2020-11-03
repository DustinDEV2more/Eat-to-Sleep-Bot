module.exports = {
	name: 'clear',
	description: 'Löscht bis zu 100 Nachichten in Chat',
    usage: `clear [Zahl von 1-100]` ,
	execute(message, args) {

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")
        
        if (client.guilds.cache.get(message.guild.id).members.cache.get(message.author.id).hasPermission("MANAGE_MESSAGES")){
            if (args[0] < 101){
            message.channel.fetchMessages({ limit: args[0] }).then(messages => {


                message.channel.bulkDelete(messages).then( () => { 
                    message.channel.send(
                        new RichEmbed().setTitle("Erledigt").setDescription(`Ich habe **${messages.array().length}** Nachichten gelöscht`).setColor(colour.blau)
                    ).then(sendetmessage => {
                        setTimeout(() => {sendetmessage.delete()
                        }, 15000)
                    })
                    })
            }
            )
        }
        else {message.channel.send(`<@${message.author.id}>. Sorry aber die Discord API erlaubt es nicht mehr als 100 Nachichten auf einmal zu löschen`).then(sendetmessage => {
            setTimeout(() => { if (sendetmessage.deletable){sendetmessage.delete()}
                if(message.deletable){message.delete()}}, 15000)})} 
        }
    
else {message.channel.send(`<@${message.author.id}>. Sorry aber du hast nicht die Berechtigung \"MANAGE_MESSAGES\"`).then(sendetmessage => {
    setTimeout(() => {sendetmessage.delete()
        message.delete()}, 15000
        )})}

	},
};