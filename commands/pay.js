exports.command = {
	name: 'pay coins',
	call: 'pay',
	description: 'Lässt dich deine Coins an einen anderen user übergeben',
    usage: `pay <user/coins> <coins/user>`,
    permissions: [],
	async execute(message, args) {
		const embed = require("../Embed")
        const MEMBER = require("../Models/MEMBER")
        
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
            return message.channel.send(embed.error_user("Fehlende oder falsche Angaben", "Bist du sicher das du die Anzahl der Coins und den Member an den du etwas überweisen möchtest richtig angegeben hast?"))
        }

        if (user == message.member.id) return message.channel.send(embed.error_user("Falsche Angabe", "Du kannst nicht an dich selbst etwas überweisen"))
        if (1 > amount) return message.channel.send(embed.error_user("Falsche Angabe", "Der Betrag muss größer als 0 sein"))
        var payingmember = await MEMBER.findOne({"id": message.member.id})
        var payedmember = await MEMBER.findOne({"id": user})

        amount = Math.round(amount)

        if (payingmember.currencys.coins.amount + 1 > amount == false) return message.channel.send(embed.error_user("Nicht genung Coins", "Du hast zu wenig Coins um diese Aktion durchzuführen"))
        if (amount > -1 == false) return message.channel.send(embed.error_user("?", "No u"))

        var newpayingamount = payingmember.currencys.coins.amount - amount
        var newpayedamount = payedmember.currencys.coins.amount + amount

        payedmember.currencys.coins.log.push({"description": `überweisung von ${message.member.user.tag}`, "value": amount, "date": new Date()})
        payingmember.currencys.coins.log.push({"description": `überweisung an ${message.channel.guild.members.cache.get(user).user.tag}`, "value": 0 - amount, "date": new Date()})
    
        await MEMBER.findOneAndUpdate({"id": message.member.id}, {"currencys.coins.amount": newpayingamount, "currencys.coins.log": payingmember.currencys.coins.log})
        await MEMBER.findOneAndUpdate({"id": user}, {"currencys.coins.amount": newpayedamount, "currencys.coins.log": payedmember.currencys.coins.log})

        message.channel.send(embed.success("Überweisung erfolgreich", `Deine ${amount}<:EatSleepCoin:725823305008939058> wurden erfolgreich zu ${message.channel.guild.members.cache.get(user).displayName} geschickt`))
    },
};