const express = require("express");
const { ConnectionStates } = require("mongoose");
const config = require("../../config.json")
const nodemailer = require("nodemailer")
const app = express.Router();
const fetch = require("node-fetch")
const discordclient = require("../../index").client
//check if user has loged in with 
app.use("/", (req, res, next) => {
    if (!req.cookies.token){
        
    res.cookie("redirect", req.originalUrl)
    return res.redirect("/discord")}
    next();
})

app.get("/usemyvoice", async (req, res) => {
    var MEMBER = require("../../Models/MEMBER")
    var memberdb = await MEMBER.findOne({"oauth.cookies.token": req.cookies.token})
    if (memberdb.usemyvoice.accepted == true) {
        if (memberdb.usemyvoice.date.getFullYear() != new Date().getFullYear()){}
        else return res.render("message", {raw: false, title: "Du hast bereits eine aktive Einverständniss Erklärung", description: "Du brauchst sie erst nach Silvster wieder erneuern"});
    }


    if (!memberdb) {
        res.cookie("redirect", req.originalUrl)
        return res.redirect("/discord");}

    res.render("usemyvoice", {raw: false, user: memberdb.informations, year: new Date().getFullYear()})
})

app.post("/usemyvoice/", async (req, res) => {
    var MEMBER = require("../../Models/MEMBER")

    console.log(req.body)

    if (!req.body.signature || req.body.signature == "") return res.status(401).send({error: "signature is required"});
    if (!req.body.accepted) return res.status(401).send({error: "you need to accept the terms"});

    var memberdb = await MEMBER.findOneAndUpdate({"oauth.cookies.token": req.cookies.token}, {usemyvoice: {accepted: true ,date: new Date(), signature: req.body.signature}}).then(async () => {
        if (req.body.email) {

            //fetch Email from Discord
            var memberdb = await MEMBER.findOne({"oauth.cookies.token": req.cookies.token})
            fetch("https://discord.com/api/users/@me", {headers: {Authorization: `Bearer ${memberdb.oauth.access_token}`}}).then(res => res.json()).then(async userinfo => {
    
            //Email
            var message = {
                from: `"Eat, Sleep, Nintendo, Repeat" <Eat-Sleep-Nintendo-Repeat@dustin-dm.de>`,
                to: `${userinfo.email}`,
                subject: "Einverständniserklärung zur Nutzung von Stimmenaufnahmen",
                html: `<div class="content">
    
                <p>Hey ${userinfo.username}! Wie du gewünscht hast, senden wir dir hier die Kopie der Einverständniserklärung zur Nutzung von Stimmenaufnahmen zu. Diese Email wurde automatisch verschickt. Bitte antworte nicht auf diese Email und schicken keine neuen Emails an eat-sleep-nintendo-repeat@dustin-dm.de<p>
                <br>
                <br>
                <h2>Einverständniserklärung zur Nutzung von Stimmenaufnahmen und Nutzerinformationen</h2>
            
                <p>zwischen Dustin David Meyer (Dustin_DM) und dem Nutzer und/oder Verwalter des Discord Accounts mit der Kennung "${userinfo.username}"</p>
            
                <h3>Gegenstand:</h3>
                <p>Stimmenaufnahmen und Nutzerinformationen wie Name, Diskriminator und Profilbild des Discord Accounts im Jahre ${new Date().getFullYear()}</p>
            
                <h3>Verwendungszweck</h3>
                <p>Veröffentlichung für diverse Mediengattungen. Diese wären Plattformen wie YouTube oder Twitch.</p>
            
                <h3>Widerruf</h3>
                <p>Ein Widerruf kann jederzeit und mit sofortiger Wirkung für die Zukunft erfolgen. Dieser ist auf folgenden Wegen einzureichen:</p>
                <ul>
                    <li><p>Email: public@dustin-dm.de</p></li>
                    <li><p>Über den Postweg:</p><p> Anja Meyer z.Hd Dustin Meyer</p><p>Bergstraße 50, 09113</p></li>
                </ul>
                <br>
                <br>
            
                <h3>Erklärung</h3>
                <p>${userinfo.username} erklärt sein/ihr Einverständnis mit der Verwendung der Aufnahmen seiner/ihrer Person in Form von Audio für die oben beschriebenen Zwecke. Eine
                Verwendung der Audio Aufnahmen für andere, als die beschriebenen Zwecke oder ein Inverkehrbringen durch Überlassung der Aufnahmen an Dritte, ist unzulässig.
                Diese Einwilligung ist freiwillig. Diese Einwilligung
                kann jederzeit mit Wirkung für die Zukunft über die oben beschriebenen Wege widerrufen werden.</p>
    
                <h3>Digitale Unterschrifft:</h3>
                <h4>${req.body.signature}</h4>
            </div>
            </div>`,
                };
    
                var transport = nodemailer.createTransport(config.emailservice);
                transport.sendMail(message, (error, info) => {
                    if (error) {
                      return console.log(error);
                    }
                    console.log('Email sent: %s', info.messageId);
                    discordclient.users.cache.get(userinfo.id).send("✅ Vielen Dank! Du kannst nun in Stream Channel joinen.")
                    discordclient.channels.cache.get("586176769409810452").send(`${userinfo.username} hat die Einverständniserklärung zur Nutzung von Stimmenaufnahmen auf den Server hinterlegt.`)
                    res.sendStatus(200)
                    
                  });
    
            })
    
        }
        else {
            discordclient.channels.cache.get("586176769409810452").send(`${req.body.signature} hat die Einverständniserklärung zur Nutzung von Stimmenaufnahmen auf den Server hinterlegt.`)
            res.sendStatus(200)
        }
    }).catch((error) => {
        res.sendStatus(500)
        console.log(error)
    })
})


app.use("/*", (req, res) => {
    res.status(404).render("404", {raw: false})
})



module.exports = app;