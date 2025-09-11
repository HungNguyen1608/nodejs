module.exports.save = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email");
        res.redirect(`/user/regiter`);
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu");
        res.redirect(`/user/register`);
        return;
    }
    next(); 
};
module.exports.resetPasswordPost = async (req, res, next) => {
    if(!req.body.password){
        req.flash("error","Vui lòng nhập mật khẩu")
        res.redirect(req.get('Referrer') || '/')
        return
    }

    if(!req.body.confirmPassword){
        req.flash("error","Vui lòng nhập xác nhận mật khẩu")
        res.redirect(req.get('Referrer') || '/')
        return
    }

    if(req.body.password != req.body.confirmPassword){
        req.flash("error","Mật khẩu không khớp")
        res.redirect(req.get('Referrer') || '/')
        return
    }

    next()
}

