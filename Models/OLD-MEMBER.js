const mongoose = require("mongoose")

const MemberSchema = mongoose.Schema({
    info:{
        id: String,
        name: String,
        picture: String
    },

    ranks:{
        rank: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
    },
    coins: {
        amount: {type: Number, default: 300},
        log: Array,
        purchases: {type: Array, default: []}
    },
    warns: { type: Array, default: [] },
    more: {
        ytvoice: {type: Boolean, default: false},
        nintendo: String
    },
    expire: Date
})

module.exports = mongoose.model("Member", MemberSchema)