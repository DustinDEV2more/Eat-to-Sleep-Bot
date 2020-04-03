const { client, config} = require("../../index")
const { RichEmbed } = require('discord.js')
const colour = require("../../colours.json")
const fs      = require("fs");
var schedule = require('node-schedule');

const request = require("request");


client.on("messageReactionAdd", (Reaction, User) => {
    if (Reaction.message.id != "695624078207221872" || Reaction.emoji != "✅") return;
    Reaction.remove(User)
    client.users.get("330380702505762817").send(User.tag + " Check in versuch\n" + User.id)
    var mostneedcall = `https://Dustin_DM:${config.tokens.challonge}@api.challonge.com/v1`

    request.get(mostneedcall + "/tournaments/" + config.tokens["challonge-id-test"] + "/participants.json", function (error, response, body) {
        var json = JSON.parse(body)
      //Nutzer in der Liste gefunden:
        if (json.find(p => p.participant.name === User.tag)){
           var p = json.find(p => p.participant.name === User.tag)
           console.log(p.participant.checked_in)
           if (p.participant.checked_in == true) return User.send("Du hast bereits in das Turnier eingecheckt ^^\nDu solltest dich jetzt vorbereiten und dich einspielen.")
            //Check In post
            request.post(mostneedcall + `/tournaments/${config.tokens["challonge-id-test"]}/participants/${p.participant.id}/check_in.json`, function (error, response, body) {
            var json = JSON.parse(body)
                if(json.participant.checked_in == true){User.send(new RichEmbed().setTitle("Check In erfolgreich!").setColor(colour.grün).setDescription("Wir sehen uns beim Turnier ^^\nSpiel dich vorher ein!"))}
                if(json.participant.checked_in == false){User.send(new RichEmbed().setTitle("Check In fehlgeschlagen!").setColor(colour.gelb).setDescription("Dein Check in wurde nicht erfolgreich durchgeführt. Ein Admin wurde infomiert um deinen Check-In manuell durchzuführen ^^. Keine Sorge. Spiel dich schonmal ein"))}
                client.users.get("330380702505762817").send(`Neuer Check In!\n\n\`\`\`json\n${JSON.stringify(json)}\`\`\``)
            });
        }
        else {
            User.send(new RichEmbed().setTitle("Check In fehlgeschlagen!").setColor(colour.gelb).setDescription("Dein Check in wurde nicht erfolgreich durchgeführt dies könnte daran liegen das du deinen Nuternamen oder deinen Discriminator auf Discord geändert hast, und deshalb nicht im Turnier gefunden wurdest. Ein Admin wurde infomiert um deinen Check-In manuell durchzuführen ^^. Keine Sorge. Spiel dich schonmal ein"))
        }
      });


})



//WENN FERTIG! UNBEDINGT DAS TURNIER ÄNDERN