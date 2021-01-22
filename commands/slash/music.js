exports.command = {
	name: 'music',
	description: 'Lässt dich Musik in deinem Voicechannel von YouTube abspielen',
    roles: [],

    options: [
        {
            "name": "aktion",
            "description": "Was für einen Musik Befehl möchtest du ausführen",
            "type": 3,
            "required": true,
            "choices": [
                {
                    "name": "play",
                    "value": "play"
                },
                {
                    "name": "playlist",
                    "value": "playlist"
                },
                {
                    "name": "skip",
                    "value": "skip"
                },
                {
                    "name": "stop",
                    "value": "stop"
                },
                {
                    "name": "loop",
                    "value": "loop"
                },
                {
                    "name": "queue",
                    "value": "queue"
                },
                {
                    "name": "nowplaying",
                    "value": "nowplaying"
                },
                {
                    "name": "lautstärke",
                    "value": "ls"
				},
				{
					"name": "shuffle",
					"value": "shuffle"
				}
            ]},
        {
            "name": "aktions_parameter",
            "description": "(Falls erforderlich) einen paramter der die aktion voraussetzt",
            "type": 3,
            "required": false
        }
    ],
	async execute(int, args, send, client) {

		var config = require("../../config.json")
		const embed = require("../../modules/Embed");
		const ytdl = require('ytdl-core');
		const fetch = require('node-fetch');
		const OLDMEMBER = require("../../Models/OLD-MEMBER")

        const mdata = await OLDMEMBER.findOne({"info.id": int.member.user.id})
		if (mdata.coins.purchases.find(x => x.id == 981) === undefined) return send(int, embed.error_user("Fehlende Berechtigung", "Du kannst diesen Command aktuell nicht benutzten. Die Rechte für diesen Command lassen sich im Shop erwerben"))
	
		//Adding Song to queue
		if (args.find(x => x.name == "aktion").value == "play"){
			if (!args.find(x => x.name == "aktions_parameter")) return send(int, embed.error_user("Kein Song angegeben", "Du musst einen YouTube Video Link angeben"))
			
			//Fetch Song Infoinformation
			//let info = await ytdl.getBasicInfo(args[1]);
			var info = await ytdl.getBasicInfo(args.find(x => x.name == "aktions_parameter").value);
			var Videoinfos = {
				title: info.videoDetails.title,
				url: info.videoDetails.video_url,
				author: info.videoDetails.ownerChannelName,
				author_url: info.videoDetails.ownerProfileUrl,
				video_lenght: info.videoDetails.lengthSeconds
			}
			if (!info.videoDetails.availableCountries.find(x => x == "FR")) returnsend(int, embed.error_system("Song nicht abspielbar", "Leider kann ich diesen Song nicht abspielen da mein Anti-DDOS Provider in Frankreich liegt und das Video in Frankreich nicht verfügbar ist"))

			//check if bot is already playing a song in that server
			if (client.music[int.guild_id]){
				//already playing
				var position = client.music[int.guild_id].queue.push(Videoinfos);
				
				return send(int, embed.success("Song hinzugefügt", `Ich habe [${Videoinfos.title}](${Videoinfos.url}) zur queue auf **position ${position}** hinzugefügt`))
			
			}
			else {
			//nothing playing
			if (client.guilds.cache.get(int.guild_id).members.cache.get(int.member.user.id).voice.channel) {
				client.music[int.guild_id] = {queue: [Videoinfos], loop: false, volume: 1};

				play(int.guild_id)
				return send(int, embed.success("Song hinzugefügt", `Ich werde [${Videoinfos.title}](${Videoinfos.url}) in deinem Voicechat abspielen`))

				} 
				  
				else {
				send(int, embed.error_user("Kein Voice Channel", "Du musst dich in einem Voicechannel befinden damit ich Musik spielen kann"));
				}
			}
		}

		if (args.find(x => x.name == "aktion").value == "playlist"){
			if (!args.find(x => x.name == "aktions_parameter")) return send(int, embed.error_user("Keine Playlist angegeben", "Du musst einen YouTube Video Link angeben"))
			
            var playlistid = args.find(x => x.name == "aktions_parameter").value.split("list=")

			//Fetch Song Infoinformation
			var playlist_videos = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistid.slice(-1)[0]}&key=${config.youtube_api.key}`).then(res => res.json())

			//check if bot is already playing a song in that server
			if (client.music[int.guild_id]){
				//already playing				
				playlist_videos.items.forEach(async video => {
					var Videoinfos = {
					title: video.snippet.title,
					url: "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId,
					author: video.snippet.channelTitle,
					author_url: "https://www.youtube.com/channel/" + video.snippet.channelId,
					video_lenght: null
				}
					client.music[int.guild_id].queue.push(Videoinfos);
					});

				return send(int, embed.success("Playlist hinzugefügt", `Ich habe **${playlist_videos.items.length} Videos** zur queue hinzugefügt`))
			
			}
			else {
			//nothing playing
			if (client.guilds.cache.get(int.guild_id).members.cache.get(int.member.user.id).voice.channel) {
				client.music[int.guild_id] = {queue: [], loop: false, volume: 1};

				playlist_videos.items.forEach(async video => {
					var Videoinfos = {
					title: video.snippet.title,
					url: "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId,
					author: video.snippet.channelTitle,
					author_url: "https://www.youtube.com/channel/" + video.snippet.channelId,
					video_lenght: null
				}
					client.music[int.guild_id].queue.push(Videoinfos);
					});

				play(int.guild_id)
				return send(int, embed.success("Playlist hinzugefügt", `Ich werde **${playlist_videos.items.length} Videos** in deinem Voicechannel abspielen`))

				} 
				  
				else {
				send(int, embed.error_user("Kein Voice Channel", "Du musst dich in einem Voicechannel befinden damit ich Musik spielen kann"));
				}
			}
		}

		if (args.find(x => x.name == "aktion").value == "stop"){
			if (!client.music[int.guild_id]) return send(int, embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			client.music[int.guild_id].queue = [];
			client.music[int.guild_id].dispatcher.end();
			send(int, embed.success("Musik gestoppt", "Ich habe den aktuellen Song gestoppt und die queue geleert"))
		}

		if (args.find(x => x.name == "aktion").value == "skip"){
			if (!client.music[int.guild_id]) return send(int, embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			client.music[int.guild_id].dispatcher.end();
			send(int, embed.success("Song übersprungen", "Ich habe den aktuellen Song übersprungen"))
		}

		if (args.find(x => x.name == "aktion").value == "loop"){
			if (!client.music[int.guild_id]) return send(int, embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			if (client.music[int.guild_id].loop == true) {client.music[int.guild_id].loop = false
			send(int, embed.success("Loop deaktiviert", "Ich habe die Song Wiederholung **deaktiviert**"))}
			else if (client.music[int.guild_id].loop == false) {client.music[int.guild_id].loop = true
				send(int, embed.success("Loop aktiviert", "Ich habe die Song Wiederholung **aktiviert**"))}
		}

		if (args.find(x => x.name == "aktion").value == "lautstärke" || args.find(x => x.name == "aktion").value == "ls"){
			if (!client.music[int.guild_id]) return send(int, embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
            if (!args.find(x => x.name == "aktions_parameter")) return send(int, embed.error_user("Fehlender Parameter", "Du musst eine Lautstärke in Zahlen angeben"))
            if (parseInt(args.find(x => x.name == "aktions_parameter").value) > 4) return send(int, embed.error_user("Zu laut", "Da ihr die musik Funktion auch in Zukunft benuzten sollt, und ihr dafür gesunde Ohren braucht, dürft ihr den Lautstärke Wert nicht höher als 4 setzten"))
			client.music[int.guild_id].dispatcher.setVolume(parseInt(args.find(x => x.name == "aktions_parameter").value))
			client.music[int.guild_id].volume = parseInt(args.find(x => x.name == "aktions_parameter").value)
			send(int, embed.success(`Lautstärke gesetzt`, `Ich habe die Lautstärke auf ${parseInt(args.find(x => x.name == "aktions_parameter").value)} gesetzt.`))
		}

		if (args.find(x => x.name == "aktion").value == "queue"){
			if (!client.music[int.guild_id]) return send(int, embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			var embedtxt = `\`\`\`${client.music[int.guild_id].queue.map(x => client.music[int.guild_id].queue.indexOf(x) + `. ${x.title}`).join("\n").replace(`0. ${client.music[int.guild_id].queue[0].title}`, ``)}\`\`\``
			if (embedtxt.length > 2048){ embedtxt = `Die Queue ist zu lang für eine Discord Message. Du kannst sie allerdings [hier ansehen](http://server.dustin-dm.de:7869/api/music/${int.guild_id}/queue)`}


			send(int, embed.success("Aktuelle queue:", embedtxt))
		}

		if (args.find(x => x.name == "aktion").value == "nowplaying"){
			if (!client.music[int.guild_id]) return send(int, embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
			send(int, embed.success("Aktueller Song:", `[${client.music[int.guild_id].queue[0].title}](${client.music[int.guild_id].queue[0].url}) von [${client.music[int.guild_id].queue[0].author}](${client.music[int.guild_id].queue[0].author_url})`))
		}

		if (args.find(x => x.name == "aktion").value == "shuffle"){
			if (!client.music[int.guild_id]) return send(int, embed.error_user("Keinen Player gefunden", "Mir ist kein Channel bewusst in dem ich gerade einen Song abspiele"))
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
			client.music[int.guild_id].queue == shuffle(client.music[int.guild_id].queue)
			send(int, embed.success("Queue neugeneriert", `Ich habe die Playlist auseinander genommen und zufällig neu aneinander gestellt`))
		}

		function play(GuildId) {
			if (client.music[GuildId].queue.length == 0) {
				//Leave Voicechannel if queue is empty
				client.guilds.cache.get(int.guild_id).members.cache.get(client.user.id).voice.channel.leave();
				client.music[GuildId] = null
			  } else if (client.music[GuildId].queue.length > 0){
				client.guilds.cache.get(int.guild_id).members.cache.get(int.member.user.id).voice.channel.join().then(d => {
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