const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
const md5 = require("md5")

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token")
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }
    res.render("admin/pages/account/index", {
        pageTitle: "Tài khoản",
        records: records
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const role = await Role.find({
        deleted: false
    })
    res.render("admin/pages/account/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: role
    })
}


// [GET] /admin/accounts/create
module.exports.save = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if (!emailExist) {
        req.body.password = md5(req.body.password)
        const record = new Account(req.body)
        await record.save()
        req.flash("success", "Thêm mới thành công")
    } else {
        req.flash("error", "Email đã tồn tại")
    }
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)

}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        let find = {
            _id: id,
            deleted: false
        }
        const role = await Role.find({
            deleted: false
        })
        const data = await Account.findOne(find)
        res.render("admin/pages/account/edit", {
            pageTitle: "Sửa tài khoản",
            data: data,
            roles:role
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

// [PATCH] /admin/roles/edit/:id
module.exports.update = async (req, res) => {
    try {
        const id = req.params.id
        const emailExist = await Account.findOne({
            _id: { $ne: id}, //not equal
            email: req.body.email,
            deleted: false
        })
        if (!emailExist) {
            req.body.password = md5(req.body.password)
            await Account.updateOne({ _id: req.params.id }, req.body)
            req.flash("success", "Chỉnh sủa tài khoản thành công")
        }else{
            req.flash("error", "Email đã tồn tại")
        }
    } catch (error) {
        req.flash("error", "Chỉnh sửa tài khoản thất bại")
    }
    // res.redirect(`${systemConfig.prefixAdmin}/roles`)
    res.redirect("back")
}





