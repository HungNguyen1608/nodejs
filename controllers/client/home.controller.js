const Product = require("../../models/product.model")
const newPrice = require("../../helpers/newPrice")
//[GET]
module.exports.index = async (req, res) => {
    const productFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6)

    const newProducts = newPrice.price(productFeatured)

    const productNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc"})
    .limit(6)

    const productsNew = newPrice.price(productNew)

    res.render('clients/pages/home/index',{
        pageTitle: "Trang chủ",
        productFeatured: newProducts,
        productsNew: productsNew
    })
}