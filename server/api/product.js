const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const Product = mongoose.model('Product')

exports.findCategoryById = async id => {
    const data = await Category.findOne({ _id: id })
    return data
}
exports.findCategories = async id => {
    const data = await Category.find({})
    return data
}
exports.findProductById = async id => {
    const data = await Product.findOne({
        _id: id
    })

    return data
}
exports.searchByCategroy = async catId => {
    const data = await Category.find({
        _id: catId
    }).populate({
        path: 'products',
        select: '_id title poster',
        options: { limit: 8 }
    })

    return data
}
exports.searchByKeyword = async q => {
    const data = await Product.find({
        $or: [
            { color: new RegExp(q + '.*', 'i') },
            { styleNumber: { $regex: q } }
        ]
    })

    return data
}
