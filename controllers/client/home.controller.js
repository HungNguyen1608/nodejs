//[GET]
module.exports.index = async (req, res) => {
    
    res.render('clients/pages/home/index',{
        pageTitle: "Trang chủ",
    })
}