const User = require("../../models/user.model")
const md5 = require("md5")

//[GET] /user/register
module.exports.register = async (req, res) => {
    res.render('clients/pages/user/register',{
        pageTitle: "Trang đăng ký tài khoản",
    })
}

//[POST] /user/register
module.exports.save = async (req, res) => {
    const emailExist = await User.findOne({
        email: req.body.email,
        deleted: false
    })
    if (!emailExist) {
        req.body.password = md5(req.body.password)
        const record = new User(req.body)
        await record.save()
        req.flash("success", "Thêm mới thành công")
        res.cookie("tokenUser", User.tokenUser)
        res.send("ok")
    } else {
        req.flash("error", "Email đã tồn tại")
        res.redirect(req.get('Referrer') || '/');
    }
}

//[GET] /user/login
module.exports.login = async (req, res) => {
    res.render('clients/pages/user/login',{
        pageTitle: "Trang đăng nhập",
    })
}

//[POST] /user/login
module.exports.postLogin = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect(`/user/login`)
        return
    }
    if(md5(password) != user.password){
        req.flash("error","Sai mật khẩu")
        res.redirect(`/user/login`)
        return
    }
    if(user.status != "active")
    {
        req.flash("error","Tài khoản đã bị khoá")
        res.redirect(`/user/login`)
        return
    }
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("/")
}
