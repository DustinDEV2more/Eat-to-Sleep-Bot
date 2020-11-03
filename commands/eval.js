module.exports = {
	name: 'eval',
	description: 'Führt den angegebenen Code aus',
    usage: `eval [Code]` ,
	execute(message, args) {

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        const { inspect } = require("util")
        
        if (client.guilds.cache.get(message.guild.id).members.cache.get(message.author.id).hasPermission("ADMINISTRATOR")){
         const input = args.join(" ")

        try {

            let output = eval(input)

            if (typeof output !== "string") output = inspect(output);

            if (output.size > 1000) output = `${output.substr(0,997)}...`
            if (input.size > 1000) input = `${input.substr(0,997)}...`

            message.channel.send(new RichEmbed().setTitle("Eval(JS): Executet by " + message.author.tag).addField("Input:", "```js\n" + input + "```").addField("Output:", "```CSS\n" + output + "```"))
            
        } catch (error) {
            message.channel.send(new RichEmbed().setColor(colour.rot).setTitle("Error").setDescription("```diff\n- " + error +"```"))
        }

        }

	},
};