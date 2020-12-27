var config = require("../../config.json")
const express = require("express");
const { post } = require("./api");
const DiscordOauth2 = require("discord-oauth2");
const { default: fetch } = require("node-fetch");
const MEMBER = require("../../Models/MEMBER")
const nanoid = require("nanoid").nanoid

const app = express.Router();

app.get("/", (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${config.discord_api.client_id}&scope=${"identify email"}&redirect_uri=${`${req.protocol}://${req.headers.host}/discord/redirect`}`)
})

app.get("/redirect", async (req, res) => {
    
    const oauth = new DiscordOauth2();
    var code = req.query.code

    oauth.tokenRequest({
        clientId: config.discord_api.client_id,
        clientSecret: config.discord_api.client_secret,
     
        code: code,
        scope: "identify email",
        grantType: "authorization_code",
        
        redirectUri: `${req.protocol}://${req.headers.host}/discord/redirect`,
    }).then(code => {
        //get loged in user informations

        fetch("https://discord.com/api/users/@me", {headers: {Authorization: `Bearer ${code.access_token}`}}).then(res => res.json()).then(async userinfo => {
            //Check if user is in db
            var expire_date = new Date()
            expire_date.setSeconds(expire_date.getSeconds() + code.expires_in)
            var login = nanoid(64)

            var memberdb = await MEMBER.findOne({"id": userinfo.id})
            memberdb.oauth.cookies.push({code: login})
            if (5 < memberdb.oauth.cookies.length) {memberdb.oauth.cookies.shift()}

            if (!memberdb) return res.send("Login nicht möglich. Du bist nicht auf dem Eat, Sleep, Nintendo, Repeat Server")
            await MEMBER.findOneAndUpdate({"id": userinfo.id}, {"oauth": {"access_token": code.access_token, "refresh_token": code.refresh_token, "expire_date": expire_date, "scopes": code.scope.split(" "), "cookies": memberdb.oauth.cookies}})
            res.cookie("login", login)


            return res.send(`Login von ${userinfo.username}#${userinfo.discriminator} mit der Email "${userinfo.email}" war erfolgreich! Zum aktuellen Zeitpunkt werden keine Daten von dir erhoben. Alles was hier angezeigt wird, wird aktuell nicht auf des Servern oder in der Database von eat, sleep nintendo, repeat hinterlegt`)
            
        })



    }).catch(e => res.redirect("/discord"))
})


module.exports = app;