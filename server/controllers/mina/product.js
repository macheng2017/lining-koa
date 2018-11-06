// 0. 商品Model的创建
// 1. 商品录入页面
// 2. 商品的创建持久化
// 3. 商品的后台列表
// 4. 对应分类的路由规则
// 5. 对应的分类页面
const mongoose = require('mongoose')
const Product = mongoose.model('Product')
// const Category = mongoose.model('Category')

// 3. 商品的后台列表
exports.list = async (ctx, next) => {
    const shoesData = ctx.request.query.shoesData
    const page = ctx.request.query.page
    console.log(shoesData)
    if (!shoesData) {
        ctx.state = { code: -1, data: { msg: '参数错误' } }
        return
    }
    let products
    const { sex, style, size } = JSON.parse(shoesData)
    try {
        // 你都没考虑过如果 searchKey 和 前面的参数都存在只出现搜索结果怎么办?
        // if (searchKey) {
        //     products = await Product.find({
        //         $or: [
        //             { color: { $regex: searchKey } },
        //             { styleNumber: { $regex: searchKey } },
        //             { style: { $regex: searchKey } }
        //         ]
        //     })
        //         .skip(page * 20)
        //         .limit(20)
        // } else {
        products = await Product.find({
            $and: [
                { sex: { $regex: sex } },
                { style: { $regex: style } },
                { size: { $regex: size } }
            ]
        })
            .skip(page * 20)
            .limit(20)
        // }

        console.log('minaList-----------------')
        console.log(products)
    } catch (error) {
        console.log(error)
        ctx.state = {
            code: -1,
            data: {
                msg: error
            }
        }
    }
    ctx.state = {
        code: 0,
        data: {
            list: products
        }
    }
}
