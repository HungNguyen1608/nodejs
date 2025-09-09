const Cart = require("../../models/cart.model")

module.exports.cartId = async (req,res,next) =>{
    if(!req.cookies.cartId){
        const cart = new Cart()
        const expiresCookie = 365*24*60*60*1000
        await cart.save()
        res.cookie("cartId",cart.id,{
            expires: new Date(Date.now()+ expiresCookie)
        })
    }

    next()
}