const { client, config} = require('../index.js')
const { RichEmbed } = require('discord.js')
const Main = require('../index.js')
const fs      = require("fs");

var request = require("request")

var schedule = require('node-schedule');
var fetch = require('node-fetch');
var format = require('date-format');

function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  }
  function unixtotimeconverter(unix){
    var ts = format.asString('dd.MM hh:mm', new Date(unix * 1000));
     return ts + " Uhr"
  }

var timeanddate1
var Splatfest
var standard
var liga
var rank
client.on("ready", () => {
    var reason = "\n(Bot startete an dieser Uhrzeit)"
    function refrechdata(){
    var apiData = fetch('https://splatoon2.ink/data/schedules.json').then(res => res.json());
        apiData.then(function (json) {
            var turfmodeid = json.regular[0].rule.key
            var standardMapaid = json.regular[0].stage_a.id
            var standardMapbid = json.regular[0].stage_b.id

            var Rankemodeid = json.gachi[0].rule.key
            var RankMapAid = json.gachi[0].stage_a.id
            var RankMapBid = json.gachi[0].stage_b.id

            var Ligamodeid = json.league[0].rule.key
            var LigaMapAid = json.league[0].stage_a.id
            var LigaMapBid = json.league[0].stage_b.id
            
            var apiData1 = fetch('https://splatoon2.ink/data/locale/de.json').then(res => res.json());
        apiData1.then(function (jsonlang) {
            var turfmode = jsonlang['rules'][turfmodeid]['name']
            var standardMapa = jsonlang["stages"][standardMapaid]["name"]
            var standardMapb = jsonlang["stages"][standardMapbid]["name"]

            var Rankemode = jsonlang['rules'][Rankemodeid]['name']
            var RankMapA = jsonlang["stages"][RankMapAid]["name"]
            var RankMapB = jsonlang["stages"][RankMapBid]["name"]

            var Ligamode = jsonlang['rules'][Ligamodeid]['name']
            var LigaMapA = jsonlang["stages"][LigaMapAid]["name"]
            var LigaMapB = jsonlang["stages"][LigaMapBid]["name"]

            //Salmonrun
            

            var Salmonrundata = fetch('https://splatoon2.ink/data/coop-schedules.json').then(res => res.json());
            Salmonrundata.then(function (jsonlangs) {
                var Salmonrungear = fetch('https://splatoon2.ink/data/timeline.json').then(res => res.json());
            Salmonrungear.then(function (Salmonrungear) {
                var Unixnow = Math.floor(new Date() / 1000);
                var Salmonrunstart = jsonlangs["schedules"][0]["start_time"]
                var Salmonrunend = jsonlangs["schedules"][0]["end_time"]
                var SalmonrunMap = jsonlangs["details"][0]["stage"]["name"]
                var SalmonrunGear = {"Picturelink": Salmonrungear["coop"]["reward_gear"]["gear"]["image"],
                                   "Verfügbarbis": Salmonrungear["coop"]["reward_gear"]["available_time"],
                                    "Name": jsonlang["gear"][Salmonrungear.coop.reward_gear.gear.kind][Salmonrungear.coop.reward_gear.gear.id]["name"]}
                
                                    var weapons = {
                                        "1": "Zufällig",
                                        "2": "Zufällig",
                                        "3": "Zufällig",
                                        "4": "Zufällig",
                    
                                        "1id": "random",
                                        "2id": "random",
                                        "3id": "random",
                                        "4id": "random"
                                }
                
                                    if (jsonlangs["details"][0]["weapons"][0]["id"] > -1){weapons["1"] = jsonlang["weapons"][jsonlangs["details"][0]["weapons"][0]["id"]]["name"]
                                                                                          weapons["1id"] = jsonlangs["details"][0]["weapons"][0]["id"]}
                                    if (jsonlangs["details"][0]["weapons"][1]["id"] > -1){weapons["2"] = jsonlang["weapons"][jsonlangs["details"][0]["weapons"][1]["id"]]["name"]
                                                                                          weapons["2id"] = jsonlangs["details"][0]["weapons"][1]["id"]}
                                     if (jsonlangs["details"][0]["weapons"][2]["id"] > -1){weapons["3"] = jsonlang["weapons"][jsonlangs["details"][0]["weapons"][2]["id"]]["name"]
                                                                                          weapons["3id"] = jsonlangs["details"][0]["weapons"][2]["id"]}
                                    if (jsonlangs["details"][0]["weapons"][3]["id"] > -1){weapons["4"] = jsonlang["weapons"][jsonlangs["details"][0]["weapons"][3]["id"]]["name"]
                                                                                        weapons["4id"] = jsonlangs["details"][0]["weapons"][3]["id"]}
                
                    // var weapons = {
                    // "1": jsonlang["weapons"][jsonlangs["details"][0]["weapons"][0]["id"]]["name"],
                    // "2": jsonlang["weapons"][jsonlangs["details"][0]["weapons"][1]["id"]]["name"],
                    // "3": jsonlang["weapons"][jsonlangs["details"][0]["weapons"][2]["id"]]["name"],
                    // "4": jsonlang["weapons"][jsonlangs["details"][0]["weapons"][3]["id"]]["name"],

                    // "1id": jsonlangs["details"][0]["weapons"][0]["id"],
                    // "2id": jsonlangs["details"][0]["weapons"][1]["id"],
                    // "3id": jsonlangs["details"][0]["weapons"][2]["id"],
                    // "4id": jsonlangs["details"][0]["weapons"][3]["id"]
            //}
            function getemote(id){
                if (client.guilds.cache.get("604747271862485012").emojis.find(x => x.name === id)){
                    var emojiid = client.guilds.cache.get("604747271862485012").emojis.find(x => x.name === id).id
                    return `<:${id}:${emojiid}>`
                }
                else {
                    return "<:0_:604756007549140992>"
                }
            }
            function getGermanName(name){
                if (name == "Salmonid Smokeyard"){return "Räucherwerk"}
                if (name == "Lost Outpost"){return "Siedlungsruine"}
                if (name == "Ruins of Ark Polaris"){return "Arche Polaris"}
                if (name == "Spawning Grounds"){return "Salmoniden-Damm"}
                if (name == "Marooner's Bay"){return "Schiffswrack-Insel"}
                
            }
            


            standard = new RichEmbed().setTitle(jsonlang['game_modes']["regular"]['name'])
            .setColor("#CEF422")
            .addField("Gamemode",  turfmode, true)
            .addField("Maps: ", standardMapa + "\n" + standardMapb)
            .setThumbnail("https://gamepedia.cursecdn.com/splatoon_gamepedia/thumb/a/a2/Turf-wars-icon.png/350px-Turf-wars-icon.png?version=86b46970acce756ebce120bdc02a4354")
    
            rank = new RichEmbed().setTitle(jsonlang['game_modes']["gachi"]['name'])
            .setColor("#F54708")
            .addField("Gamemode",  Rankemode, true)//league
            .addField("Maps", RankMapA + "\n" + RankMapB)
            .setThumbnail("https://gamepedia.cursecdn.com/splatoon_gamepedia/thumb/f/f2/Ranked-battle-icon.png/350px-Ranked-battle-icon.png?version=1994847fa3b0b0c48ff4f8bec78e39c2")

            liga = new RichEmbed().setTitle(jsonlang['game_modes']["league"]['name'])
            .setColor("#F1297E")
            .addField("Gamemode",  Ligamode, true)
            .addField("Maps", LigaMapA + "\n" + LigaMapB)
            .setThumbnail("https://cdn.wikimg.net/en/splatoonwiki/images/thumb/9/9b/Symbol_LeagueF.png/257px-Symbol_LeagueF.png")
            
            Salmonrun = new RichEmbed().setTitle("Salmonrun")
            .setColor("#F07A34")
            .addField("Fehler", "Leider konnten die Daten von [Splatoon2.ink](https://splatoon2.ink/data/) nicht gelesen werden")
            .setThumbnail("https://splatoon2.ink/assets/img/mr-grizz.a87af81b.png")

            if (Unixnow > Salmonrunstart && Unixnow < Salmonrunend){
                Salmonrun = new RichEmbed().setTitle("Aktueller Salmonrun")
            .setColor("#F07A34")
            .addField("Zeiten", `Start: ${unixtotimeconverter(Salmonrunstart)}\nEnde: ${unixtotimeconverter(Salmonrunend)}`, true)
            .addField("Map", `${getGermanName(SalmonrunMap)}`, true)
            .addField("Waffen", `${getemote(weapons["1id"])} ${weapons["1"]}\n${getemote(weapons["2id"])} ${weapons["2"]}\n${getemote(weapons["3id"])} ${weapons["3"]}\n${getemote(weapons["4id"])} ${weapons["4"]}\n`, true)
            .addField("Belohnung", `Name: ${SalmonrunGear["Name"]}\nVerfügbar seit: ${unixtotimeconverter(SalmonrunGear["Verfügbarbis"])}`, true)
            .setThumbnail("https://splatoon2.ink/assets/splatnet" + SalmonrunGear["Picturelink"])
            
            }
           else if (Unixnow < Salmonrunstart){

            Salmonrun = new RichEmbed().setTitle("Nächster Salmonrun")
            .setColor("#00000")
            .addField("Zeiten", `Start: ${unixtotimeconverter(Salmonrunstart)}\nEnde: ${unixtotimeconverter(Salmonrunend)}`, true)
            .addField("Map", `${getGermanName(SalmonrunMap)}`, true)
            .addField("Waffen", `${getemote(weapons["1id"])} ${weapons["1"]}\n${getemote(weapons["2id"])} ${weapons["2"]}\n${getemote(weapons["3id"])} ${weapons["3"]}\n${getemote(weapons["4id"])} ${weapons["4"]}\n`, true)
            .addField("Belohnung", `Name: ${SalmonrunGear["Name"]}\nVerfügbar seit: ${unixtotimeconverter(SalmonrunGear["Verfügbarbis"])}`, true)
            .setThumbnail("https://splatoon2.ink/assets/splatnet" + SalmonrunGear["Picturelink"])
            
            
            }


            
            
            client.channels.cache.get("587721175996825610").fetchMessage("587721573989875720").then(message => message.edit(standard))
            client.channels.cache.get("587721175996825610").fetchMessage("587721574749306923").then(message => message.edit(rank))
            client.channels.cache.get("587721175996825610").fetchMessage("587721576276033560").then(message => message.edit(liga))
            client.channels.cache.get("587721175996825610").fetchMessage("587722399298879498").then(message => message.edit(Salmonrun))

    })})} )} )}




        refrechdata()

var j = schedule.scheduleJob("30 0 * * * *", function(){
 refrechdata()
 console.log("The Splatoon Maps refreshed just now")
});
   
    


})
