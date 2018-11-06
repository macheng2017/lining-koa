// 0. 商品Model的创建
// 1. 商品录入页面
// 2. 商品的创建持久化
// 3. 商品的后台列表
// 4. 对应分类的路由规则
// 5. 对应的分类页面
const mongoose = require('mongoose')
const SlideShow = mongoose.model('SlideShow')
const _ = require('lodash')
const { readFile, writeFile } = require('fs')
const { resolve } = require('path')
const util = require('util')

const api = require('../../api')

const readFileAsync = util.promisify(readFile)
const writeFileAsync = util.promisify(writeFile)

// 1. 商品录入页面
exports.show = async (ctx, next) => {
    const { _id } = ctx.params
    let slideShow = {}

    if (_id) {
        slideShow = await api.slideShow.findSlideShowById(_id)
    }
    await ctx.render('pages/slideShow_admin', {
        title: '后台轮播图页面',
        slideShow
    })
}
const update = async (ctx, next) => {
    let SlideShowData = ctx.request.body.fields || {}
    let SlideShow

    if (SlideShowData._id) {
        SlideShow = await api.SlideShow.findSlideShowById(SlideShowData._id)
    }

    if (ctx.poster) {
        SlideShowData.poster = ctx.poster
    }

    const categoryId = SlideShowData.categoryId
    const categoryName = SlideShowData.categoryName
    let category

    if (categoryId) {
        category = await api.SlideShow.findCategoryById(categoryId)
    } else if (categoryName) {
        category = new Category({ name: categoryName })

        await category.save()
    }

    if (SlideShow) {
        SlideShow = _.extend(SlideShow, SlideShowData)
        SlideShow.category = category._id
    } else {
        delete SlideShowData._id

        SlideShowData.category = category._id
        SlideShow = new SlideShow(SlideShowData)
    }

    category = await api.SlideShow.findCategoryById(category._id)

    if (category) {
        category.SlideShows = category.SlideShows || []
        category.SlideShows.push(SlideShow._id)

        await category.save()
    }

    await SlideShow.save()

    ctx.redirect('/admin/SlideShow/list')
}

// 2. 商品的创建持久化
exports.new = async (ctx, next) => {
    // let SlideShowData = ctx.request.body.fields || {}
    // SlideShowData 包含两部分
    // 1. 表单数据
    // 2. 上传文件数据
    const slideShowData = ctx.request.body.fields || {}
    let imgData
    if (ctx.img) {
        imgData = ctx.img.imgData
    } else {
        await update(ctx, next)
        return
    }
    console.log('imgData-------------------')
    console.log(imgData)
    const slideShow = new SlideShow({
        img: imgData.imgName,
        title: slideShowData.title,
        url: slideShowData.url,
        ext: imgData.ext
    })
    await slideShow.save()
    ctx.redirect('/admin/SlideShow/list')
}
// 3. 商品的后台列表
exports.list = async (ctx, next) => {
    let slideShows = await SlideShow.find({})

    await ctx.render('pages/slideShow_list', {
        title: '轮播图列表页面',
        slideShows: slideShows
    })
}

// 4. 对应分类的路由规则
// 5. 对应的分类页面
exports.del = async (ctx, next) => {
    // console.log('-----------del-------------------')
    const id = ctx.query.id
    // const cat = await Category.findOne({
    //     SlideShows: {
    //         $in: [id]
    //     }
    // })

    // if (cat && cat.SlideShows.length) {
    //     const index = cat.SlideShows.indexOf(id)
    //     cat.SlideShows.splice(index, 1)
    //     await cat.save()
    // }

    try {
        await SlideShow.remove({ _id: id })
        ctx.body = { success: true }
    } catch (err) {
        ctx.body = { success: false }
    }
}

// 处理表单中图片文件的中间件
exports.imgProcess = async (ctx, next) => {
    console.log(
        '开始进入img中间件----------------------------------------------'
    )
    const imgData = ctx.request.body.files.imgFile
    // console.log(imgData)
    // 如果上传数据中没有xlsxfile这个标识,那么就是纯表单提交,则不使用这个中间件
    if (imgData === undefined) {
        console.log('-----------imgData no data in----------')
        await next()
        console.log('---------imgData no data out------------')
        // 还记得洋葱圈模型吗? 一进一出
        return
    }
    const filePath = imgData.path
    const fileName = imgData.name

    if (fileName) {
        const metaData = await readFileAsync(filePath)
        const timestamp = Date.now()
        const type = imgData.type.split('/')[1]
        // console.log(imgData)
        // console.log(imgData.type)
        const img = timestamp + '.' + type
        const newPath = resolve(
            __dirname,
            '../../../',
            'public/img/' + img
        )

        await writeFileAsync(newPath, metaData)

        ctx.img = {
            code: 0,
            imgData: {
                imgPath: newPath,
                imgName: img,
                ext: type
            }
        }
    }
    await next()
}
