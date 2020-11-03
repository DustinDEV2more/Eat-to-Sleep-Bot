const { client, config,} = require("../index")
const { RichEmbed, MessageReaction } = require('discord.js')
const StarboardDB = require("../models/STARBOARDS")


var starsrequiered = 3,
channelid = "724743862404382740"


//Listen vor Star(add)
client.on("messageReactionAdd", async (MessageReaction, User) => {
    var message = MessageReaction.message,
        starcount = MessageReaction.count

if (MessageReaction.emoji.name != "⭐") return;
if (MessageReaction.count < starsrequiered) return;

console.log("checks passed")

//check if message is already in starboard
var dbdata = await StarboardDB.find({"msgid": MessageReaction.message.id})
if (await dbdata.length == 0){
    //New Starboard Message

    var embed = new RichEmbed().setColor("#fef200").setAuthor(message.member.displayName, message.author.displayAvatarURL)
.setDescription(`**[Zur Message](${message.url}) - ${starcount} ⭐**\n\n` +
message.cleanContent)
.setTimestamp(message.createdAt)

var starmessage = await client.channels.cache.get(channelid).send(embed)

    new StarboardDB({
        msgid: MessageReaction.message.id,
        msglink: MessageReaction.message.url,
        userid: MessageReaction.message.author.id,
        userPBuri: MessageReaction.message.author.displayAvatarURL,
        stars: MessageReaction.count,
        starmsgid: starmessage.id,
        date: message.createdAt
    }).save()
}
else {
    //Old Starboard Message
    await StarboardDB.findOneAndUpdate({"msgid": MessageReaction.message.id}, {"stars": dbdata[0].stars + 1})

    //NEED TO UPDATE MESSAGE!
var embed = new RichEmbed().setColor("#fef200").setAuthor(message.member.displayName, message.author.displayAvatarURL)
.setDescription(`**[Zur Message](${message.url}) - ${MessageReaction.count} ⭐**\n\n` +
message.cleanContent)
.setTimestamp(dbdata[0].date)

client.channels.cache.get(channelid).fetchMessage(dbdata[0].starmsgid).then(m => m.edit(embed))

}
})

//Listen vor Star(remove)
client.on("messageReactionRemove", async (MessageReaction, User) => {
    var message = MessageReaction.message,
        starcount = MessageReaction.count

if (MessageReaction.emoji.name != "⭐") return;
if (MessageReaction.count < starsrequiered) return;

console.log("checks passed")

//check if message is already in starboard
var dbdata = await StarboardDB.find({"msgid": MessageReaction.message.id})
if (await dbdata.length == 0){}
else {
    //Old Starboard Message
    await StarboardDB.findOneAndUpdate({"msgid": MessageReaction.message.id}, {"stars": dbdata[0].stars - 1})

    //NEED TO UPDATE MESSAGE!
var embed = new RichEmbed().setColor("#fef200").setAuthor(message.member.displayName, message.author.displayAvatarURL)
.setDescription(`**[Zur Message](${message.url}) - ${MessageReaction.count} ⭐**\n\n` +
message.cleanContent)
.setTimestamp(dbdata[0].date)

client.channels.cache.get(channelid).fetchMessage(dbdata[0].starmsgid).then(m => m.edit(embed))

}
})