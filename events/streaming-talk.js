var {client} = require("../index")
var MEMBER = require("../Models/MEMBER")
const embed = require("../modules/Embed")

client.on("voiceStateUpdate", async (oldm, newm) => {
    if (newm.channel == null) return;
    if (newm.channel.name.endsWith("🔴"))

    var memberdb = await MEMBER.findOne({"id": newm.id})
    if (!memberdb) return;

    if (memberdb.usemyvoice.accepted == false) return noticemember();
    if (memberdb.usemyvoice.date.getFullYear() != new Date().getFullYear()) return noticemember()

    function noticemember() {
        newm.setChannel(null)

        newm.member.user.send(embed.invisible("Achtung!","Du hast soeben versucht einem Voice Channel zu joinen, in dem aktuell deine Stimme aufgenommen, oder sogar gestreamt werden könnte. Du darft gerne mitmachen! Vorher musst du uns jedoch die Zustimmung und Einverständniss geben, um deine Stimme zu benutzen. Keine Sorge! Dieser Prozess dauert nicht länger als 2 Minuten und du musst ihn nur einmal im Jahr durchlaufen. Wir möchten uns damit nur absichern. Gehe einfach auf [Unsere Webseite](http://server.dustin-dm.de:7869/webinterface/usemyvoice) und melde dich mit Discord an. Danach akzeptierst du das Formular und dann bist du schon fertig! Ganz Easy!")
        .addField("Webseite:", "http://server.dustin-dm.de:7869/webinterface/usemyvoice").addField("Warum?", "Da jeder in unseren Streams willkommen ist, möchtens wir uns gegen Leute schützen, die im Nachhinein behaupten nichts von der Aufnhame/Stream gewusst haben wollen. Eine solche Anschuldigung kann zu hohen Geld Strafen führen.",)
        .addField("Nachteile für dich?", "Keine! Du gibst weder das Recht deiner Stimme an uns, noch gibst du uns das Recht alles mit deiner Stimme zu machen was wir wollen. Die Einverständniss Erklärung stellt nur sicher, das du von der Aufnahme und der Veröffenlichung weißt, und stellt sicher das wir dich darüber in Kenntnis gesetzt haben. Wenn du ausversehen etwas falsches sagst, was du später beräust, dann hast du immernoch jegliches Recht uns aufzufordern, alle Aufnahmen davon zu löschen! Du kannst diese Einverständniss Erklärung übrigens jederzeit zurück ziehen (auch rückwirkend).")
        .addField("Noch Fragen?", "Du darfst gerne dem Server Team von Eat, Sleep, Nintendo, Repeat alle deine Fragen stellen. Hab nur bitte etwas Geduld, falls wir gerade am streamen oder aufnehmen sind ^^°"))
    }

})