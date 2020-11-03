var fetch = require('node-fetch');
var channelMclass = require("./channel-management/ChannelM-class")
const { client, config,} = require("../index")
var format = require('date-format');
const { RichEmbed } = require('discord.js')

const MEMBER = require("../models/MEMBER")


var apiData = fetch('https://splatoon2.ink/data/festivals.json').then(res => res.json());
apiData.then(function (json) {
var splatfeststart = new Date( json.eu.festivals[0].times.start * 1000)
var splatfestend = new Date( json.eu.festivals[0].times.end * 1000)
var splatfestresult = new Date( json.eu.festivals[0].times.result * 1000)
var schedule = require('node-schedule');

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

var traslatehelp = fetch('https://splatoon2.ink/data/locale/de.json').then(res => res.json());
traslatehelp.then(function (jsonlang) {

        //update Splatfest Role
        if (splatfestend > new Date()){

            client.guilds.cache.get("585511241628516352").roles.cache.get("714098535385137152").setName(`${jsonlang.festivals[json.eu.festivals[0].festival_id].names.alpha_long}`)
            client.guilds.cache.get("585511241628516352").roles.cache.get("714098613399191643").setName(`${jsonlang.festivals[json.eu.festivals[0].festival_id].names.bravo_long}`)
            }

var Splatfest = new channelMclass(
    splatfeststart, //start time
    splatfestend, //end time
    `Splatfest! ${jsonlang.festivals[json.eu.festivals[0].festival_id].names.alpha_short} vs ${jsonlang.festivals[json.eu.festivals[0].festival_id].names.bravo_short}`, //Event Name
    "Team Talk", // Talk Name ">>Talk<< 1", ">>Talk<< 2"
    "Splatfest Chat", //Text Channel Name
    new RichEmbed() //Embed wish will be send in the Text Channel 
    .setColor("RANDOM")
    .setImage("https://splatoon2.ink/assets/splatnet" + json.eu.festivals[0].images.panel)
    .setThumbnail("https://cdn.wikimg.net/en/splatoonwiki/images/thumb/9/9a/S2_Splatfest_Logo.svg/233px-S2_Splatfest_Logo.svg.png")
    .setTitle("Its Splatfest Time!")
    .setDescription(`<:5010:604756017221468190>Ein neues Splatfest hat begonnen! Das Thema lautet\n**${jsonlang.festivals[json.eu.festivals[0].festival_id].names.alpha_long}** \n:vs:\n**${jsonlang.festivals[json.eu.festivals[0].festival_id].names.bravo_long}**`)
    .addField("Zeitplan:", `Splatfest start: ${format.asString('dd.MM hh:mm', splatfeststart)} Uhr\nSplatfest ende: ${format.asString('dd.MM hh:mm', splatfestend)} Uhr\nErgebniss show of: ${format.asString('dd.MM hh:mm', splatfestresult)} Uhr`)
    .addField(`Splatfest-Map:`, `${jsonlang.stages[json.eu.festivals[0].special_stage.id].name}`)
    ,
    "585523787408212079", //Copie Permission from this Categorie ID
    null,  //Send Members back to this Categorie ID
    false, //xp x 2 > true or false
    )

    //Post Splatfest Result
    
    var postresults = schedule.scheduleJob(splatfestresult, function(){setTimeout(() => {
        var apiDatanew = fetch('https://splatoon2.ink/data/festivals.json').then(res => res.json());
        apiDatanew.then(function (jsonn) {
         var splatfestid = jsonn.eu.festivals[0].festival_id

        var splatfestresults = jsonn.eu.results.find(s => s.festival_id === splatfestid)

        function prozentrechner(a ,b) {
            var Grundwert = a + b
            var Prozentwert = a

            var Ergebniss = Prozentwert * 100 / Grundwert
            if ( Ergebniss > b * 100 / Grundwert) return `**${Math.round(Prozentwert * 100 / Grundwert)}%**`
            else if ( Ergebniss < b * 100 / Grundwert) return `${Math.round(Prozentwert * 100 / Grundwert)}%`
            else if ( Ergebniss == b * 100 / Grundwert) return `**${Math.round(Prozentwert * 100 / Grundwert)}**%`
        }

var stimmenA = prozentrechner(splatfestresults.rates.vote.alpha, splatfestresults.rates.vote.bravo)
var stimmenB = prozentrechner(splatfestresults.rates.vote.bravo, splatfestresults.rates.vote.alpha)
var Standart_KampfA = prozentrechner(splatfestresults.rates.regular.alpha, splatfestresults.rates.regular.bravo)
var Standart_KampfB = prozentrechner(splatfestresults.rates.regular.bravo, splatfestresults.rates.regular.alpha)
var Profi_KampfA = prozentrechner(splatfestresults.rates.challenge.alpha, splatfestresults.rates.challenge.bravo)
var Profi_KampfB = prozentrechner(splatfestresults.rates.challenge.bravo, splatfestresults.rates.challenge.alpha)

var names = [jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.alpha_short, jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.bravo_short, "2", "3", jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.bravo_short, jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.alpha_short, "6", "7"]
        client.channels.cache.get("586177035278483466").send(
            new RichEmbed()
            .setTitle("DIE SPLATFEST ERGEBNISSE SIND DA!").setColor("RANDOM")
            .setThumbnail("https://splatoon2.ink/assets/splatnet" + jsonn.eu.festivals[0].images.panel)
            .setFooter("Klicke auf die dunklen Felder um sie sichbar zu machen", "https://cdn.wikimg.net/en/splatoonwiki/images/thumb/9/9a/S2_Splatfest_Logo.svg/233px-S2_Splatfest_Logo.svg.png")
            .setDescription("<:5010:604756017221468190>Die Ergebnisse des Splatfestes wurden mir gerade vom Miezrichter vorbeigebracht. Schauen wir mal wer gewonnen hat:")
            .addField("Stimmen:", `${jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.alpha_short} >  ||${stimmenA} VS ${stimmenB}|| < ${jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.bravo_short}`)
            .addField("Standart Kampf:", `${jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.alpha_short} >  ||${Standart_KampfA} VS ${Standart_KampfB}|| < ${jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.bravo_short}`)
            .addField("Profi Kampf:", `${jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.alpha_short} >  ||${Profi_KampfA} VS ${Profi_KampfB}|| < ${jsonlang.festivals[jsonn.eu.festivals[0].festival_id].names.bravo_short}`)
            .addField("Splatfest Gewinner:", `UND DAS GEWINNERTEAM DES SPLATFESTS LAUTET\n ||**TEAM ${names[splatfestresults.summary.total]}**\nHERZLICHEN GLÜCKWUNSCH!\nSorry an alle von Team ${names[splatfestresults.summary.total + 4]}||`)
        )

     })
    })

    }, 30000)

    //client.on("ready", () => {

    //Check Splatfest Votes
    if (splatfestresult > new Date()){
        var check = true
        var hfgh = schedule.scheduleJob("*/1 * * * *",async function(){
            if (check == false) return;
        fetch(`https://app.splatoon2.nintendo.net/api/festivals/${json.eu.festivals[0].festival_id}/votes`, {headers: {"cookie": `iksm_session=${config.tokens.nintendo}; lang=de-DE;`}}).then(res => res.json())
        .then(json => {
            json.votes.alpha.forEach(async player_nsaid => {
                var member = await MEMBER.findOne({"more.nintendo": player_nsaid})
                if (!member) return;

                if (json.votes.alpha.find(x => x === member.more.nintendo)) client.guilds.cache.get("585511241628516352").members.get(member.info.id).addRole("714098535385137152")
            })

            json.votes.bravo.forEach(async player_nsaid => {
                var member = await MEMBER.findOne({"more.nintendo": player_nsaid})
                if (!member) return;

                if (json.votes.bravo.find(x => x === member.more.nintendo)) client.guilds.cache.get("585511241628516352").members.get(member.info.id).addRole("714098613399191643")
            })

        })
        })
        var postresults2 = schedule.scheduleJob(splatfestresult, function(){
            check = false
            client.guilds.cache.get("585511241628516352").members.cache.forEach(m => {
                m.removeRoles(["714098535385137152", "714098613399191643"])
            })
            client.guilds.cache.get("585511241628516352").roles.cache.get("714098535385137152").setName(`Splatfest Team A`)
            client.guilds.cache.get("585511241628516352").roles.cache.get("714098613399191643").setName(`Splatfest Team B`)
            
        })
    }


   // })
})

})