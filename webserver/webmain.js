const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');
var cors = require('cors')


const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

const api = require("./routes/api")
app.use("/api", cors(), api)

const discord_oauth = require("./routes/discord-oauth")
app.use("/discord", discord_oauth)

const interface = require("./routes/webinterface")
app.use("/webinterface", interface)

app.get("/coins/:id", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")
    var discordclient = require("../index").client
    var mdb = await MEMBER.findOne({"id": req.params.id})
    if (!mdb) return res.send("DB INDEX not found")
    mdb.currencys.coins.log = mdb.currencys.coins.log.reverse()

    discordclient.guilds.cache.get("585511241628516352").members.fetch(mdb.id).then(m => {
    
    res.render("coincard", {raw: true, member: mdb, pb: m.user.displayAvatarURL() + "?size=2048", tag: m.user.tag})
    })

})

app.get("/rank/:id", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")
    var discordclient = require("../index").client
    var mdb = await MEMBER.findOne({"id": req.params.id})
    if (!mdb) return res.send("DB INDEX not found")
    mdb.currencys.ranks.nextxp = 10 * mdb.currencys.ranks.rank / 10 * 5; 

    discordclient.guilds.cache.get("585511241628516352").members.fetch(mdb.id).then(m => {
    
    res.render("rankcard", {raw: true, member: mdb, pb: m.user.displayAvatarURL() + "?size=2048", tag: m.user.tag})
    })

})

app.listen(7869, () => {
    console.log("Webserver is active and listenig on 7869")
})