const { client, config, database} = require('../index')
const { RichEmbed } = require('discord.js')
const colour = require("../colours.json")
const fs      = require("fs");
var schedule = require('node-schedule');
const mongoose = require("mongoose")
const MEMBER = require("../models/MEMBER")

client.cooldown = []
exports.messagexp = async function messagexp(message) {
    if (client.guilds.get("585511241628516352").roles.get("712830005452865566").members.find(x => x.id === message.author.id)) return;
    if (client.guilds.get("585511241628516352").roles.get("813496761628360714").members.find(x => x.id === message.author.id)) return;

    var random_xp = Math.floor(Math.random() * 5)

    if (client.cooldown.find(x => x == message.member.id)) return;
    var memberdbdata = await MEMBER.findOne({"info.id": message.member.id})
    var nextlevelxp = 10 * memberdbdata.ranks.rank / 10 * 5; 

    var data = {rank: memberdbdata.ranks.rank, xp: memberdbdata.ranks.xp + random_xp}
    if  (data.xp > nextlevelxp - 1){data.xp = 0, data.rank += 1}

    await MEMBER.findOneAndUpdate({"info.id": message.member.id}, {"ranks.xp": data.xp, "ranks.rank": data.rank}, (err, res) => {if (err){console.log(err)}})
    client.cooldown.push(message.member.id)
    setTimeout(() => {client.cooldown.pop()}, 10000)


}


//Collect xp in voice chat, every minute a user is in a voice chat
var voicexp = schedule.scheduleJob("0 * * * * *",async function(){
    client.channels.filter(channel => channel.type === "voice").forEach(channel => {
        var illegalvoicechannels = ["597044120384700419", "586178611644596225"]
        if (illegalvoicechannels.filter(f => f === channel.id).length == 1) return; //member is in an channel where he cant collect xp
        if (channel.members.array().length < 2) return; //member alone in voicechannel
        var bots_in_talk = channel.members.filter(m => m.user.bot == true).array().length
        if (bots_in_talk > channel.members.array().length - bots_in_talk || bots_in_talk == channel.members.array().length - bots_in_talk) return; //member is alone with an bot
        
        channel.members.array().forEach(async member => {
            if (client.guilds.get("585511241628516352").roles.get("813496761628360714").members.find(x => x.id === member.id)) return;
            if (member.user.bot) return;
             if (member.selfMute || member.serverMute) return;
             if (member.selfDeaf || member.serverDeaf) return;

            var memberdbdata = await MEMBER.findOne({"info.id": member.id})

            //how many xp does user need for his level up?
            var nextlevelxp = 10 * memberdbdata.ranks.rank / 10 * 5; 

            var data = {rank: memberdbdata.ranks.rank, xp: memberdbdata.ranks.xp + 1}
            if  (data.xp > nextlevelxp - 1){data.xp = 0, data.rank += 1}

            await MEMBER.findOneAndUpdate({"info.id": member.id}, {"ranks.xp": data.xp, "ranks.rank": data.rank}, (err, res) => {if (err){console.log(err)}})

        })

    })


})

