const Product = require("../../models/product.model")
const priceNewHelper = require("../../helpers/newPrice")
//[GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword
    console.log(keyword)
    let products =[]
    if(keyword)
    {
        const regex = new RegExp(keyword, "i")
        const product = await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        })
        products = priceNewHelper.price(product)
        console.log(product)
    }
    res.render("clients/pages/search/index",{
        pageTitle: "Trang kết quả tìm kiếm",
        keyword: keyword,
        products: products
    })
}