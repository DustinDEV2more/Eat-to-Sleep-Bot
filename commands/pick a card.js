module.exports = {
	name: 'pickacard',
        description: 'Mit diesem Command kannst du um eine beliebige Anzahl an Münzen spielen und diese verdoppen oder verlieren. Du bekommst 2 Karten, Davon ist eine ein Ass und die anderen beiden sind zwei Flops, Wenn du das Ass ziehst wird dein Gewinn um 150% erhöht. Wenn du einen Flopp ziehst verlierst du deinen Einsatz.',
        usage: `pickacard <einsatzt>`,
	async execute(message, args) {

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")
        var AsciiTable = require('ascii-table')


        var dbdata = require("../models/MEMBER")
        var memberdb = await dbdata.findOne({"info.id": message.member.id})

        var einsatz = parseInt(args[0])
        if (einsatz < 0) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Just no"))
        if (isNaN(einsatz)) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du musst einen gültigen Betrag zum zocken angeben"))

        if (einsatz > memberdb.coins.amount) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Wir spielen nicht um Geld was nicht existiert. Bitte sätze deinen Einsatz niedriger oder geh halt arbeiten"))

        //generate deck
        var deck = [false, false, false]

        var random = Math.floor(Math.random() * deck.length)
        // if (random > 2) {random = 2}
        // if (random < 0) {random = 0}
        deck[random] = true



        var msg = await message.channel.send(new RichEmbed().setColor("RANDOM").setDescription("Der Dealer mischt ein Deck aus 2 Flops und einem Ass. Er legt die 3 Karten auf den Tisch. **Wähle eine der Karten aus:**"))
        var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]

        await msg.react(reaction_numbers[1])
        await msg.react(reaction_numbers[2])
        await msg.react(reaction_numbers[3])

        // Create a reaction collector
        const filter = (reaction, user) => user.id === message.member.id && [reaction_numbers[1], reaction_numbers[2], reaction_numbers[3]].includes(reaction.emoji.name)
        msg.awaitReactions(filter, { time: 15000, max: 1 })
        .then(async collected => {
                msg.clearReactions()
                if (collected.size == 0) return msg.edit(new RichEmbed().setColor(colour.rot).setDescription("Du hast länger als 60 Sekunden gebraucht. Die Nachicht ist abgelaufen"))
                var votetfor = parseInt(collected.first().emoji.name.replace("1⃣", "0").replace("2⃣", "1").replace("3⃣", "2").replace("4⃣", "3").replace("5⃣", "4").replace("6⃣", "5").replace("7⃣", "6").replace("8⃣", "7").replace("9⃣", "8"))
                var Ass = deck.indexOf(deck.find(x => x === true))

                //User Picks Ass
                if (votetfor - 1 == Ass){
                        await dbdata.findOneAndUpdate({"info.id": message.member.id}, {"coins.amount": memberdb.coins.amount + einsatz * 1.5})
                        msg.edit(new RichEmbed().setColor("#f1c40f").setTitle(`Du hast das Ass gezogen. Dein Einsatz von **${einsatz}**<:EatSleepCoin:725823305008939058> wurde auf **${einsatz * 1.5}** erhöht`))
                }
                else {        await dbdata.findOneAndUpdate({"info.id": message.member.id}, {"coins.amount": memberdb.coins.amount - einsatz})
                msg.edit(new RichEmbed().setColor("#34495e").setTitle(`Du hast einen Flop gezogen. Du hast deinen Einsatz von **${einsatz}**<:EatSleepCoin:725823305008939058> verloren`))
                }
        })
        .catch(console.error);


        

        

	},
};
