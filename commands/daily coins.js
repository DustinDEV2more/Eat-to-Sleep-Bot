module.exports = {
	name: 'daily',
	description: 'Gibt dir aller 24 Stunden 150 Coins',
    usage: `daily` ,
	async execute(message, args) {
       

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        message.channel.send(new RichEmbed().setColor(colour.rot).setDescription(`No you`))
    },
};
