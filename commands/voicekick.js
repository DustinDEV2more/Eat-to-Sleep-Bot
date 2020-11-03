const { db } = require('../models/MEMBER');

module.exports = {
	name: 'voicekick',
	description: 'Kickt pro Stunde einen Member aus deinem Voicechannel',
    usage: `voicekick [@member#1234]` ,
	async execute (message, args) {

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")
        var dbdata = require("../models/MEMBER")
		
		var dbmember = await dbdata.findOne({"info.id": message.member.id})
		
		if (dbmember.coins.amount < 150) return message.reply("Jeder Voicekick kostet 150<:EatSleepCoin:725823305008939058>.Du hast leider zu wenig davon")
        if (!message.channel.guild.members.cache.get(args[0].replace("<@", "").replace(">", "").replace("!", ""))) return message.reply("Der angegebne Member wurde nicht gefunden")
		if (message.channel.guild.members.cache.get(args[0].replace("<@", "").replace(">", "").replace("!", "")).voiceChannel != message.member.voiceChannel) return message.reply("Du befindest dich nicht im selben Voicechannel wie der Member den du kicken möchtest")
		
		var kickmember = message.channel.guild.members.cache.get(args[0].replace("<@", "").replace(">", "").replace("!", ""))
		
		kickmember.setVoiceChannel(null)
        await dbdata.findOneAndUpdate({"info.id": message.member.id}, {"coins.amount": dbmember.coins.amount - 150})
        
	},
};