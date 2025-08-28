const { prefixAdmin } = require("../config/system");

module.exports.save = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề");
        res.redirect(`${prefixAdmin}/products-category/create`);
        return;
    }
    next(); 
};

module.exports.update = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề");
        res.redirect(`${prefixAdmin}/products-category/create`);
        return;
    }
    next(); 
};
