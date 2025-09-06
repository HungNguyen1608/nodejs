const Product = require("../../models/product.model")
const Account = require("../../models/account.model")
const ProductCategory = require("../../models/product-category.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")

// [GET] /admin/products
module.exports.index = async (req, res) =>{
    let filterStatus = filterStatusHelper(req.query)
    let find = {
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status
    }

    let sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{
        sort.position = "desc"
    }
    
    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }

    //pagination
    const countProducts = await Product.countDocuments(find)

    let objectPagination = paginationHelper({
            limitItem: 4,
            currentPage: 1
        },
        req.query,
        countProducts
    )

    const products = await Product.find(find)
                                .sort(sort)
                                .limit(objectPagination.limitItem)
                                .skip(objectPagination.skip)
    for(const product of products){
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(user){
            product.accountName = user.fullname
        }
        //Lấy ra tt user cập nhật
        // const updatedBy = product.updatedBy[product.updatedBy.length - 1]
        const updatedBy = product.updatedBy.slice(-1)[0]
        if(updatedBy){
            const userUpdate = await Account.findOne({
                _id: updatedBy.account_id
            })
            updatedBy.accountFullname = userUpdate.fullname
        }
        console.log(product.updatedBy)


    }
    
    
    res.render('admin/pages/product/index',{
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id
    console.log(status,id)
    const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
    }
    await Product.updateOne({ _id: id},{ status: status, $push: {updatedBy: updatedBy} })
    req.flash("success", "Cập nhật trạng thái thành công")
    
    // res.redirect("back")
    res.redirect("/admin/products")
}

// [PATCH] /change-multi
module.exports.changeMulti = async (req, res) => {
    console.log(req.body)
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
    }
    switch (type){
        case "active":
            await Product.updateMany({
                _id: { $in: ids}
            },{ status: "active", $push: {updatedBy: updatedBy}})
            req.flash("success",`Cập nhật trạng thái ${ids.length} sản phẩm thành công`)
            break
        case "inactive":
            await Product.updateMany({
                _id: { $in: ids}
            },{ status: "inactive", $push: {updatedBy: updatedBy}})
            req.flash("success",`Cập nhật trạng thái ${ids.length} sản phẩm thành công`)
            break
        case "delete-all":
            await Product.updateMany({
                _id: { $in: ids}
                },{ 
                deleted: true,
                deletedAt: new Date(),
                $push: {updatedBy: updatedBy}
            })
            req.flash("success",`Xoá ${ids.length} sản phẩm thành công")`)

            break
        case "change-position":
            for( const item of ids){
                let [id,position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({
                    _id:id
                },{
                    position: position,
                    $push: {updatedBy: updatedBy}
                })
            }
            req.flash("success",`Cập nhật vị trí ${ids.length} sản phẩm thành công`)
            break
        default:
            break
        
    }

    res.redirect("/admin/products")
}

// [DELETE] /delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id
    await Product.updateOne({ _id: id},{
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })
    req.flash("success",`Xoá sản phẩm thành công`)
    // res.redirect("back")
    res.redirect("/admin/products")
}

// [GET] /create
module.exports.create = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false
    })
    const newRecords = createTreeHelper.createTree(records)

    res.render("admin/pages/product/create",{
        pageTitle: "Thêm mới sản phẩm",
        records: newRecords
    })
}

// [POST] /create
module.exports.save = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.deleted = false
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    if(req.body.position === ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1
    } else{
        req.body.position = parseInt(req.body.position)
    }
    // if(req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`

    // }
    // console.log(req.body)
    const product = new Product(req.body)
    await product.save()

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /edit/:id
module.exports.edit = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const records = await ProductCategory.find({
            deleted: false
        })
        const newRecords = createTreeHelper.createTree(records)
        const product = await Product.findOne(find)
        res.render("admin/pages/product/edit",{
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            newRecords: newRecords
        })
    }catch(e){
        req.flash("error","Đã xảy ra lỗi khi truy vấn")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
   
}

// [PATCH] /edit/:id
module.exports.update = async (req, res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.deleted = false

    if(req.body.position === ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1
    } else{
        req.body.position = parseInt(req.body.position)
    }
    // if(req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`

    // }
    // console.log(req.body)
    try{
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Product.updateOne(
            {
                _id: req.params.id
            },
            {
                ...req.body,
                $push: {updatedBy: updatedBy} 
            }
        )
        req.flash("success","Update thành công")

    }catch(e){
        req.flash("error","Update không thành công")
        // res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /detail/:id
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render("admin/pages/product/detail",{
            pageTitle: "Chi tiết sản phẩm",
            product: product
        })
    }catch(e){
        req.flash("error","Đã xảy ra lỗi khi truy vấn")
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
   
}
