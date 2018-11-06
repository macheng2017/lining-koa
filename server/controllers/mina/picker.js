
const mongoose = require('mongoose')
const Product = mongoose.model('Product')
// const Category = mongoose.model('Category')

// 获取小程序picker数据
exports.list = async (ctx, next) => {
    let products
    try {
        products = await Product.find({}, {color: 1})

        console.log('minaList-----------------')
        console.log(products)
    } catch (error) {
        console.log(error)
    }
    // await ctx.render('pages/product_list', {
    //     title: '分类列表页面',
    //     products
    // })
    ctx.state = {
        code: 0,
        data: {
            list: products
        }
    }
}
