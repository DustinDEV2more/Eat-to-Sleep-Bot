module.exports = {
	name: 'coins',
	description: 'Gibt dir eine übersicht über deine Finanzen auf Eat, Sleep, Nintendo, Repeat',
    usage: `coins` ,
	async execute(message, args) {
       

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        var Member = require("../models/MEMBER")
        
        var user = message.author.id
        if (args[0]){
            if (client.guilds.get("585511241628516352").members.find(x => x.id === args[0].replace("<@", "").replace(">", "").replace("!", ""))){
            user = client.users.get(args[0].replace("<@", "").replace(">", "").replace("!", "")).id
        }}
        
        var database = await Member.findOne({"info.id": user})
       
        message.channel.send(new RichEmbed().setColor(colour.gelb).setTitle(`Kontostand von ${client.users.get(user).tag}`)
        .setDescription(`**Eat, Sleep Coins: ${database.coins.amount}<:EatSleepCoin:725823305008939058>**`)
        .setFooter("Dieser Command wird demnächst noch verschönert. Er wird dann so ähnlich aussehen wie _rank und mehr informationen über bisherige ausgaben und einnahmen haben")
        )
	},
};