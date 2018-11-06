const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const SlideShow = mongoose.model('SlideShow')

exports.findCategoryById = async id => {
    const data = await Category.findOne({ _id: id })
    return data
}
exports.findCategories = async id => {
    const data = await Category.find({})
    return data
}
exports.findSlideShowById = async id => {
    const data = await SlideShow.findOne({
        _id: id
    })

    return data
}
