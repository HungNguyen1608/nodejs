module.exports.price = (product) => {
    const newProducts = product.map(item => {
        item.priceNew = ((item.price*(100-item.discountPercentage))/100).toFixed(2)
        return item
    })
    return newProducts
}
module.exports.priceNew = (product) => {
    const newProducts = product => {
        product.priceNew = ((product.price*(100-product.discountPercentage))/100).toFixed(2)
        return product
    }
    return newProducts
}