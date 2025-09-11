const User = require("../../models/user.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")
const ForgotPassword = require("../../models/forgot-password.model")
const sendMailHelper = require("../../helpers/sendMail")
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

//[GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render("clients/pages/user/forgot-password")
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect(req.get('Referrer') || '/')
        return
    }
    const otp = generateHelper.generateRandomNumber(8)
    const objectFogotPassword ={
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectFogotPassword)
    forgotPassword.save();
    const html = `Mã OTP xác minh lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn sử dụng trong 3 phút`
    //Nếu tồn tại email thì gửi mã otp
    sendMailHelper.sendMail(email,otp,html)
    res.redirect(`/user/password/otp?email=${email}`)
}

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email
    res.render("clients/pages/user/otp-password",{
        pageTitle: "Nhập mã otp",
        email: email
    })
}

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if(!result){
        req.flash("error","Otp không hợp lệ")
        res.redirect(req.get('Referrer') || '/')
        return
    }
    const user = await User.findOne({
        email: email,
    })

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/user/password/reset")
}
//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("clients/pages/user/reset-password",{
        pageTitle: "Đổi mật khẩu"
    })
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const tokenUser = req.cookies.tokenUser
    const password = req.body.password
    await User.updateOne({
        tokenUser: tokenUser
    },
    {
        password: md5(password)
    })
    req.flash("success","Thay đổi mật khẩu thành công")
    res.redirect("/")
}