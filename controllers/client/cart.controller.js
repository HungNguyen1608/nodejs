const Cart = require("../../models/cart.model")

//[GET] /cart/adđ/:productId
module.exports.addCart = async (req, res) => {
    const productId = req.params.productId
    const quantity = req.body.quantity
    const cartId = req.cookies.cartId

    const existCart = await Cart.findOne({
        _id: cartId
    })
    if(existCart){
        const productExist = existCart.products.find((p) => p.product_id.toString() === productId)        
        if(productExist){
            productExist.quantity += parseInt(quantity)
            await existCart.save()

            // await Cart.updateOne({
            //     _id: cartId,
            //     "products.product_id": productId
            // },{
            //     $set: {
            //         "products.$.quantity": productExist.quantity
            //     }
            // })
            req.flash("success", "Đã thêm vào giỏ hàng")
            return res.send("ok")
        }else{
            const objectCart = {
                product_id: productId,
                quantity: quantity
            }
            await Cart.updateOne(
                {
                    _id: cartId
                },{
                    $push: { products: objectCart}
                }
            )
        }
    }
    
    req.flash("success","Đã thêm vào giỏ hàng")
    res.send("ok")
}