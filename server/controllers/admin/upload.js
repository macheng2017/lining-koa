const mongoose = require('mongoose')
const Media = mongoose.model('Media')
const Product = mongoose.model('Product')
// const path = require('path')
const fs = require('fs')
// const Busboy = require('busboy')
const qiniu = require('qiniu')
const qiniuConfig = require('../../config').qiniu
// const Category = mongoose.model('Category')
// const _ = require('lodash')
const { readFile, writeFile } = require('fs')
const { resolve } = require('path')
const util = require('util')

// const R = require('ramda')
const readFileAsync = util.promisify(readFile)
const writeFileAsync = util.promisify(writeFile)
const UUIDV1 = require('uuid/v1')
const dirExists = require('../../libs/utils').dirExists
const getStat = require('../../libs/utils').getStat
// const multer = require('koa-multer')
// 定义上传文件存储的路径
const dir = '../../../public/upload/img'

// 批量上传产品图片

exports.show = async (ctx, next) => {
    await ctx.render('pages/upload')
}

exports.uploadImg = async (ctx, next) => {
    try {
        // 1.先存到本地作为缓存
        const fileArr = await uploadLocal(ctx)
        // 2. 上传到七牛
        // let qiniuData = []
        // for (let index = 0; index < fileArr.length; index++) {
        //     const element = fileArr[index]

        //     console.log(element.fileName)
        //     console.log(element.imgPath)
        //     const qiniu = await upToQiniu(element.path, element.uuidName)
        //     qiniuData.push({
        //         imgPath: qiniu.key,
        //         fileName: element.fileName,
        //         localFilePath: element.path
        //     })
        // }
        // 3. 将返回的数据存入数据库中
        // console.log('------------------------')
        // console.log(fileArr)
        // 将图片存入数据库中
        await saveFile(fileArr)
    } catch (error) {
        console.log(error)
    }
    ctx.redirect('/admin/product/list')
    // console.log(qiniuData)
    // 4. 删除本地缓存的图片
    // for (let index = 0; index < fileArr.length; index++) {
    //     const element = fileArr[index]
    //     await removeTemImage(element.path)
    // }
}
// 更新图片链接,excel表格被删除时图片还在,更新即可
exports.updateImg = async (ctx, next) => {
    try {
        const imgData = (await Media.find({})) || []
        for (let index = 0; index < imgData.length; index++) {
            const imgDataItem = imgData[index]
            if (imgDataItem.fileName) {
                await Product.update(
                    { styleNumber: imgDataItem.fileName },
                    { img: imgDataItem.img }
                )
            }
        }
        // 根据鞋的款号查找出,相同款号鞋的id,并重复更新动作
        // 查询出重复款号的json数据
        const group = { firstField: '$styleNumber' }
        const duplicateData = await Product.aggregate()
            .group({
                _id: group,
                uniqueIds: { $addToSet: '$_id' },
                count: { $sum: 1 }
            })
            .match({ count: { $gt: 1 } })
        // console.log('duplicateData-----------------------')
        // console.log(duplicateData)
        // 根据重复款号的json数据再更新一遍图片
        if (duplicateData) {
            for (let index = 0; index < duplicateData.length; index++) {
                const duplicateItem = duplicateData[index]
                for (let i = 0; i < imgData.length; i++) {
                    const imgDataItem = imgData[i]
                    if (imgDataItem.fileName === duplicateItem._id.firstField) {
                        // await Product.update(
                        //     duplicateItem.uniqueIds,
                        //     {
                        //         $set: { img: imgDataItem.img }
                        //     }
                        // )
                        duplicateItem.uniqueIds.forEach(async id => {
                            await Product.update(
                                { _id: id },
                                { img: imgDataItem.img }
                            )
                        })
                    }
                }
            }
        }
        ctx.redirect('/admin/product/list')
    } catch (error) {
        console.log(error)
    }
}

// 将七牛云返回的数据存入数据库当中
const saveFile = async imgData => {
    try {
        for (let index = 0; index < imgData.length; index++) {
            const imgDataItem = imgData[index]
            // console.log('==========================')
            // console.log(element)
            // 将数据插入到Product表中
            if (imgDataItem.fileName) {
                // const data = await Product.aggregate([
                //     { $group: { _id: '$styleNumber', count: { $sum: 1 } } },
                //     { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
                //     { $project: { styleNumber: '$_id', _id: 0 } }
                // ])
                // 先根据产品款号,更新一遍产品图片
                await Product.updateOne(
                    { styleNumber: imgDataItem.fileName },
                    { img: imgDataItem.img }
                )
            }
            // 再更新媒体表中的图片数据
            // 先查询出是否已经存在相应的款号的图片文件
            // 如果存在则更新,如果不存在则保存
            const findImgItem = await Media.findOne({
                fileName: imgDataItem.fileName
            })
            if (findImgItem) {
                // 先删除本地重复的图片
                let path = resolve(__dirname, `${dir}/${findImgItem.img}`)
                await removeTemImage(path)
                await Media.updateOne(
                    { fileName: imgDataItem.fileName },
                    { img: imgDataItem.img }
                )
            } else {
                const media = new Media(imgDataItem)
                media.save()
            }
        }
        // 根据鞋的款号查找出,相同款号鞋的id,并重复更新动作
        // 查询出重复款号的json数据
        const group = { firstField: '$styleNumber' }
        const duplicateData = await Product.aggregate()
            .group({
                _id: group,
                uniqueIds: { $addToSet: '$_id' },
                count: { $sum: 1 }
            })
            .match({ count: { $gt: 1 } })
        // console.log('duplicateData-----------------------')
        // console.log(duplicateData)
        // 根据重复款号的json数据再更新一遍图片
        if (duplicateData) {
            for (let index = 0; index < duplicateData.length; index++) {
                const duplicateItem = duplicateData[index]
                for (let i = 0; i < imgData.length; i++) {
                    const imgDataItem = imgData[i]
                    if (imgDataItem.fileName === duplicateItem._id.firstField) {
                        // await Product.update(
                        //     duplicateItem.uniqueIds,
                        //     {
                        //         $set: { img: imgDataItem.img }
                        //     }
                        // )
                        duplicateItem.uniqueIds.forEach(async id => {
                            await Product.update(
                                { _id: id },
                                { img: imgDataItem.img }
                            )
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

const uploadLocal = async ctx => {
    let files = ctx.request.body.files.imgFile
    // console.log('------------files-----------')
    // console.log(Array.isArray(files))
    // console.log(files)
    // 上传文件的时候有两种情况
    // 1. 单文件 获取到的files是一个 对象
    // 2. 多文件 获取到的files是一个 数组
    // 在读取前需要先判断下,如果不是数组则封装成数组
    if (!Array.isArray(files)) {
        files = [files]
    }
    let fileArr = []

    // 先判断下这个文件夹是否存在,如果不存在则创建一个
    console.log('----------dir------')
    console.log(dir)
    await dirExists(dir)
    for (let index = 0; index < files.length; index++) {
        const fileData = files[index]
        // console.log('--------------fileData----------------')
        // console.log(fileData)
        const filePath = fileData.path
        const fileName = fileData.name
        // 这里可以再优化下
        const ext = fileName.split('.')[fileName.split('.').length - 1]
        if (fileName) {
            const metaData = await readFileAsync(filePath)
            // tiemstamp 再多文件上传的时候有些问题, 如果计算机性能好一点就会时间相同
            // const timestamp = Date.now()
            const uuid = UUIDV1()
            // const type = fileData.type.split('/')[1]
            //   // console.log(fileData)
            //   // console.log(fileData.type)
            const uuidName = uuid + '.' + ext

            const newPath = resolve(__dirname, dir) + '/' + uuidName

            await writeFileAsync(newPath, metaData)
            //       // console.log(newPath)
            fileArr.push({
                img: uuidName,
                fileName: fileName.split('.')[0],
                ext: ext,
                allPath: newPath
            })
        }
    }
    console.log(fileArr)
    return fileArr
}
// // 写入目录
// const mkdirsSync = dirname => {
//     if (fs.existsSync(dirname)) {
//         return true
//     } else {
//         if (mkdirsSync(path.dirname(dirname))) {
//             fs.mkdirSync(dirname)
//             return true
//         }
//     }
//     return false
// }

// function getSuffix (fileName) {
//     return fileName.split('.').pop()
// }

// // 重命名
// function Rename (fileName) {
//     return (
//         Math.random()
//             .toString(16)
//             .substr(2) +
//         '.' +
//         getSuffix(fileName)
//     )
// }
// 删除文件
async function removeTemImage (path) {
    // 如果文件不存在则不删
    if (await getStat(path)) {
        fs.unlink(path, err => {
            if (err) {
                throw err
            }
            // console.log(`${path} was deleted`)
        })
    }
}
// 上传到七牛
function upToQiniu (filePath, key) {
    const accessKey = qiniuConfig.AK // 你的七牛的accessKey
    const secretKey = qiniuConfig.SK // 你的七牛的secretKey
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

    const options = {
        scope: qiniuConfig.scope // 你的七牛存储对象
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)

    const config = new qiniu.conf.Config()
    // 空间对应的机房 Zone_z0 是默认机房
    // config.zone = qiniu.zone.Zone_z0
    const localFile = filePath
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    // 文件上传
    return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, key, localFile, putExtra, function (
            respErr,
            respBody,
            respInfo
        ) {
            if (respErr) {
                reject(respErr)
            }
            if (respInfo.statusCode === 200) {
                resolve(respBody)
            } else {
                resolve(respBody)
            }
        })
    })
}

// // 上传到本地服务器
// function uploadFile (ctx, options) {
//     const _emmiter = new Busboy({ headers: ctx.req.headers })
//     const fileType = options.fileType
//     const filePath = path.join(options.path, fileType)
//     const confirm = mkdirsSync(filePath)
//     if (!confirm) {
//         return
//     }
//     console.log('start uploading...')
//     return new Promise((resolve, reject) => {
//         _emmiter.on('file', function (
//             fieldname,
//             file,
//             filename,
//             encoding,
//             mimetype
//         ) {
//             const fileName = Rename(filename)
//             const saveTo = path.join(path.join(filePath, fileName))
//             file.pipe(fs.createWriteStream(saveTo))
//             file.on('end', function () {
//                 resolve({
//                     imgPath: `/${fileType}/${fileName}`,
//                     imgKey: fileName
//                 })
//             })
//         })

//         _emmiter.on('finish', function () {
//             console.log('finished...')
//         })

//         _emmiter.on('error', function (err) {
//             console.log('err...')
//             reject(err)
//         })
//         ctx.req.pipe(_emmiter)
//     })
// }
