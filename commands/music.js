module.exports = {
	name: 'm',
	description: 'Spielt Musik über den Bot ab',
  usage: `m (play <yt-link> | stop | skip | queue)` ,
	async execute(message, args) {

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        const ytdl = require('ytdl-core');

        if (args[0] == "play"){


          if (!args[1]) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du musst einen Youtube Link angeben"));
          if (message.member.voiceChannel == null) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du befindest dich nicht in einem Voicechhannel"));
          
          var Videoinformation = {URI: null, name: "Das Video"}
         await ytdl.getInfo(args[1], (err, info) => {
            if (err) throw err;
            Videoinformation = {URI: info.video_url, name: info.title}
          });

          if (client.music[message.guild.id] && client.music[message.guild.id] != null){
            client.music[message.guild.id].queue.push(Videoinformation)
            message.channel.send(new RichEmbed().setColor(colour.rot).setDescription(`Ich habe [${Videoinformation.name}](${Videoinformation.URI}) zur queue hinzugefügt`));
          }
          else {
            client.music[message.guild.id] = {queue: [Videoinformation]}
            message.channel.send(new RichEmbed().setColor(colour.rot).setDescription(`Ich werde [${Videoinformation.name}](${Videoinformation.URI}) in deinem Voicechannel abspielen`));

            play(message.guild.id)
          }



          //music main process
         async function play(guildid) {
            if (client.music[guildid].queue.length == 0) {
            client.guilds.cache.get(guildid).members.cache.get("585521607875756042").voiceChannel.leave();
            client.music[guildid] = null
          } else if (client.music[guildid].queue.length > 0){
            
            message.member.voiceChannel.join().then(d => {
              client.music[guildid].dispatcher = d.playStream(
                ytdl(client.music[guildid].queue[0].URI, 
                  //{requestOptions: { agent }}
                  )
                );
            

              client.music[guildid].dispatcher.on("finish", async () => {
              client.music[guildid].queue.shift();
              play(guildid)
            })



          })

        }

            
          }

            
        }
        if (args[0] == "skip"){
          if (client.music[message.guild.id] && client.music[message.guild.id] != null){
            client.music[message.guild.id].dispatcher.destroy();
            new RichEmbed().setColor(colour.grün).setDescription("Der Song wurde übersprungen");

          }
          else return message.channel.send(
            new RichEmbed().setColor(colour.rot).setDescription("Es kann kein Song geskippt werden wenn kein Song läuft"));
          }

          if (args[0] == "stop"){
            if (client.music[message.guild.id] && client.music[message.guild.id] != null){
              client.music[message.guild.id].queue = [];
              client.music[message.guild.id].dispatcher.destroy();
            new RichEmbed().setColor(colour.grün).setDescription("Die Wiedergabe wurde gestoppt");
          }
            else return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du kannst nichts stoppen werden wenn kein Song läuft"));
            }

          if (args[0].toLowerCase() == "queue"){
            if (client.music[message.guild.id] && client.music[message.guild.id] != null){
              message.channel.send(`\`\`\`${client.music[message.guild.id].queue.map(x => client.music[message.guild.id].queue.indexOf(x) + `. ${x.name}`).join("\n").replace(`0. ${client.music[message.guild.id].queue[0].name}`, `now playing -> ${client.music[message.guild.id].queue[0].name}`)}\`\`\``);
          }
            else return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du kannst dir die Queue nicht anzeigen lassen"));
            }

        
    },
};
