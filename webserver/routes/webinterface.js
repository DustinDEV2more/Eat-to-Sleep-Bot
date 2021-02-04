const express = require("express");
const { ConnectionStates } = require("mongoose");
const app = express.Router();

//check if user has loged in with 
app.use("/", (req, res, next) => {
    if (!req.cookies.token){
        
    res.cookie("redirect", req.originalUrl)
    return res.redirect("/discord")}
    next();
})


app.get("/user/:id", (req, res) => {
    res.render("userpage", {raw: false})
})

app.get("/usemyvoice", async (req, res) => {
    var MEMBER = require("../../Models/MEMBER")
    var memberdb = await MEMBER.findOne({"oauth.cookies.token": req.cookies.token})
    res.render("usemyvoice", {raw: false, user: memberdb.informations, year: new Date().getFullYear()})
})

app.get("/usemyvoice/submit", async (req, res) => {
    var MEMBER = require("../../Models/MEMBER")

    if (!req.query.name) return res.render("message", {raw: false, title: "Oops", description: "Du hast keinen Namen angegeben. Du kannst auch einfach deinen Discord Namen nehmen."})
    if (!req.query.checkbox) return res.render("message", {raw: false, title: "Oops", description: "Bitte überüfe deine eingaben."})

    var memberdb = await MEMBER.findOneAndUpdate({"oauth.cookies.token": req.cookies.token}, {usemyvoice: {accepted: true ,date: new Date()}})
    res.render("message", {raw: false, title: "Erfolgreich", description: "Du hast deine Einwilligung erfolgreich abgeliefert."})
})


app.use("/*", (req, res) => {
    res.status(404).render("404", {raw: false})
})



module.exports = app;