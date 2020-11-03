class EventChannel {

    constructor(start, end, eventname, talkname, chatname, embeddata, permcopie, redirect, xpboost) {
        var server = "585511241628516352"

        const { client, config} = require("../../index")
        const { RichEmbed } = require('discord.js')
        const colour = require("../../colours.json")
        const fs      = require("fs");
        var schedule = require('node-schedule');
        
        var xpboostchecker = null

        var openchannels = schedule.scheduleJob(start, function(){
            client.guilds.cache.get(server).createChannel(eventname, "category", client.guilds.cache.get(server).channels.get(permcopie).permissionOverwrites).then(async categorie =>{
               
              client.guilds.cache.get(server).roles.cache.get("712830005452865566").members.forEach(async (m) => {
               await categorie.overwritePermissions(m.id, {"VIEW_CHANNEL": false, "SPEAK": false, "CONNECT": false, "SEND_MESSAGES": false})
              })

               
               await categorie.setPosition(0)
               await categorie.guild.createChannel(chatname, "text").then(async c => {
                   await c.setParent(categorie)
                   await c.lockPermissions()
                   await c.send(embeddata )})
        
                categorie.guild.createChannel(talkname + " 1", "voice").then(async c => {
                   await c.setParent(categorie)
                   await c.lockPermissions()})
                categorie.guild.createChannel( talkname + " 2", "voice").then(async c => {
                   await c.setParent(categorie)
                   await c.lockPermissions()
                })
        
        
               
            }
            )
            if (xpboost == true){
              const MEMBERDB = require("../../models/MEMBER")
              xpboostchecker = setInterval(async () => {
                client.channels.find(t => t.name === talkname + " 1").members.array().forEach( async m => {
                  var dbdata = await MEMBERDB.findOne({"info.id": m.id})
                  await MEMBERDB.findOneAndUpdate({"info.id": m.id}, {"ranks.xp": dbdata.ranks.xp + 1}, (err, res) => {if (err){console.log(err)}})
                })
                client.channels.find(t => t.name === talkname + " 2").members.array().forEach( async m => {
                  var dbdata = await MEMBERDB.findOne({"info.id": m.id})
                  await MEMBERDB.findOneAndUpdate({"info.id": m.id}, {"ranks.xp": dbdata.ranks.xp + 1}, (err, res) => {if (err){console.log(err)}})
                })
              }, 60000)
            }
          
           
           });

        var closechannels = schedule.scheduleJob(end, async function(){
          if (xpboost == true){clearInterval(xpboostchecker)}
            var checkoutchannel = await client.guilds.cache.get(server).createChannel("📤" + talkname + " moveout", "voice").then(async c => await c.setParent(redirect))

            client.guilds.cache.get(server).channels.find(x => x.name === eventname).children.forEach(c => {
              if(c.type == "text") return c.delete();

              const childrenpromises = c.members.array().map(async m => {
                  await m.setVoiceChannel(checkoutchannel)
              })
              Promise.all(childrenpromises).then(() => {
                c.delete()
              })
            })
            client.guilds.cache.get(server).channels.find(x => x.name === eventname).delete()

              var checkmoveout = setInterval(async () => {
                  var moveoutsize = client.channels.cache.get(checkoutchannel.id).members.array().length
                  if (moveoutsize != 0) return;
                 await checkoutchannel.delete()
                 clearInterval(checkmoveout)
              }, 5000)
        
        
           })



}
}

module.exports = EventChannel