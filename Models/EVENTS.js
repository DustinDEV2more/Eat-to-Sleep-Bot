const mongoose = require("mongoose")

const Schema = mongoose.Schema({
    name: String,
    active: Boolean,
    start: String,
    end: String,

    start_script: String

})

module.exports = mongoose.model("Event", Schema)