const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const api = require("./routes/api")
app.use("/api", api)

const discord_oauth = require("./routes/discord-oauth")
app.use("/discord", discord_oauth)

const interface = require("./routes/webinterface")
app.use("/webinterface", interface)

app.listen(7869, () => {
    console.log("Webserver is active and listenig on 7869")
})