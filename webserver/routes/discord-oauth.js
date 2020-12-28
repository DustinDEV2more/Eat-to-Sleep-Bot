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

    //exchange login page code to token
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
            //generate database entry
            var expire_date = new Date()
            expire_date.setSeconds(expire_date.getSeconds() + code.expires_in)
            //login token for cookie
            var login = nanoid(64)

            //get db entry
            var memberdb = await MEMBER.findOne({"id": userinfo.id})
            //push cookie data login to database element
            memberdb.oauth.cookies.push({code: login})
            if (5 < memberdb.oauth.cookies.length) {memberdb.oauth.cookies.shift()} //remove first cookie if there are already 5

            if (!memberdb) return res.send("Login nicht möglich. Du bist nicht auf dem Eat, Sleep, Nintendo, Repeat Server")//send error if member is not in database
            //save to db
            await MEMBER.findOneAndUpdate({"id": userinfo.id}, {"oauth": {"access_token": code.access_token, "refresh_token": code.refresh_token, "expire_date": expire_date, "scopes": code.scope.split(" "), "cookies": memberdb.oauth.cookies}})
            
            //save cookie token to the cookies
            res.cookie("login", login, { expires: expire_date})


            //redirect user to page from before the login promt
            if(req.cookies.redirect){
            res.clearCookie("redirect")
            res.redirect(req.cookies.redirect)
            }
            //redirect user to /webinterface if no redirect cookie was set
            else {res.redirect("/webinterface")}
        })



    }).catch(e => res.redirect("/discord")) //promt user again to the login page if something didnt work
})


module.exports = app;