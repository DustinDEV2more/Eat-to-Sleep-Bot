const express = require("express");

const app = express.Router();

const music = require("../../commands/musik").api
app.use("/music", music)



module.exports = app;