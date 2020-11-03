const { client, config} = require("../index")
const { RichEmbed } = require('discord.js')
const colour = require("../colours.json")
const fs      = require("fs");
var schedule = require('node-schedule');

const MEMBER = require("../models/MEMBER")

client.on("voiceStateUpdate", async (olds, news) => {
if (news.voiceChannel == null) return
if (client.guilds.cache.get("585511241628516352").roles.cache.get("712830005452865566").members.find(x => x.id === news.user.id)) return news.setVoiceChannel(null);
if (news.voiceChannel.name.endsWith("🔴") == false) return
var Member = await MEMBER.findOne({"info.id": news.user.id})
if (Member.more.ytvoice == true) return

var member = news.guild.members.cache.get(news.user.id)

member.setVoiceChannel(null)
member.send("Hey. In diesem Voice Channel wird gerade ein Stream oder eine Aufnahme gemacht. Deshalb habe ich dich entfernt. **Wenn du auch dabei sein möchtest musst du erst damit einverstanden sein, das deine Stimme aufgenommen und verwendet wird, und eventuell später in best ofs oder in anderen Videos benutzt wird** Dies kannst du ganz easy akzeptieren in dem du `_usemyvoice` in einen Text Channel schreibst. Dies musst du auch nur einmal machen.")

})
