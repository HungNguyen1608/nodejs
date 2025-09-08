const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: {
        type:Boolean,
        default: false
    },
    deletedAt: Date

},
{
    timestamps: true
})

const Cart = mongoose.model('Cart', cartSchema,"cart")

module.exports = Cart