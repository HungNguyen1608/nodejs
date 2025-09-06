const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")

module.exports.category = async (req,res,next) => {
    const find = {
        deleted: false
    }
    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.createTree(records)
    res.locals.layoutCategory = newRecords
    next();
}