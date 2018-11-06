// 0. 商品Model的创建
// 1. 商品录入页面
// 2. 商品的创建持久化
// 3. 商品的后台列表
// 4. 对应分类的路由规则
// 5. 对应的分类页面
const mongoose = require('mongoose')
const SlideShow = mongoose.model('SlideShow')
// const Category = mongoose.model('Category')

// 3. 商品的后台列表
exports.list = async (ctx, next) => {
    let slideShows
    try {
        slideShows = await SlideShow.find({})

        console.log('minaList-----------------')
        console.log(slideShows)
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
            list: slideShows
        }
    }
}
