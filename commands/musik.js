var musicsave = []
exports.command = {
	name: 'Musik',
	call: 'm',
	description: 'Spielt Musik in deinem Voice Channel von YouTube ab',
    usage: `m <[play <youtube-link>/playlist <youtube-playlist-link>/stop/skip/ls <lautstärke 0-4>/queue/nowplaying/loop]>`,
    permissions: [],
	async execute(message, args) {
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
			if (musicsave[message.channel.guild.id]){
				//already playing
				var position = musicsave[message.channel.guild.id].queue.push(Videoinfos);
				
				return message.channel.send(embed.success("Song hinzugefügt", `Ich habe [${Videoinfos.title}](${Videoinfos.url}) zur queue auf **position ${position}** hinzugefügt`))
			
			}
			else {
			//nothing playing
			if (message.member.voice.channel) {
				musicsave[message.channel.guild.id] = {queue: [Videoinfos], loop: false, volume: 1};

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
			if (musicsave[message.channel.guild.id]){
				//already playing				
				playlist_videos.items.forEach(async video => {
					var Videoinfos = {
					title: video.snippet.title,
					url: "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId,
					author: video.snippet.channelTitle,
					author_url: "https://www.youtube.com/channel/" + video.snippet.channelId,
					video_lenght: null
				}
					musicsave[message.channel.guild.id].queue.push(Videoinfos);
					});

				return message.channel.send(embed.success("Playlist hinzugefügt", `Ich habe **${playlist_videos.items.length} Videos** zur queue hinzugefügt`))
			
			}
			else {
			//nothing playing
			if (message.member.voice.channel) {
				musicsave[message.channel.guild.id] = {queue: [], loop: false, volume: 1};

				console.log(playlist_videos.items[0])
				playlist_videos.items.forEach(async video => {
					var Videoinfos = {
					title: video.snippet.title,
					url: "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId,
					author: video.snippet.channelTitle,
					author_url: "https://www.youtube.com/channel/" + video.snippet.channelId,
					video_lenght: null
				}
					musicsave[message.channel.guild.id].queue.push(Videoinfos);
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
			if (!musicsave[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			musicsave[message.channel.guild.id].queue = [];
			musicsave[message.channel.guild.id].dispatcher.end();
			message.channel.send(embed.success("Musik gestoppt", "Ich habe den aktuellen Song gestoppt und die queue geleert"))
		}

		if (args[0].toLocaleLowerCase() == "skip"){
			if (!musicsave[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			musicsave[message.channel.guild.id].dispatcher.end();
			message.channel.send(embed.success("Song übersprungen", "Ich habe den aktuellen Song übersprungen"))
		}

		if (args[0].toLocaleLowerCase() == "loop"){
			if (!musicsave[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			if (musicsave[message.channel.guild.id].loop == true) {musicsave[message.channel.guild.id].loop = false
			message.channel.send(embed.success("Loop deaktiviert", "Ich habe die Song Wiederholung **deaktiviert**"))}
			else if (musicsave[message.channel.guild.id].loop == false) {musicsave[message.channel.guild.id].loop = true
				message.channel.send(embed.success("Loop aktiviert", "Ich habe die Song Wiederholung **aktiviert**"))}
		}

		if (args[0].toLocaleLowerCase() == "lautstärke" || args[0].toLocaleLowerCase() == "ls"){
			if (!musicsave[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			if (parseInt(args[1]) > 4) return message.channel.send(embed.error_user("Zu laut", "Da ihr die musik Funktion auch in Zukunft benuzten sollt, und ihr dafür gesunde Ohren braucht, dürft ihr den Lautstärke Wert nicht höher als 4 setzten"))
			musicsave[message.channel.guild.id].dispatcher.setVolume(args[1])
			musicsave[message.channel.guild.id].volume = args[1]
			message.channel.send(embed.success(`Lautstärke gesetzt`, `Ich habe die Lautstärke auf ${args[1]} gesetzt.`))
		}

		if (args[0].toLocaleLowerCase() == "queue"){
			if (!musicsave[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			var embedtxt = `\`\`\`${musicsave[message.channel.guild.id].queue.map(x => musicsave[message.channel.guild.id].queue.indexOf(x) + `. ${x.title}`).join("\n").replace(`0. ${musicsave[message.channel.guild.id].queue[0].title}`, ``)}\`\`\``
			if (embedtxt.length > 2048){ embedtxt = `Die Queue ist zu lang für eine Discord Message. Du kannst sie allerdings [hier ansehen](http://server.dustin-dm.de:7869/api/music/${message.channel.guild.id}/queue)`}


			message.channel.send(embed.success("Aktuelle queue:", embedtxt))
		}

		if (args[0].toLocaleLowerCase() == "nowplaying" || args[0].toLocaleLowerCase() == "np"){
			if (!musicsave[message.channel.guild.id]) return message.channel.send(embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			message.channel.send(embed.success("Aktueller Song:", `[${musicsave[message.channel.guild.id].queue[0].title}](${musicsave[message.channel.guild.id].queue[0].url}) von [${musicsave[message.channel.guild.id].queue[0].author}](${musicsave[message.channel.guild.id].queue[0].author_url})`))
		}

		function play(GuildId) {
			if (musicsave[GuildId].queue.length == 0) {
				//Leave Voicechannel if queue is empty
				message.channel.guild.members.cache.get("785505459070959636").voice.channel.leave();
				musicsave[GuildId] = null
			  } else if (musicsave[GuildId].queue.length > 0){
				message.member.voice.channel.join().then(d => {
					musicsave[GuildId].dispatcher = d.play(
					  ytdl(musicsave[GuildId].queue[0].url, 
						 { filter: 'audioonly' }
						)
					  );
					  musicsave[GuildId].dispatcher.setVolume(musicsave[GuildId].volume)
					
					  musicsave[GuildId].dispatcher.on("finish", async () => {
						if (musicsave[GuildId].loop == false) {musicsave[GuildId].queue.shift();}
						play(GuildId)
				  })
			  })
			}
		}
	},
};

const express = require("express");
const app = express.Router();

app.use("/:guildid/queue", (req, res) => {
	 if (!musicsave[req.query.guildid]) return res.status(400).send({"error": "No queue availible"})
	 		res.send(musicsave[req.params.guildid].queue)
	
})

exports.api = app;