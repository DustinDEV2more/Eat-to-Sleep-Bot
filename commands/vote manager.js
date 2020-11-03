module.exports = {
	name: 'vote',
	description: 'Erstellt/Beendet einen Vote',
    usage: `vote [create/start Question | Anwser 1 | Awnser 2 | Awnser 3 ...]/[end/remove]` ,
	execute(message, args) {
        

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")
        const VOTEDB = require("../models/VOTES")
        
        if (client.guilds.cache.get(message.guild.id).members.cache.get(message.author.id).hasPermission("ADMINISTRATOR")){

           async function createvote(){
            args = args.join(" ")
            const questionarrey = args.replace(`${config.prefix}vote `, "").replace("start ", ""). replace("create", "").split("|")
            const question = questionarrey[0]
            const awnsers = questionarrey.slice(1)
            const awnsersq = []
            awnsers.forEach(a => {
                awnsersq.push({awnser: a, count: 0})
            })
            

           var checkvotes = await VOTEDB.find({channel: message.channel.id, open: true})
            if (checkvotes.length != 0){
                message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("In diesem Channel läuft bereits aktuell ein Vote. Bitte beende denn aktuellen und eröffne danach einen neuen"))
                return;
            }
            const embed = new RichEmbed().setTitle("**📝Abstimmung:** " + question)
            .setDescription("")
            .setColor("RANDOM")
            .setFooter("Du kannst mit den Reaktionen abstimmen!\nDu kannst nur eine Stimme abgeben!\nDu kannst deine Stimme nicht renommieren!")
            
            awnsers.forEach(a => {
                const number = awnsers.indexOf(a).toString().replace("1", ":two:").replace("2", ":three:").replace("3", ":four:").replace("4", ":five:").replace("5", ":six:").replace("6", ":seven:").replace("7", ":eight:").replace("8", ":nine:").replace("0", ":one:")
                embed.setDescription(embed.description + `${number} ${a}: \`0 Stimmen\`\n\n`)
            })

             var msg = message.channel.send(new RichEmbed().setColor(colour.blau).setDescription("Vote wird erstellt... Bitte warten"))
            message.delete()

            msg.then(msgn => {
                new VOTEDB({q: question, a: awnsersq, votet: [], creator: message.author.id, channel: message.channel.id, message: msgn.id}).save()
                .then(() => {
                msgn.edit(embed).then( async msgr => {
                   var awsersize = awnsers.length
                   var zahl = 0
                   
                    var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]
                      if (awnsers[0]){await msgn.react(reaction_numbers[1])}
                      if (awnsers[1]){await msgn.react(reaction_numbers[2])}
                      if (awnsers[2]){await msgn.react(reaction_numbers[3])}
                      if (awnsers[3]){await msgn.react(reaction_numbers[4])}
                      if (awnsers[4]){await msgn.react(reaction_numbers[5])}
                      if (awnsers[5]){await msgn.react(reaction_numbers[6])}
                      if (awnsers[6]){await msgn.react(reaction_numbers[7])}
                      if (awnsers[7]){await msgn.react(reaction_numbers[8])}
                      if (awnsers[8]){await msgn.react(reaction_numbers[9])}
                      
                   
                })
                })
            })

            
            }

            async function removevote(){
           var checkvotes = await VOTEDB.find({channel: message.channel.id, open: true, creator: message.author.id})
           if (checkvotes < 1) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("In diesem channel sind aktuell keine offenen Votes die du schließen könntest"))
           
           var votes = await VOTEDB.findOneAndUpdate({channel: message.channel.id, open: true, creator: message.author.id}, {open: false, closedat: new Date()})


            const embed = new RichEmbed().setTitle("**📊Abstimmungs Ergebniss:** " + votes.q)
            .setDescription("")
            .setColor("RANDOM")
            .setFooter("Bitte nicht mehr abstimmen!")
            
            votes.a.forEach(a => {
                const number = votes.a.indexOf(a).toString().replace("1", ":two:").replace("2", ":three:").replace("3", ":four:").replace("4", ":five:").replace("5", ":six:").replace("6", ":seven:").replace("7", ":eight:").replace("8", ":nine:").replace("0", ":one:")
                embed.setDescription(embed.description + `${number} ${a.awnser}: \`${a.count} Stimmen\`\n\n`)
            })
            
            message.channel.send(embed)
           

        }



            if (args[0].startsWith("start") || args[0].startsWith("create")) {createvote()}
            if (args[0].startsWith("end") || args[0].startsWith("remove")) {removevote ()}
        }
        else {
            message.channel.send("Du hast leider nicht die Berechtigung um Abstimmungen zu erstellen")
        }

	},
};