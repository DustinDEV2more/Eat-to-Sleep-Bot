exports.command = {
	name: 'Musik',
	call: 'm',
	description: 'Spielt Musik in deinem Voice Channel von YouTube ab',
    usage: `m <[play <youtube-link>/playlist <youtube-playlist-link>/stop/skip/ls <lautstärke 0-4>/queue/nowplaying/loop/shuffle]>`,
    permissions: [],
	async execute(message, args) {
		var {client} = require("../index")
		var config = require("../config.json")
		const embed = require("../Embed")
		const ytdl = require('ytdl-core');
		const fetch = require('node-fetch');
		const OLDMEMBER = require("../Models/OLD-MEMBER")

		const mdata = await OLDMEMBER.findOne({"info.id": message.author.id})
		if (mdata.coins.purchases.find(x => x.id == 981) === undefined) return message.channel.send(embed.error_user("Fehlende Berechtigung", "Du kannst diesen Command aktuell nicht benutzten. Die Rechte für diesen Command lassen sich im Shop erwerben"))
	
		//Adding Song to queue
		if (args[0].toLocaleLowerCase() == "play"){
			if (!args[1]) return message.channel.send(embed.error_user("Kein Song angegeben", "Du musst einen YouTube Video Link angeben"))
			
			//Fetch Song Infoinformation
			//let info = await ytdl.getBasicInfo(args[1]);
			var info = await ytdl.getBasicInfo(args[1]);
			var Videoinfos = {
				title: info.videoDetails.title,
				url: info.videoDetails.video_url,
				author: info.videoDetails.ownerChannelName,
				author_url: info.videoDetails.ownerProfileUrl,
				video_lenght: info.videoDetails.lengthSeconds
			}
			if (!info.videoDetails.availableCountries.find(x => x == "FR")) return message.channel.send(embed.error_system("Song nicht abspielbar", "Leider kann ich diesen Song nicht abspielen da mein Anti-DDOS Provider in Frankreich liegt und das Video in Frankreich nicht verfügbar ist"))

			//check if bot is already playing a song in that server
			if (client.music[message.channel.guild.id]){
				//already playing
				var position = client.music[message.channel.guild.id].queue.push(Videoinfos);
				
				return message.channel.send(embed.success("Song hinzugefügt", `Ich habe [${Videoinfos.title}](${Videoinfos.url}) zur queue auf **position ${position}** hinzugefügt`))
			
			}
			else {
			//nothing playing
			if (message.member.voice.channel) {
				client.music[message.channel.guild.id] = {queue: [Videoinfos], loop: false, volume: 1};

				play(message.channel.guild.id)
				return message.channel.send(embed.success("Song hinzugefügt", `Ich werde [${Videoinfos.title}](${Videoinfos.url}) in deinem Voicechat abspielen`))

				} 
				  
				else {
				message.channel.send(embed.error_user("Kein Voice Channel", "Du musst dich in einem Voicechannel befinden damit ich Musik spielen kann"));
				}
			}
		}

		if (args[0].toLocaleLowerCase() == "playlist"){
			if (!args[1]) return message.channel.send(embed.error_user("Keine Playlist angegeben", "Du musst einen YouTube Video Link angeben"))
			
			var playlistid = args[1].split("?list=")

			//Fetch Song Infoinformation
			var playlist_videos = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistid.slice(-1)[0]}&key=${config.youtube_api.key}`).then(res => res.json())

			//check if bot is already playing a song in that server
			if (client.music[message.channel.guild.id]){
				//already playing				
				playlist_videos.items.forEach(async video => {
					var Videoinfos = {
					title: video.snippet.title,
					url: "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId,
					author: video.snippet.channelTitle,
					author_url: "https://www.youtube.com/channel/" + video.snippet.channelId,
					video_lenght: null
				}
					client.music[message.channel.guild.id].queue.push(Videoinfos);
					});

				return message.channel.send(embed.success("Playlist hinzugefügt", `Ich habe **${playlist_videos.items.length} Videos** zur queue hinzugefügt`))
			
			}
			else {
			//nothing playing
			if (message.member.voice.channel) {
				client.music[message.channel.guild.id] = {queue: [], loop: false, volume: 1};

				playlist_videos.items.forEach(async video => {
					var Videoinfos = {
					title: video.snippet.title,
					url: "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId,
					author: video.snippet.channelTitle,
					author_url: "https://www.youtube.com/channel/" + video.snippet.channelId,
					video_lenght: null
				}
					client.music[message.channel.guild.id].queue.push(Videoinfos);
					});

				play(message.channel.guild.id)
				return message.channel.send(embed.success("Playlist hinzugefügt", `Ich werde **${playlist_videos.items.length} Videos** in deinem Voicechannel abspielen`))

				} 
				  
				else {
				message.channel.send(embed.error_user("Kein Voice Channel", "Du musst dich in einem Voicechannel befinden damit ich Musik spielen kann"));
				}
			}
		}

		if (args[0].toLocaleLowerCase() == "stop"){
			if (!client.music[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			client.music[message.channel.guild.id].queue = [];
			client.music[message.channel.guild.id].dispatcher.end();
			message.channel.send(embed.success("Musik gestoppt", "Ich habe den aktuellen Song gestoppt und die queue geleert"))
		}

		if (args[0].toLocaleLowerCase() == "skip"){
			if (!client.music[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			client.music[message.channel.guild.id].dispatcher.end();
			message.channel.send(embed.success("Song übersprungen", "Ich habe den aktuellen Song übersprungen"))
		}

		if (args[0].toLocaleLowerCase() == "loop"){
			if (!client.music[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			if (client.music[message.channel.guild.id].loop == true) {client.music[message.channel.guild.id].loop = false
			message.channel.send(embed.success("Loop deaktiviert", "Ich habe die Song Wiederholung **deaktiviert**"))}
			else if (client.music[message.channel.guild.id].loop == false) {client.music[message.channel.guild.id].loop = true
				message.channel.send(embed.success("Loop aktiviert", "Ich habe die Song Wiederholung **aktiviert**"))}
		}

		if (args[0].toLocaleLowerCase() == "lautstärke" || args[0].toLocaleLowerCase() == "ls"){
			if (!client.music[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			if (parseInt(args[1]) > 4) return message.channel.send(embed.error_user("Zu laut", "Da ihr die musik Funktion auch in Zukunft benuzten sollt, und ihr dafür gesunde Ohren braucht, dürft ihr den Lautstärke Wert nicht höher als 4 setzten"))
			client.music[message.channel.guild.id].dispatcher.setVolume(args[1])
			client.music[message.channel.guild.id].volume = args[1]
			message.channel.send(embed.success(`Lautstärke gesetzt`, `Ich habe die Lautstärke auf ${args[1]} gesetzt.`))
		}

		if (args[0].toLocaleLowerCase() == "queue"){
			if (!client.music[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			var embedtxt = `\`\`\`${client.music[message.channel.guild.id].queue.map(x => client.music[message.channel.guild.id].queue.indexOf(x) + `. ${x.title}`).join("\n").replace(`0. ${client.music[message.channel.guild.id].queue[0].title}`, ``)}\`\`\``
			if (embedtxt.length > 2048){ embedtxt = `Die Queue ist zu lang für eine Discord Message. Du kannst sie allerdings [hier ansehen](http://server.dustin-dm.de:7869/api/music/${message.channel.guild.id}/queue)`}


			message.channel.send(embed.success("Aktuelle queue:", embedtxt))
		}

		if (args[0].toLocaleLowerCase() == "nowplaying" || args[0].toLocaleLowerCase() == "np"){
			if (!client.music[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			message.channel.send(embed.success("Aktueller Song:", `[${client.music[message.channel.guild.id].queue[0].title}](${client.music[message.channel.guild.id].queue[0].url}) von [${client.music[message.channel.guild.id].queue[0].author}](${client.music[message.channel.guild.id].queue[0].author_url})`))
		}

		if (args[0].toLocaleLowerCase() == "shuffle" || args[0].toLocaleLowerCase() == "sh"){
			if (!client.music[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			function shuffle(array) {
				let counter = array.length;
			
				// While there are elements in the array
				while (counter > 0) {
					// Pick a random index
					let index = Math.floor(Math.random() * counter);
			
					// Decrease counter by 1
					counter--;
			
					// And swap the last element with it
					let temp = array[counter];
					array[counter] = array[index];
					array[index] = temp;
				}
			
				return array;
			}
			client.music[message.channel.guild.id].queue == shuffle(client.music[message.channel.guild.id].queue)
			message.channel.send(embed.success("Queue neugeneriert", `Ich habe die Playlist auseinander genommen und zufällig neu aneinander gestellt`))
		}

		function play(GuildId) {
			if (client.music[GuildId].queue.length == 0) {
				//Leave Voicechannel if queue is empty
				message.channel.guild.members.cache.get("785505459070959636").voice.channel.leave();
				client.music[GuildId] = null
			  } else if (client.music[GuildId].queue.length > 0){
				message.member.voice.channel.join().then(d => {
					client.music[GuildId].dispatcher = d.play(
					  ytdl(client.music[GuildId].queue[0].url, 
						 { filter: 'audioonly' }
						)
					  );
					  client.music[GuildId].dispatcher.setVolume(client.music[GuildId].volume)
					
					  client.music[GuildId].dispatcher.on("finish", async () => {
						if (client.music[GuildId].loop == false) {client.music[GuildId].queue.shift();}
						play(GuildId)
				  })
			  })
			}
		}
	},
};
var {client} = require("../index")
const express = require("express");
const app = express.Router();

app.use("/:guildid/queue", (req, res) => {
	 if (!client.music[req.query.guildid]) return res.status(401).send({"error": "No queue availible"})
	 		res.send(client.music[req.params.guildid].queue)
	
})

exports.api = app;