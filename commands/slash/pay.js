exports.command = {
	name: 'pay',
	description: 'Lässt dich Coins an eine andere Person überweisen',
    roles: [],

    options: [
        {
        "name": "user",
        "description": "Person an den du Coins übertragen möchtest",
        "type": 6,
        "required": true
        },
        {
        "name": "coins",
        "description": "Anzahl der coins die du an die Person überweisen möchtest",
        "type": 4,
        "required": true
        },
    ],
	async execute(int, args, send, client) {
        const embed = require("../../modules/Embed");
        const MEMBER = require("../../Models/MEMBER")
        
        var amount = args.find(x => x.name == "coins").value,
        user   = args.find(x => x.name == "user").value

        if (user == int.member.user.id) return send(int, embed.error_user("Falsche Angabe", "Du kannst nicht an dich selbst etwas überweisen"))
        if (1 > amount) return send(int, embed.error_user("Falsche Angabe", "Der Betrag muss größer als 0 sein"))
        var payingmember = await MEMBER.findOne({"id": int.member.user.id})
        var payedmember = await MEMBER.findOne({"id": user})

        amount = Math.round(amount)

        if (payingmember.currencys.coins.amount + 1 > amount == false) return send(int, embed.error_user("Nicht genung Coins", "Du hast zu wenig Coins um diese Aktion durchzuführen"))
        if (amount > -1 == false) return send(int, embed.error_user("?", "No u"))

        var newpayingamount = payingmember.currencys.coins.amount - amount
        var newpayedamount = payedmember.currencys.coins.amount + amount

        payedmember.currencys.coins.log.push({"description": `überweisung von ${client.users.cache.get(int.member.user.id).tag}`, "value": amount, "date": new Date()})
        payingmember.currencys.coins.log.push({"description": `überweisung an ${client.users.cache.get(user).tag}`, "value": 0 - amount, "date": new Date()})
    
        await MEMBER.findOneAndUpdate({"id": int.member.user.id}, {"currencys.coins.amount": newpayingamount, "currencys.coins.log": payingmember.currencys.coins.log})
        await MEMBER.findOneAndUpdate({"id": user}, {"currencys.coins.amount": newpayedamount, "currencys.coins.log": payedmember.currencys.coins.log})

        send(int, embed.success("Überweisung erfolgreich", `Deine ${amount} Coins wurden erfolgreich zu ${client.guilds.cache.get(int.guild_id).members.cache.get(user).displayName} geschickt`))
    },
};