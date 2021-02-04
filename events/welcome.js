var {client} = require("../index")
var MEMBER = require("../Models/MEMBER")

client.on("guildMemberAdd", async (member) => {
    var memberdb = await MEMBER.findOne({"id": member.id})

    if (!member){
        await new MEMBER({"id": member.id, informations: {"name": member.user.username, "avatar": member.user.avatar, "discriminator": member.user.discriminator}}).save()
        console.log(`Created new DB index for ${member.user.username}`)
    }
})