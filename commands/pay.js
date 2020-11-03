module.exports = {
	name: 'pay',
        description: 'Gibt einen anderen User einpaar Coins von dir',
        usage: `pay <user/amount of coins> <amount of coins/user>`,
	async execute(message, args) {

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        var dbdata = require("../models/MEMBER")

        var amount = null,
            user   = null

        //Check if first arg is a number and second is a user
        if (isNaN(args[0]) == false && message.channel.guild.members.cache.get(args[1].replace("<@", "").replace(">", "").replace("!", ""))){
            amount = parseInt(args[0])
            user = message.channel.guild.members.cache.get(args[1].replace("<@", "").replace(">", "").replace("!", "")).id
        }

        //Check if first arg is a user and second is a number
        else if (isNaN(args[1]) == false && message.channel.guild.members.cache.get(args[0].replace("<@", "").replace(">", "").replace("!", ""))){
            amount = parseInt(args[1])
            user = message.channel.guild.members.cache.get(args[0].replace("<@", "").replace(">", "").replace("!", "")).id
        }
        //Notifys User if he uses the command wrong
        else {
            return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du hast den Command leider falsch benutzt. Bitte gib einen User und einen gültigen Betrag in Zahlen an"))
        }

        if (user == message.member.id) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du kannst keine Coins an dich selbst weitergeben"))
        if (1 > amount) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Der Betrag muss größer als 0 sein"))
            var payingmember = await dbdata.findOne({"info.id": message.member.id})
        var payedmember = await dbdata.findOne({"info.id": user})

        amount = Math.round(amount)

        //checks if paying member has enough coins and if the amount is bigger then 1
        if (payingmember.coins.amount + 1 > amount == false) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du hast zu wenig coins um diese Überweisung durchzuführen"))
        if (amount > -1 == false) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Haben wir es hier mit einem Mathe Genie zu tuen? Tja. Einen negativ Betrag werde ich nicht zulassen!"))

        //everything seems to be legit. Sending new Coin Amounts to the DB

        var newpayingamount = payingmember.coins.amount - amount
        var newpayedamount = payedmember.coins.amount + amount

        await dbdata.findOneAndUpdate({"info.id": message.member.id}, {"coins.amount": newpayingamount})
        await dbdata.findOneAndUpdate({"info.id": user}, {"coins.amount": newpayedamount})

        message.channel.send(new RichEmbed().setColor(colour.grün).setDescription(`Deine ${amount}<:EatSleepCoin:725823305008939058> wurden erfolgreich zu ${message.channel.guild.members.cache.get(user).displayName} geschickt`))

	},
};
