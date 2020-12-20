exports.command = {
	name: 'daily coins',
	call: 'daily',
	description: 'Gibt dir jeden Tag coins',
    usage: `daily`,
    permissions: [],
	async execute(message, args) {
		const embed = require("../Embed")
        const MEMBER = require("../Models/MEMBER")
        
        var memberdb = await MEMBER.findOne({"id": message.member.id})
        if (!memberdb) return;

        var datenow = new Date()
        var last_daily = memberdb.currencys.coins.last_daily
        if (last_daily == null || memberdb.currencys.coins.last_daily.setHours(last_daily.getHours() + 24) < datenow){
            //last daily was redeemed 24 Hours ago or was never redeemed before
            var newlog = memberdb.currencys.coins.log
            newlog.push({"description": "daily coins", "value": 150, "date": datenow})

           await MEMBER.findOneAndUpdate({"id": message.member.id}, {"currencys.coins.amount": memberdb.currencys.coins.amount + 150, "currencys.coins.last_daily": datenow, "currencys.coins.log": newlog})
           message.channel.send(embed.success("Tägliche Belohnung eingelöst", "Deine Tägliche Belohnung wurde eingelöst. Ich habe 150<:EatSleepCoin:725823305008939058> zu deinem Account hinzugefügt"))
        }
        else {
            //last daily was redeemed within the last 24 hours
            message.channel.send(embed.error_user("Tägliche Belohnung bereits eingelöst", `Du hast deine tägliche Belohnung bereits eingelöst`))
        }

    },
};