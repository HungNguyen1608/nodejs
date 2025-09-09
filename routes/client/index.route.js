const productRoute = require('./product.route')
const homeRoute = require('./home.route')
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const searchRoute = require("./search.route")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const cartRoute = require("./cart.route")

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use('/', homeRoute)
    app.use('/products',productRoute)
    app.use('/search', searchRoute)
    app.use('/cart', cartRoute)
}