// const Role = require("../../models/role.model")
const Account = require("../../models/account.model")
const md5 = require("md5")
const systemConfig = require("../../config/system")

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }else{
        res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập",
    })
    }
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body
    const user = await Account.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        return
    }
    if(md5(password) != user.password){
        req.flash("error","Sai mật khẩu")
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        return
    }
    if(user.status != "active")
    {
        req.flash("error","Tài khoản đã bị khoá")
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        return
    }
    res.cookie("token",user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)

}


// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)

}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        let find = {
            _id: id,
            deleted: false
        }
        const data = await Role.findOne(find)
        res.render("admin/pages/role/edit", {
            pageTitle: "Sửa quyền",
            data: data
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }

}

// [PATCH] /admin/roles/edit/:id
module.exports.update = async (req, res) => {
    try {
        await Role.updateOne({_id:req.params.id},req.body)
        req.flash("success","Chỉnh sủa quyền thành công")
    } catch (error) {
        req.flash("error","Chỉnh sủa quyền thất bại")
    }
    // res.redirect(`${systemConfig.prefixAdmin}/roles`)
    res.redirect("back")
}



