// 0. 商品Model的创建
// 1. 商品录入页面
// 2. 商品的创建持久化
// 3. 商品的后台列表
// 4. 对应分类的路由规则
// 5. 对应的分类页面
const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const Media = mongoose.model('Media')
const Category = mongoose.model('Category')
const _ = require('lodash')
const { readFile, writeFile } = require('fs')
const { resolve } = require('path')
const util = require('util')
const xlsx = require('node-xlsx')
const R = require('ramda')
const api = require('../../api')

const readFileAsync = util.promisify(readFile)
const writeFileAsync = util.promisify(writeFile)

// 1. 商品录入页面
exports.show = async (ctx, next) => {
    const { _id } = ctx.params
    let product = {}

    if (_id) {
        product = await api.product.findProductById(_id)
    }

    let categories = await api.product.findCategories()

    await ctx.render('pages/product_admin', {
        title: '后台分类录入页面',
        product,
        categories
    })
}
const update = async (ctx, next) => {
    let productData = ctx.request.body.fields || {}
    let product

    if (productData._id) {
        product = await api.product.findProductById(productData._id)
    }

    if (ctx.poster) {
        productData.poster = ctx.poster
    }

    const categoryId = productData.categoryId
    const categoryName = productData.categoryName
    let category

    if (categoryId) {
        category = await api.product.findCategoryById(categoryId)
    } else if (categoryName) {
        category = new Category({ name: categoryName })

        await category.save()
    }

    if (product) {
        product = _.extend(product, productData)
        product.category = category._id
    } else {
        delete productData._id

        productData.category = category._id
        product = new Product(productData)
    }

    category = await api.product.findCategoryById(category._id)

    if (category) {
        category.products = category.products || []
        category.products.push(product._id)

        await category.save()
    }

    await product.save()

    ctx.redirect('/admin/product/list')
}

// 2. 商品的创建持久化
exports.new = async (ctx, next) => {
    try {
        // let productData = ctx.request.body.fields || {}
        // productData 包含两部分
        // 1. 表单数据
        // 2. 上传文件数据
        const productData = ctx.request.body.fields || {}
        let excelData
        if (ctx.excel) {
            excelData = ctx.excel.excelData
        } else {
            await update(ctx, next)
            return
        }
        console.log('excelData-------------------')
        // console.log(excelData)
        const categoryId = productData.categoryId
        const categoryName = productData.categoryName
        let category
        // console.log('---------productData---------')
        // console.log(productData)
        if (categoryId) {
            category = await api.product.findCategoryById(categoryId)
        } else if (categoryName) {
            category = new Category({ name: categoryName })
            await category.save()
        }

        // 如果上传的是excel 则把插入数据前先全部删除
        if (excelData) {
            // const products = await Product.find({})
            // 删除属于同一类的商品,这样速度会更快些
            // console.log('=========================')
            // console.log(category._id)

            await Product.deleteMany({
                category: category._id
            })
            // for (let index = 0; index < products.length; index++) {
            //     const item = products[index]._id
            //     await Product.remove({ _id: item })
            // }

            category = await api.product.findCategoryById(category._id)
            // 删除对应分类中的数据
            const productsInCat = category.products
            productsInCat.splice(0, productsInCat.length)
            // productsInCat.length = 0

            await category.save()
        }
        // console.log('---------category._id---------')
        // console.log(category)
        // console.log(category._id)
        // console.log('---------category._id---------')

        // let productData = {}
        // let product

        // console.log(excelData)

        // if (!excelData || excelData.length < 0) {
        //     ctx.redirect('/admin/product')
        // }

        // for (let index = 0; index < excelData.length; index++) {
        //     let productData = excelData[index]
        //     let product
        //     // // console.log(productData)
        //     // if (productData._id) {
        //     //     product = await Product.findOne({ _id: productData._id })
        //     // }

        //     // if (product) {
        //     //     product = _.extend(product, productData)
        //     // } else {
        //     // 防止冲突 删掉productData._id
        //     // delete productData._id
        //     productData.category = category._id
        //     product = new Product(productData)
        //     // }
        //     // 向分类表中添加product_id
        //     if (category) {
        //         category.products = category.products || []
        //         category.products.push(product._id)

        //         await category.save()
        //     }

        //     await product.save()
        // }

        // 向数组中的每个元素插入一个属性 category
        let productSaveData = []
        excelData.map(v => {
            productSaveData.push(
                Object.assign({}, v, { category: category.id })
            )
        })

        const docs = await Product.insertMany(productSaveData)

        if (category) {
            category.products = category.products || []
            category.products = R.concat(
                category.products,
                R.values(docs.insertedIds)
            )

            await category.save()
        }
    } catch (error) {
        throw new Error(error)
    }
    ctx.redirect('/admin/product/list')
}
// 3. 商品的后台列表
exports.list = async (ctx, next) => {
    const { p } = ctx.query
    const page = parseInt(p, 10) || 0
    const count = 30
    const index = page * count
    let products = await Product.find({})
    // 在查询商品的时候,把图片从midea表中查询出来,添加进去
    // products.forEach(async element => {
    //     const imgData = await Media.findOne({ fileName: element.styleNumber })
    //     element.img = imgData.imgPath || ''
    // })
    // for (let index = 0; index < products.length; index++) {
    //     const element = products[index]

    // }
    let results = products.slice(index, index + count)
    await ctx.render('pages/product_list', {
        title: '商品列表页面',
        currentPage: page + 1,
        totalPage: Math.ceil(products.length / count),
        products: results
    })
}

// 4. 对应分类的路由规则
// 5. 对应的分类页面
exports.del = async (ctx, next) => {
    // console.log('-----------del-------------------')
    const id = ctx.query.id
    const cat = await Category.findOne({
        products: {
            $in: [id]
        }
    })

    if (cat && cat.products.length) {
        const index = cat.products.indexOf(id)
        cat.products.splice(index, 1)
        await cat.save()
    }

    try {
        await Product.remove({ _id: id })
        ctx.body = { success: true }
    } catch (err) {
        ctx.body = { success: false }
    }
}

// 搜索功能
exports.search = async (ctx, next) => {
    const { cat, q, p } = ctx.query
    const page = parseInt(p, 10) || 0
    const count = 30
    const index = page * count

    if (cat) {
        const categories = await api.product.searchByCategroy(cat)
        const category = categories[0]
        let products = category.products || []
        let results = products.slice(index, index + count)

        await ctx.render('pages/results', {
            title: '分类搜索结果页面',
            keyword: category.name,
            currentPage: page + 1,
            query: 'cat=' + cat,
            totalPage: Math.ceil(products.length / count),
            products: results
        })
    } else {
        let products = await api.product.searchByKeyword(q.toUpperCase())
        let results = products.slice(index, index + count)
        await ctx.render('pages/results', {
            title: '关键词搜索结果页面',
            keyword: q,
            currentPage: page + 1,
            query: 'q=' + q,
            totalPage: Math.ceil(products.length / count),
            products: results
        })
    }
}
// 解析excel文件的中间件
exports.excelparser = async (ctx, next) => {
    console.log(
        '开始进入excel中间件----------------------------------------------'
    )
    const excelData = ctx.request.body.files.xlsxfile
    // console.log(excelData)
    // 如果上传数据中没有xlsxfile这个标识,那么就是纯表单提交,则不使用这个中间件
    if (excelData === undefined) {
        console.log('-----------excelData no data in----------')
        await next()
        console.log('---------excelData no data out------------')
        // 还记得洋葱圈模型吗? 一进一出
        return
    }
    const filePath = excelData.path
    const fileName = excelData.name

    if (fileName) {
        const metaData = await readFileAsync(filePath)
        const timestamp = Date.now()
        const type = excelData.type.split('/')[1]
        // console.log(excelData)
        // console.log(excelData.type)
        const excel = timestamp + '.' + type
        const newPath = resolve(
            __dirname,
            '../../../',
            'public/upload/excel/' + excel
        )

        await writeFileAsync(newPath, metaData)
        // console.log(newPath)

        // console.log(req);
        // if (!ctx.request.files.) {
        //     return res.status(400).send('No files were uploaded.')
        // }
        console.log('start upload file')
        // try {

        const workSheets = xlsx.parse(newPath)
        // console.log(workSheets);
        let xlsxdata = workSheets[0].data
        // let props = xlsxdata[0]
        // 为了让excel表格脱离 字段对应数据,这样保证excel表格中的数据顺序(中文字段)正确即可
        let props = [
            'img',
            'styleNumber',
            'count',
            'color',
            'sex',
            'season',
            'size',
            'cardPrice',
            'taobaoPrice',
            'usSize',
            'comment'
        ]
        // console.log(xlsxdata)
        // console.log(props)
        xlsxdata = R.drop(1, xlsxdata)
        // console.log(xlsxdata)
        let data = []
        // drop image field out of excel
        props = R.drop(1, props)
        xlsxdata.forEach(item => {
            // 1. 取到原始数据中颜色的字段
            // 2. 进行第一次拆分,先拆分出带有斜杠的
            // 3. 再以空格进行第二次拆分
            // 4. 得到拆分后的数据存入
            item = R.drop(1, item)
            data.push(R.zipObj(props, item))
        })
        // R.compose(

        // )
        data = data.map(v => {
            // console.log(v.color)
            let str
            if (v.color === undefined || v.color === null) {
                str = [' ']
            } else {
                str = v.color.split('/')
            }
            return Object.assign(
                {},
                {
                    styleNumber: v.styleNumber,
                    style: str[str.length - 1],
                    count: v.count,
                    color: v.color,
                    sex: v.sex,
                    season: v.season,
                    size: v.size,
                    cardPrice: v.cardPrice,
                    taobaoPrice: v.taobaoPrice,
                    usSize: v.usSize,
                    comment: v.comment
                }
            )
        })

        // data = data.map(v => {
        //     // 奇怪用这种方式却不用将data值赋值给data
        //     // v.color = v.color + 'hahhah'
        // })
        // console.log(data)

        //     const query = new Parse.Query(Shop)

        //     const results = await query.find()
        // // console.log('results');
        // // console.log(results);
        //     console.log('total data ')
        //     console.log(results.length)
        //     for (let i = 0; i < results.length; i++) {
        //         await results[i].destroy()
        //     }

        // // for (let i = 0; i < data.length; i++) {
        //     try {
        //         let item = JSON.stringify(data[1])
        //   // let item = data[1];
        //   // console.log(item);
        //         let shop = new Shop(item)
        //   // shop.set('name','test')

        //         const ll = await shop.save()
        //         console.log(ll)
        //     } catch (error) {
        //         console.log(error)
        //     }
        // // }

        //     res.send('success')
        // } catch (err) {
        //     next(err)
        // }

        ctx.excel = {
            code: 0,
            excelPath: newPath,
            excelData: data,
            excelName: excel
        }
    }
    await next()
}
