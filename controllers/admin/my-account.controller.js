const Account = require("../../models/account.model")
const systemConfig = require("../../config/system")
const md5 = require("md5")

//[GET] /admin/my-account/
module.exports.index = async (req,res) =>{
    res.render("admin/pages/my-account/index",{
        pageTitle: "Thông tin cá nhân"
    })
} 

//[GET] /admin/my-account/edit
module.exports.edit = async (req,res) =>{
    res.render("admin/pages/my-account/edit",{
        pageTitle: "Chỉnh sửa thông tin"
    })
} 

//[PATCH] /admin/my-account/edit
module.exports.update = async (req,res) =>{
    try {
        const emailExist = await Account.findOne({
            _id: { $ne: res.locals.user.id}, //not equal
            email: req.body.email,
            deleted: false
        })
        if (!emailExist) {
            req.body.password = md5(req.body.password)
            await Account.updateOne({ _id: res.locals.user.id }, req.body)
            req.flash("success", "Chỉnh sửa tài khoản thành công")
        }else{
            req.flash("error", "Email đã tồn tại")
        }
    } catch (error) {
        req.flash("error", "Chỉnh sửa tài khoản thất bại")
    }
    res.redirect(`${systemConfig.prefixAdmin}/my-account`)
    // res.redirect("back")
} 