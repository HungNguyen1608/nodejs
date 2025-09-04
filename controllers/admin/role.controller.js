const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find)
    res.render("admin/pages/role/index", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Thêm mới quyền",
    })
}


// [GET] /admin/roles/create
module.exports.save = async (req, res) => {
    const record = new Role(req.body)
    await record.save()
    req.flash("success", "Thêm mới thành công")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)

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

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find)

    res.render("admin/pages/role/permission", {
        pageTitle: "Phân quyền",
        records: records
    })

}

// [PATCH] /admin/roles/permissions
module.exports.updatePermission = async (req, res) => {
    try{
         const permissions = JSON.parse(req.body.permissions)

        console.log(permissions)

        for( const item of permissions){
            await Role.updateOne({_id: item.id}, { permissions: item.permissions})
        }
        req.flash("success", "Cập nhật phân quyền thành công")

    }catch(e){
        req.flash("error", "Cập nhật phân quyền thất bại")

    }
   
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`)

}




