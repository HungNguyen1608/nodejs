const Product = require('../../models/product.model')
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })

    const newProducts = products.map(item => {
        item.priceNew = ((item.price*(100-item.discountPercentage))/100).toFixed(2)
        return item
    })
    console.log(products)

    res.render('clients/pages/products/index',{
            pageTitle:"Trang sản phẩm",
            products: newProducts
    })
}

// [GET] /product/:slug
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find)
        console.log(product)
        res.render("clients/pages/products/detail",{
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })
    }catch(e){
        req.flash("error","Đã xảy ra lỗi khi truy vấn")
        res.redirect(`/products`)
    }
}