const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const priceNewHelper = require("../../helpers/newPrice")

//[GET] /cart
module.exports.index = async (req, res) => {
    const cart = res.locals.miniCart
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id
            const productInfo = await Product.findOne({
                _id: productId,
                deleted: false
            }).select("title thumbnail slug price discountPercentage")
            productInfo.priceNew = priceNewHelper.priceNew(productInfo)
            item.productInfo = productInfo
            item.totalPrice = productInfo.priceNew * item.quantity
        }
    }
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.quantity * item.productInfo.priceNew, 0)
    console.log(cart)
    res.render('clients/pages/cart/index', {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}

//[POST] /cart/adđ/:productId
module.exports.addCart = async (req, res) => {
    const productId = req.params.productId
    const quantity = req.body.quantity
    const cartId = req.cookies.cartId

    const existCart = await Cart.findOne({
        _id: cartId
    })
    if (existCart) {
        const productExist = existCart.products.find((p) => p.product_id.toString() === productId)
        if (productExist) {
            productExist.quantity += parseInt(quantity)
            await existCart.save()
        } else {
            const objectCart = {
                product_id: productId,
                quantity: quantity
            }
            await Cart.updateOne(
                { _id: cartId },
                { $push: { products: objectCart } }
            )
        }

        req.flash("success", "Đã thêm vào giỏ hàng")
        return res.redirect(req.get('Referrer') || '/');

    }
}

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId

    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: { products: { product_id: productId } }
    })
    req.flash("success", "Xoá thành công sản phẩm khỏi giỏ hàng")
    res.redirect(req.get('Referrer') || '/');
}

//[GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.params.quantity, 10);
    console.log(productId, quantity)
    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId
        },
        {
            $set: {
                "products.$.quantity": quantity
            }
        }
    )
    req.flash("success","Updated")
    res.redirect(req.get('Referrer') || '/');
}