const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/products-category
module.exports.index = async (req, res) =>{
    let find = {
        deleted: false,
    }
    const records = await ProductCategory.find(find)
    console.log(records)
    const newRecords = createTreeHelper.createTree(records)

    res.render("admin/pages/products-category/index",{
        pageTitle: "Danh mục sản phẩm",
        records: newRecords

    })
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) =>{
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.createTree(records)
    
    res.render("admin/pages/products-category/create",{
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    })
}

// [POST] /admin/products-category/create
module.exports.save = async (req, res) => {
    if(req.body.position === ""){
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1
    } else{
        req.body.position = parseInt(req.body.position)
    }
    const record = new ProductCategory(req.body)
    await record.save()

    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

// [GET] /edit/:id
module.exports.edit = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const productCategory = await ProductCategory.findOne(find)

        const records = await ProductCategory.find({
            deleted: false
        })
        const newRecords = createTreeHelper.createTree(records)

        res.render("admin/pages/products-category/edit",{
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            productCategory: productCategory,
            newRecords: newRecords
        })
    }catch(e){
        console.log(e)
        // req.flash("error","Đã xảy ra lỗi khi truy vấn")
        // res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
   
}

// [PATCH] /edit/:id
module.exports.update = async (req, res) => {
    req.body.deleted = false

    if(req.body.position === ""){
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1
    } else{
        req.body.position = parseInt(req.body.position)
    }
    // console.log(req.body.parent_id)
    try{
        await ProductCategory.updateOne(
            {
                _id: req.params.id
            },
            req.body   

        )
        req.flash("success","Update thành công")

    }catch(e){
        req.flash("error","Update không thành công")
    }
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
   
}
