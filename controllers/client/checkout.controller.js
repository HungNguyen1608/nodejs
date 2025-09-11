const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")

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
    res.render('clients/pages/checkout/index',{
        pageTitle: "Trang thanh toán",
        cartDetail: cart
    })
}

//[POST] /cart/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId
    const userInfo = req.body

    const cart = await Cart.findOne({
        _id: cartId
    })
    const products = []

    for(const product of cart.products){
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        }

        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("price discountPercentage")

        objectProduct.price = productInfo.price
        objectProduct.discountPercentage = productInfo.discountPercentage
        products.push(objectProduct)
    }
    const orderInfo =  {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    }
    const order = new Order(orderInfo)
    order.save()

    await Cart.updateOne({
        _id: cartId
    },{
        products: []
    })
    res.redirect(`/checkout/success/${order.id}`)
}

//[GET] /checkout/success/:orderId
module.exports.success = async (req,res) => {
    const order = await Order.findOne({
        _id: req.params.orderId
    })
    for(const product of order.products){
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail slug")
        product.productInfo = productInfo
        product.priceNew = priceNewHelper.priceNew(product)
        product.totalPrice = product.priceNew * product.quantity
        // console.log(productInfo)
    }
    order.totalPrice = order.products.reduce((sum,item) => sum + item.totalPrice,0)
    console.log(order)
    res.render("clients/pages/checkout/success",{
        pageTitle: "Đặt hàng thành công",
        order: order
    })
}