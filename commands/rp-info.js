const MEMBER = require('../models/MEMBER');

module.exports = {
	name: 'rp',
	description: 'Gibt dir alle Infos und Einstellungsmöglichkeiten für den Roleplay Channel',
    usage: `rp {[info <user> / change {[name/age/gender/picture]}{option} ]}` ,
	async execute(message, args) {
       

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        var Member = require("../models/MEMBER")
        
        if (args[0].toLowerCase() == "info"){
            var user = message.author.id
            if (args[1]){
                if (client.guilds.get("585511241628516352").members.find(x => x.id === args[1].replace("<@", "").replace(">", "").replace("!", ""))){
                user = client.users.get(args[1].replace("<@", "").replace(">", "").replace("!", "")).id
            }}
            
            var database = await Member.findOne({"info.id": user})
            database = database.more.roleplay
            if (database.gender == 0) {database.genderword = "-"}
            if (database.gender == 1) {database.genderword = "male"}
            if (database.gender == 2) {database.genderword = "female"}
           
            message.channel.send(new RichEmbed().setColor(colour.gelb).setTitle(`Roleplay infos von ${client.users.get(user).tag}`)
            .addField("Name:", database.name, true)
            .addField("Alter:", database.age, true)
            .addField("Geschlecht:", database.genderword, true)
            .setThumbnail(database.picture)
            .setFooter("Um Infos an deinem eigenen rp Charackter zu ändern, schreibe _rp change")
            )
        } 
        else if (args[0].toLowerCase() == "change"){
            if (!args[1]) return message.channel.send(
                new RichEmbed().setColor(colour.rot).setDescription("Bitte benutze den Command in einem der Folgenden möglichkeiten:\nrp change name <neuername>\nrp change age <neues alter>\nrp change gender <0 für -/1 für male/2 für female>\nrp change picture <neues Profilbild URL>\n\nTipp. Lade dein neues Profilbild erst auf Discord Hoch und kopiere die dann die URL des Bildes von dort")
            )

            if (!args[2]) return message.channel.send(
                new RichEmbed().setColor(colour.rot).setDescription("Bitte benutze den Command in einem der Folgenden möglichkeiten:\nrp change name <neuername>\nrp change age <neues alter>\nrp change gender <0 für -/1 für male/2 für female>\nrp change picture <neues Profilbild URL>\n\nTipp. Lade dein neues Profilbild erst auf Discord Hoch und kopiere die dann die URL des Bildes von dort")
            )


        if (args[1].toLowerCase() == "name") {
            var name = args.slice(2, args.length).join(" ")
        await MEMBER.findOneAndUpdate({"info.id": message.author.id}, {"more.roleplay.name": name}).then(message.react("✅"))
    }
        if (args[1].toLowerCase() == "age") {
            await MEMBER.findOneAndUpdate({"info.id": message.author.id}, {"more.roleplay.age": args[2]}).then(message.react("✅"))
        }
        if (args[1].toLowerCase() == "gender") {
        await MEMBER.findOneAndUpdate({"info.id": message.author.id}, {"more.roleplay.gender": parseInt(args[2])}).then(message.react("✅"))
    }
        if (args[1].toLowerCase() == "picture") {
            await MEMBER.findOneAndUpdate({"info.id": message.author.id}, {"more.roleplay.picture": args[2]}).then(message.react("✅"))
        }
        }
        
        else {
            message.reply("was?")
        }
	},
};