const express = require("express");


const app = express.Router();



app.use("/music/:guildid", (req, res) => {
    res.render("music.ejs")
})



module.exports = app;