const { RichEmbed } = require('discord.js')
//     30    18    *    *    1
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

var channelMclass = require("../channel-management/ChannelM-class")

var MMK = new channelMclass(
"30 18 * * 1", //start time
"30 19 * * 1", //end time
"Monday Mario Kart", //Event Name
"Talk", // Talk Name ">>Talk<< 1", ">>Talk<< 2"
"Mario Kart Infos", //Text Channel Name
new RichEmbed() //Embed wish will be send in the Text Channel 
.setColor("#0984e3")
.setThumbnail("https://www.mariowiki.com/images/thumb/7/71/Crazy8MK8.png/1200px-Crazy8MK8.png")
.setTitle("Monday Mario Kart").setDescription("Das heutige Monday Mario Kart auf Eat, Sleep, Nintendo, Repeat hat nun begonnen")
.addField("Infos:", "Start: 18:30 Uhr\nEnde: 19:30 Uhr\nTurnier Code: 2442-6453-9691")
.addField("Eure Teilnahme Geschenke:", "2* XP Boost in MMK Talks"),
"585523787408212079", //Copie Permission from this Categorie ID
"585523787408212079",  //Send Members back to this Categorie ID
true, //xp x 2 > true or false
)

var SS = new channelMclass(
        "00 17 * * 6", //start time
        "45 18 * * 6", //end time
        "Splatoon Samstag", //Event Name
        "SS Talk", // Talk Name ">>Talk<< 1", ">>Talk<< 2"
        "Squid Kid Channel", //Text Channel Name
        new RichEmbed() //Embed wish will be send in the Text Channel 
        .setColor("#ef3c79")
        .setThumbnail("https://i.redd.it/zb1uvh5oypz11.png")
        .setTitle("Splatoon Samsatg").setDescription("Trefft euch im Talk und unterhaltet euch darüber was ihr heute machen wollt(Standard, Private, Salmonrun, Liga). Es ist hilfreich wenn ihr eure Freundescodes in <#713748611493527593> schreibt.")
        .addField("Eure Teilnahme Geschenke:", "2* XP Boost in Talks"),
        "585523787408212079", //Copie Permission from this Categorie ID
        null,  //Send Members back to this Categorie ID
        true, //xp x 2 > true or false
        )