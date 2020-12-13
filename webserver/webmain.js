const express = require('express')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const api = require("./routes/api")
app.use("/api", api)

const discord_oauth = require("./routes/discord-oauth")
app.use("/discord", discord_oauth)

app.listen(7869, () => {
    console.log("Webserver is active and listenig on 7869")
})