const mongoose = require("mongoose")

const MemberSchema = mongoose.Schema({
    id: {required: true, type: String},

    currencys:{
        ranks: {
        rank: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
        },
        coins: {
            amount: {type: Number, default: 300},
            log: Array,
            purchases: {type: Array, default: []},
            last_daily: {type: Date, default: null}
        },
    },

    warnings: { type: Array, default: [] },
    options: {
        ytvoice: {type: Boolean, default: false},
        nintendo: String
    },

    statistics: {

    },
    oauth: {
        access_token: String,
        refresh_token: String,
        expire_date: Date,
        scopes: Array
    },
    delete_in: Date
})

module.exports = mongoose.model("Member-v2.0", MemberSchema)