const express = require("express");
const MEMBER = require("../../Models/MEMBER")
const fetch = require("node-fetch")
const DiscordOauth2 = require("discord-oauth2");
const config = require("../../config.json");
const cookieParser = require("cookie-parser");
const { response } = require("express");

const app = express.Router();

//checking if request is Authorized
var cookie_token_cache = [];
app.use("/", async (req, res, next) => {
    var cookie_token = req.cookies.token
    //if no cookie was send in request
    if (!cookie_token) return res.status(401).send({"error": "Unauthorized - missing cookie"});

    //check if cookie is in cache
    if (cookie_token_cache.find(x => x.cookie_token == cookie_token)) return next();

    //try to find member wish is assosiated to the cookie
    var memberdb = await MEMBER.findOne({"oauth.cookies.token": cookie_token})

    //didnt find member trough database
    if (!memberdb) return res.status(401).send({"error": "Unauthorized - cookie not valid"});
    //member found in database

    else {
    //save cookie_token to cache so api dont have to pull database for veryfication again, but remove it after an hour from cache
    cookie_token_cache.push({cookie_token});
    setTimeout(() => {
        cookie_token_cache.pop();
    }, 3600000);
    //give request to path it belongs to
     return next();
    }
})

app.use("/user", async (req, res) => {
    var cookie_token = req.cookies.token
    var memberdb = await MEMBER.findOne({"oauth.cookies.token": cookie_token})
    if (!memberdb) return res.status(401).send({"error": "Unauthorized - cookie not valid"});
    
    //verify if Discord oauth access_token is still valid
        //check if token is natually expiered
        if (memberdb.oauth.expire_date < new Date()){
            //token is expired. try to refresh it with refresh token
            const oauth = new DiscordOauth2();
            oauth.tokenRequest({
                clientId: config.discord_api.client_id,
                clientSecret: config.discord_api.client_secret,
             
                refreshToken: memberdb.oauth.refresh_token,
                grantType: "refresh_token",
                scope: memberdb.oauth.scopes,                
                redirectUri: memberdb.oauth.redirect,
            }).then(async response => {
                var expire_date = new Date()
                expire_date.setSeconds(expire_date.getSeconds() + response.expires_in)
                await MEMBER.findOneAndUpdate({"id": memberdb.id}, {"oauth.access_token": response.access_token, "oauth.refresh_token": response.refresh_token, "oauth.expire_date": expire_date})
                memberdb.oauth.access_token = response.access_token
            }).catch(error => {
                return res.status(511).send({"error": "Unauthorized by Discord - Discord didnt allowed this Server to get Information about a User"});
            })
        }
        else {
        //get Information from Discord Servers
        fetch("https://discord.com/api/users/@me", {headers: {Authorization: `Bearer ${memberdb.oauth.access_token}`}}).then(discord_res => discord_res.json()).then(json => {
            if (json.message == "401: Unauthorized"){
                return res.status(511).send({"error": "Unauthorized by Discord - Discord didnt allowed this Server to get Information about a User"});
            }
            if (json.id != undefined){
                return res.send({"name": json.username + "#" + json.discriminator, "avatar": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png`})
            }
            else {
                return res.status(500).send({"error": "Discord Error - Something is wrong with the Discord Server response"});
            }
        })

        }
})

module.exports = app;