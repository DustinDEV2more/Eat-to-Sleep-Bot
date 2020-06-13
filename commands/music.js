module.exports = {
	name: 'm',
	description: 'Spielt Musik über den Bot ab',
  usage: `m (play <yt-link> | stop | skip)` ,
	async execute(message, args) {

        const { client, config} = require('../index')
        const { RichEmbed } = require('discord.js')
        const colour = require("../colours.json")

        const ytdl = require('ytdl-core');

        if (args[0] == "play"){

          if (!args[1]) return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du musst einen Youtube Link angeben"));
          
          if (client.music[message.guild.id] && client.music[message.guild.id] != null){
            client.music[message.guild.id].queue.push(args[1])
          }
          else {
            client.music[message.guild.id]= {queue: [args[1]]}

            play(message.guild.id)
          }



          //music main process
         async function play(guildid) {
            if (client.music[guildid].queue.length == 0) {
            client.guilds.get(guildid).members.get("585521607875756042").voiceChannel.leave();
            client.music[guildid] = null
          } else if (client.music[guildid].queue.length > 0){
            
            message.member.voiceChannel.join().then(d => {
              client.music[guildid].dispatcher = d.playStream(ytdl(client.music[guildid].queue[0], { filter: 'audioonly' }));
            

              client.music[guildid].dispatcher.on("end", async () => {
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
          }
          else return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Es kann kein Song geskippt werden wenn kein Song läuft"));
          }

          if (args[0] == "stop"){
            if (client.music[message.guild.id] && client.music[message.guild.id] != null){
              client.music[message.guild.id].queue = [];
              client.music[message.guild.id].dispatcher.destroy();
            }
            else return message.channel.send(new RichEmbed().setColor(colour.rot).setDescription("Du kannst nichts stoppen werden wenn kein Song läuft"));
            }

        
    },
};
