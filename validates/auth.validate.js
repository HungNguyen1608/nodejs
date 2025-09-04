const { prefixAdmin } = require("../config/system");

module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email");
        res.redirect(`${prefixAdmin}/auth/login`);
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu");
        res.redirect(`${prefixAdmin}/auth/login`);
        return;
    }
    next(); 
};