const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');
var cors = require("cors")


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

const interface = require("./routes/webinterface");
const { type } = require('os');
app.use("/webinterface", interface)

app.get("/coins/:id", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")
    var mdb = await MEMBER.findOne({"id": req.params.id})
    if (!mdb) return res.send("DB INDEX not found")
    mdb.currencys.coins.log = mdb.currencys.coins.log.reverse()
    var type = require("../modules/member-type-to-word")(mdb.type)

    
    res.render("CARD_coincard", {raw: true, member: mdb, pb: mdb.informations.avatar, type})

})

app.get("/rank/:id", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")
    var mdb = await MEMBER.findOne({"id": req.params.id})
    if (!mdb) return res.send("DB INDEX not found")
    mdb.currencys.ranks.nextxp = 10 * mdb.currencys.ranks.rank / 10 * 5;
    var type = require("../modules/member-type-to-word")(mdb.type)
    mdb.type = require("../modules/member-type-to-word")(mdb.type)

    
    
    res.render("CARD_rankcard", {raw: true, member: mdb, pb: mdb.informations.avatar, type})
   

})

app.get("/ranklist", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")

    //get the first 10 Member sorted by Ranks
    var rankdata = await MEMBER.find().sort({"currencys.ranks.rank": -1})
     var top10 = []

     rankdata.slice(0, 10).forEach(m => {
        var memberedit = m

            var nondbinformation = { 
            tag: require("../modules/member-type-to-word")(1),
            place: rankdata.indexOf(m) + 1
         }
         
        //  console.log(m.extras)
         top10.push({db: m, nondbinformation})
     })


    res.render("CARD_ranklistcard", {raw: true, ranklist: top10})

})




// app.use("/", (req, res) => {res.redirect("/webinterface")})
app.listen(7869, () => {
    console.log("Webserver is active and listenig on 7869")
})