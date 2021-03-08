const express = require("express");
const MEMBER = require("../../Models/MEMBER")
const DiscordOauth2 = require("discord-oauth2");
const config = require("../../config.json");
const schedule = require("node-schedule");
const { ConnectionStates } = require("mongoose");

const app = express.Router();

//Checks if User has valid token, active discord tokens and counts rate limits
var api_rate_limiting = {}
var blocked = {}
app.use("/", async (req, res, next) => {
    var cookie_token = req.cookies.token
    //if no cookie was send in request
    if (!cookie_token) return res.status(401).send({"error": "Unauthorized - missing cookie"});
    
    //rate limit
    if (blocked[cookie_token] == -1) return res.status(429).send({"error": "rate limiting - API rate limit exceeded for this user credentials. You can no longer use this api. If you think this happened by accident, please report to Dustin"});
    if (!api_rate_limiting[cookie_token]) api_rate_limiting[cookie_token] = 0
    api_rate_limiting[cookie_token] += 1
    if (api_rate_limiting[cookie_token] > 120){
        //user has exedet the rate limits

        //write the blocked state to database
        await MEMBER.findOneAndUpdate({"oauth.cookies.token": cookie_token}, {"oauth.blocking_state.is_blocked": true, "oauth.blocking_state.date": new Date()})
        blocked[cookie_token] = -1
        return res.status(429).send({"error": "rate limiting - API rate limit exceeded for this user credentials. You can no longer use this API. If you think this happened by accident, please report to Dustin"});
    }

    //try to find member wish is assosiated to the cookie
    var memberdb = await MEMBER.findOne({"oauth.cookies.token": cookie_token})

    //didnt find member trough database
    if (!memberdb) return res.status(401).send({"error": "Unauthorized - credentials not valid"});
    //member found in database

    if (memberdb.oauth.blocking_state.is_blocked == true){
        blocked[cookie_token] = -1
        return res.status(429).send({"error": "rate limiting - API rate limit exceeded for this user credentials. You can no longer use this API. If you think this happened by accident, please report to Dustin"});
    }

    //check if Discord credentials still valid and active
    if (memberdb.oauth.expire_date < new Date()){
        //access_token that belongs to user is not valid anymore
        //trying to refresh access_token
        const oauth = new DiscordOauth2();
            oauth.tokenRequest({
                clientId: config.discord_api.client_id,
                clientSecret: config.discord_api.client_secret,
             
                refreshToken: memberdb.oauth.refresh_token,
                grantType: "refresh_token",
                scope: memberdb.oauth.scopes,                
                redirectUri: memberdb.oauth.redirect,
            }).then(async response => {
                //token was refreshed succsessfull
                var expire_date = new Date()
                expire_date.setSeconds(expire_date.getSeconds() + response.expires_in)
                await MEMBER.findOneAndUpdate({"id": memberdb.id}, {"oauth.access_token": response.access_token, "oauth.refresh_token": response.refresh_token, "oauth.expire_date": expire_date})
                memberdb.oauth.access_token = response.access_token
                next();
            }).catch(error => {
                //token was not able to get refrehed
                return res.status(511).send({"error": "Unauthorized by Discord - The Server is currently not able to gather Informations about your Discord Account"});
            })

    } else {
        next();
    }

    

})

//clear api rate limit points every 2 Minutes
const job = schedule.scheduleJob('*/1 * * * *', function(){
    api_rate_limiting = {}
  });

//1. Shoud respond with Avatar, Name, Discrimminator, and id --> /@basic

//2. Shoud respond with whole data (but oauth and usemyvoice) --> /@me

//2. Shoud respond with whole data (but oauth and usemyvoice) --> /userid

app.get("/user/:userid", async (req, res) => {
    if (req.params.userid == "@basic"){
        var memberdb = await MEMBER.findOne({"oauth.cookies.token": req.cookies.token})
        var response = {
            "id": memberdb.id,
            "name": memberdb.informations.name,
            "discriminator": memberdb.informations.discriminator,
            "avatar": memberdb.informations.avatar
        }
        res.send(response);
    }

    else if (req.params.userid == "@me"){
        var memberdb = await MEMBER.findOne({"oauth.cookies.token": req.cookies.token})
        var response = {
            id: memberdb.id,
            informations: memberdb.informations,
            type: memberdb.type,

            currencys: memberdb.currencys,
            warnings : memberdb.warnings,
            delete_in: memberdb.delete_in
            
        }
        res.send(response)
    }
    else {
    var memberdb = await MEMBER.findOne({"id": req.params.userid})
    if (!memberdb) return res.status(404).send({"error": `user not found - Unable to find a user with the id-value of ${req.params.userid}`});
    var response = {
        id: memberdb.id,
        informations: memberdb.informations,
        type: memberdb.type,

        currencys: memberdb.currencys,
        warnings : memberdb.warnings,
        delete_in: memberdb.delete_in
        
    }
    res.send(response)}
})




module.exports = app;