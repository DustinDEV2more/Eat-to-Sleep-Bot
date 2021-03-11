const express = require("express");
const app = express.Router();


app.use("/", async (req, res, next) => {
    var MEMBER = require("../../Models/MEMBER")
    var memberdb = await MEMBER.findOne({"oauth.cookies.token": req.cookies.token})

    if (memberdb.type < 90) return res.status(403).render("message", {raw: false, title: "Dies ist der Admin berreich", description: "Wie du am namen erkennen kannst ist dieser nur für Admins. Also schleich dich"})
    next();
})

app.get("/", (req, res) => {
    res.render("ADMIN_main", {raw: false})
})

app.get("/api-bans", (req, res) => {
    res.render("ADMIN_api-bans", {raw: false})
})

app.get("/events", (req, res) => {
    res.render("ADMIN_events", {raw: false})
})

module.exports = app;