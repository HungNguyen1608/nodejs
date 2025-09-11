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