const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const accountSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avartar: String,
    role_id: String,
    status: String,
    deleted: {
        type:Boolean,
        default: false
    },
    deletedAt: Date

},
{
    timestamps: true
})

const Account = mongoose.model('Account', accountSchema,"account")

module.exports = Account