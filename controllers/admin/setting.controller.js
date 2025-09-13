const Setting = require("../../models/setting.model")

//[GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const setting = await Setting.findOne({}) || {}

    res.render("admin/pages/setting/general",{
        pageTitle: "Cài đặt chung",
        setting: setting
    })
}

//[PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    const settingExist = await Setting.findOne({}) 

    if(settingExist){
        await Setting.updateOne({_id: settingExist.id},req.body)
    }else{
        const setting = new Setting(req.body)
        await setting.save()
    }

    res.redirect(req.get('Referrer') || '/')
}
