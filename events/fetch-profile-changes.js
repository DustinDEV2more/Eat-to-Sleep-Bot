var {client} = require("../index")
var MEMBER = require("../Models/MEMBER")
var schedule = require("node-schedule")

 var refresh_at_0 = schedule.scheduleJob("0 0 * * *", async function (){

        var dbmember = await MEMBER.find({})
        client.guilds.cache.get("585511241628516352").members.cache.forEach(async member => {
            var databasemember = dbmember.find(x => x.id == member.id)
    
            //checks if discord data is not the same with database data
            if (databasemember == undefined){
                console.log(member.user.username + " is not in database")
                return;
            }
            if (member.user.username != databasemember.informations.name || member.user.discriminator != databasemember.informations.discriminator || member.user.avatar != databasemember.informations.avatar){
                await MEMBER.findOneAndUpdate({"id": member.id}, {"informations.name": member.user.username, "informations.discriminator": member.user.discriminator, "informations.avatar": member.user.avatar})
            }
        })
        
    
 })
