module.exports = {
	name: 'setrank',
	description: 'Entfernt oder gibt einem belibingen Member Level oder XP',
    usage: `setrank <@user#1234> <rank/xp> <+/-> <beliebige Zahl>` ,
	async execute(message, args) {
       

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        const MEMBER = require("../models/MEMBER")
        
        if (client.guilds.cache.get(message.channel.guild.id).members.cache.get(message.author.id).hasPermission("BAN_MEMBERS")){
            var operation = args[2]
            var what = args[1]
            var zahl = parseInt(args[3])
            var userid = args[0].replace("<@", "").replace(">", "").replace("!", "")
            

            if (message.channel.guild.members.find(x => x.id === userid)){
                if(operation == "+" || operation == "-"){
                    var member = await MEMBER.find({"info.id": userid})

                    let rank = member[0].ranks.rank
                    let xp = member[0].ranks.xp


                    if (what == "xp" || what == "level" || what == "rank"){
                        if (what == "rank"){what = "level"}
                        if (what == "level"){
                            if (operation == "+"){rank += zahl}
                            if (operation == "-"){rank -= zahl}
                        }
                        if (what == "xp"){
                            if (operation == "+"){xp += zahl}
                            if (operation == "-"){xp -= zahl}
                        }
                        await MEMBER.findOneAndUpdate({"info.id": userid}, {"ranks.xp": xp, "ranks.rank": rank}, (err, res) => {if (err){console.log(err)}})

                        message.reply("Ich habe erfolgreich denn ranking Wert von " + client.users.cache.get(userid).username + " auf " + rank + ":" + xp + " gesetzt.")

                    }
                    else {message.reply("Du kannst nur denn Wert von XP und Level bestimmen")}
                    
                }
                else {message.reply("Du kannst nur + oder - machen")}
            }
            else {message.reply("Kann User nicht finden")}
        }
        else (message.reply("Du hast keine Berechtigung dafür"))
    
       
	},
};