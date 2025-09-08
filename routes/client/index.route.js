const productRoute = require('./product.route')
const homeRoute = require('./home.route')
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const searchRoute = require("./search.route")

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use('/', homeRoute)
    app.use('/products',productRoute)
    app.use('/search', searchRoute)
    
}