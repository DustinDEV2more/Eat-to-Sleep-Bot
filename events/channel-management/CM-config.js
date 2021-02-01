const { RichEmbed } = require('discord.js')
//     30    18   10    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

var channelMclass = require("../channel-management/ChannelM-class")

var Monday_Mario_Kart = new channelMclass(
"30 18 10 * *", //start time
"30 19 10 * *", //end time
"Monthly Mario Kart", //Event Name
"Mario Kart Talk", // Talk Name ">>Talk<< 1", ">>Talk<< 2"
"Mario Kart Infos", //Text Channel Name
new RichEmbed() //Embed wish will be send in the Text Channel 
.setColor("#0984e3")
.setThumbnail("https://www.mariowiki.com/images/thumb/7/71/Crazy8MK8.png/1200px-Crazy8MK8.png")
.setTitle("Monday Mario Kart").setDescription("Das heutige Monthly Mario Kart auf Eat, Sleep, Nintendo, Repeat hat nun begonnen")
.addField("Infos:", "Start: 18:30 Uhr\nEnde: 19:30 Uhr\nTurnier Code: 2657-4724-8683")
.addField("Eure Teilnahme Geschenke:", "2* XP Boost in MMK Talks"),
"585523787408212079", //Copie Permission from this Categorie ID
"585523787408212079",  //Send Members back to this Categorie ID
true, //xp x 2 > true or false
)

var Among_Us_Donnerstag = new channelMclass(
"30 19 * * 4", //start time
"0 21 * * 4", //end time
"Among Us Donnerstag", //Event Name
"Spaceship", // Talk Name ">>Talk<< 1", ">>Talk<< 2"
"Among Us Infos", //Text Channel Name
new RichEmbed() //Embed wish will be send in the Text Channel 
.setColor("#9e0e0e")
.setThumbnail("https://vignette.wikia.nocookie.net/among-us-wiki/images/a/a6/1_red.png/revision/latest/top-crop/width/360/height/450?cb=20200912125145")
.setTitle("Among Us Donnerstag").setDescription("emergency meeting! Alle sofort in den Talk und mitspielen")
.addField("Eure Teilnahme Geschenke:", "2* XP Boost in Spaceship Talks")
.addField("Achtet bitte auf folgendes:", "Während einer Runde müssen sich alle im Talk muten! Es darf nur geredet werden wenn eine Leiche gefunden wurde oder ein emergency meeting ausgerufen wird. Danach muss sich jeder wieder muten. Wenn du von einem Imposter getötet wurdest darfst du dich erst wieder entmuten wenn die Runde vorbei ist. Aber das wichtigste: Have funn!"),
"585523787408212079", //Copie Permission from this Categorie ID
"585523787408212079",  //Send Members back to this Categorie ID
true, //xp x 2 > true or false
)

var Denkis_Bibel_Stunde = new channelMclass(
"00 18 * * 5", //start time
"30 18 * * 5", //end time
"Denkis Bibelstunde", //Event Name
"Beichtstuhl", // Talk Name ">>Talk<< 1", ">>Talk<< 2"
"Die Bibel", //Text Channel Name
new RichEmbed() //Embed wish will be send in the Text Channel 
.setColor("#e63244")
.setThumbnail("https://vignette.wikia.nocookie.net/among-us-wiki/images/a/a6/1_red.png/revision/latest/top-crop/width/360/height/450?cb=20200912125145")
.setTitle("Denkis Bibelstunde").setDescription("Denkis Bibelstunde hat begonnen. Gesellt euch unter die Augen Jesus und setzt euch in den Beichtstuhl Priester Denki")
.addField("Eure Teilnahme Geschenke:", "2* XP Boost in Spaceship Talks")
"585523787408212079", //Copie Permission from this Categorie ID
"585523787408212079",  //Send Members back to this Categorie ID
true, //xp x 2 > true or false
)
