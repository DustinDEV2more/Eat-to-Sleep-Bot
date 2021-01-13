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


app.use("*", (req, res) => {
    res.status(404).render("404", {raw: false})
})



module.exports = app;