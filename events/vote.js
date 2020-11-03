const { client, config} = require('../index.js')
const { RichEmbed } = require('discord.js')
const colour = require("../colours.json")
const Main = require('../index.js')
const fs      = require("fs");
const VOTEDB = require("../models/VOTES")


client.on("messageReactionAdd", async (Reaction, user) => {
    if (user.bot) return;
    var DB =  await VOTEDB.findOne({message: Reaction.message.id, open: true})
    if (!DB) return;

    if (DB.voted.includes(user.id)){ return Reaction.remove(user)}
if (client.guilds.cache.get("585511241628516352").roles.cache.get("712830005452865566").members.find(x => x.id === user.id)) return Reaction.remove(user);

    var votetfor = parseInt(Reaction.emoji.name.replace("1⃣", "0").replace("2⃣", "1").replace("3⃣", "2").replace("4⃣", "3").replace("5⃣", "4").replace("6⃣", "5").replace("7⃣", "6").replace("8⃣", "7").replace("9⃣", "8"))
    if (typeof votetfor != "number") return console.log("Break because of Number check");

    var newdb = DB;
    newdb.a[votetfor].count += 1
    newdb.voted.push(user.id)

    const embed = new RichEmbed().setTitle("**📝Abstimmung:** " + DB.q)
            .setDescription("")
            .setColor("RANDOM")
            .setFooter("Du kannst mit den Reaktionen abstimmen!\nDu kannst nur eine Stimme abgeben!\nDu kannst deine Stimme nicht renommieren!")


            newdb.a.forEach(a => {
                const number = newdb.a.indexOf(a).toString().replace("1", ":two:").replace("2", ":three:").replace("3", ":four:").replace("4", ":five:").replace("5", ":six:").replace("6", ":seven:").replace("7", ":eight:").replace("8", ":nine:").replace("0", ":one:")
                embed.setDescription(embed.description + `${number} ${a.awnser}: \`${a.count} Stimmen\`\n\n`)
            })

            Reaction.message.edit(embed)
            await VOTEDB.findOneAndUpdate({message: Reaction.message.id, open: true}, {a: newdb.a, voted: newdb.voted})
            Reaction.remove(user)
})