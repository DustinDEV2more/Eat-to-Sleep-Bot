const mongoose = require("mongoose")

const MemberSchema = mongoose.Schema({
    id: {required: true, type: String},
    informations: {name: String, discriminator: String, avatar: String},
    type: {default: 0, type: Number},

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
        nintendo: String
    },

    statistics: {

    },
    oauth: {
        access_token: {default: null, type: String},
        refresh_token: String,
        expire_date: Date,
        scopes: Array,
        redirect: String,
        cookies: Array
    },

    usemyvoice: {
        accepted: {type: Boolean, default: false},
        date: Date
    },

    delete_in: {default: null, type: Date}
})

module.exports = mongoose.model("Member-v2.0", MemberSchema)