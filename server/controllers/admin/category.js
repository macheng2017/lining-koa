// 0. 商品分类Model的创建
// 1. 商品分类录入页面
// 2. 商品分类的创建持久化
// 3. 商品分类的后台列表
// 4. 对应分类的路由规则
// 5. 对应的分类页面
const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const Product = mongoose.model('Product')
// 1. 商品分类录入页面
exports.show = async (ctx, next) => {
    const { _id } = ctx.params
    let category = {}
    if (_id) {
        category = await Category.findOne({ _id })
    }
    await ctx.render('pages/category_admin', {
        title: '后台分类录入页面',
        category
    })
}
// 2. 商品分类的创建持久化
exports.new = async (ctx, next) => {
    const { name, _id } = ctx.request.body.category
    let category
    if (_id) {
        category = await Category.findOne({ _id })
    }
    if (category) {
        category.name = name
    } else {
        category = new Category({ name })
    }

    await category.save()
    ctx.redirect('/admin/category/list')
}
// 3. 商品分类的后台列表
exports.list = async (ctx, next) => {
    const categories = await Category.find({})
    await ctx.render('pages/category_list', {
        title: '分类列表页面',
        categories
    })
}

// 4. 对应分类的路由规则
// 5. 对应的分类页面
exports.del = async (ctx, next) => {
    const id = ctx.query.id

    try {
        await Category.remove({ _id: id })
        await Product.remove({
            category: id
        })
        ctx.body = { success: true }
    } catch (err) {
        ctx.body = { success: false }
    }
}
