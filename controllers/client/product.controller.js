const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model')
const productCategoryHelper = require("../../helpers/product-category")
const newPrice = require("../../helpers/newPrice")

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })

    const newProducts = newPrice.price(products)

    res.render('clients/pages/products/index',{
            pageTitle:"Trang sản phẩm",
            products: newProducts
    })
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }
        const product = await Product.findOne(find)
        if(product.product_category_id){
            const categoryName = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })
            product.category = categoryName
        }

        res.render("clients/pages/products/detail",{
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })
    }catch(e){
        req.flash("error","Đã xảy ra lỗi khi truy vấn")
        res.redirect(`/products`)
    }
}


// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try{

        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            deleted: false
        })

        const listSubCategory = await productCategoryHelper.getSubCategory(category.id)

        const listSubCategoryId = listSubCategory.map(item => item.id)

        const products = await Product.find({
            product_category_id: { $in: [category.id, ...listSubCategoryId]
            },
            deleted: false
        }).sort({position:"desc"})
        console.log(products)
        res.render('clients/pages/products/index',{
            pageTitle: category.title,
            products: products
        })
    }catch(e){
        req.flash("error","Đã xảy ra lỗi khi truy vấn")
        res.redirect(`/products`)
    }
}
