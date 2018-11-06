// const xlsx = require('node-xlsx')
// const R = require('ramda')
// const { readFile, writeFile } = require('fs')
// const { resolve } = require('path')
// const util = require('util')

// const readFileAsync = util.promisify(readFile)
// const writeFileAsync = util.promisify(writeFile)

// module.exports = async (ctx, next) => {
//     const excelData = ctx.request.body.files.xlsxfile
//     const filePath = excelData.path
//     const fileName = excelData.name
//     if (fileName) {
//         const data = await readFileAsync(filePath)
//         const timestamp = Date.now()
//         const type = excelData.type.split('/')[1]
//         const poster = timestamp + '.' + type
//         const newPath = resolve(__dirname, '../../../../../', 'public/upload/' + poster)

//         await writeFileAsync(newPath, data)
//         console.log(newPath)
//         ctx.poster = poster
//     }

    // await next()
    // console.log(ctx.request)
    // const metafile = ctx.request.files
    // // if (!metafile) {
    // //     return ctx.request.status(400).send('No files were uploaded.')
    // // }
    // console.log('===================metafile===================')
    // console.log(metafile)
    // console.log('start upload file')

    // const file = ctx.request.body.files.abc  // 传输文件的name是abc
    // console.log(ctx.request.body)
    // const tmpath = file['path']
    // const tmparr = file['name'].split('.')
    // const ext = '.' + tmparr[tmparr.length - 1]
    // const newpath = path.join('./', parseInt(Math.random() * 100) + Date.parse(new Date()).toString() + ext)
    // console.log(tmpath)
    // console.log(newpath)
    // const stream = fs.createWriteStream(newpath)// 创建一个可写流
    // fs.createReadStream(tmpath).pipe(stream)// 可读流通过管道写入可写流
    // const reader = fs.createReadStream(metafile.WriteStream)
    // const stream = fs.createWriteStream(
    //     path.join(os.tmpdir(), Math.random().toString())
    // )
    // reader.pipe(stream)
    // console.log('uploading %s -> %s', metafile.name, stream.path)
    // try {
    //     const file = metafile.xlsxfile
    //     console.log('-----------------xlsxfile--------------------------')
    //     console.log(file)
    //     const filedata = fs.createReadStream(metafile.path)
    //     const workSheets = xlsx.parse(filedata)
    //     console.log(workSheets)
    //     let xlsxdata = workSheets[0].data
    //     let props = xlsxdata[0]
    //     console.log(props)
    //     xlsxdata = R.drop(1, xlsxdata)
    //     console.log(xlsxdata)
    //     let data = []
    //     // drop image field out of excel
    //     props = R.drop(1, props)
    //     xlsxdata.forEach(item => {
    //         item = R.drop(1, item)
    //         data.push(R.zipObj(props, item))
    //     })

    //     console.log(data)
    // const Shop = Parse.Object.extend('Shop')

    // const query = new Parse.Query(Shop)

    // const results = await query.find()
    // // console.log('results');
    // // console.log(results);
    // console.log('total data ')
    // console.log(results.length)
    // for (let i = 0; i < results.length; i++) {
    //     await results[i].destroy()
    // }
    // // for (let i = 0; i < data.length; i++) {
    // try {
    //     let item = JSON.stringify(data[1])
    //     // let item = data[1];
    //     // console.log(item);
    //     let shop = new Shop(item)
    //     // shop.set('name','test')
    //     const ll = await shop.save()
    //     console.log(ll)
    // } catch (error) {
    //     console.log(error)
    // }
    // } catch (err) {
    //     console.log(err)
    //     // next(err)
    // }
    // next()
}

// // 接收上传的excel文件，保存解析返回objects
// const xlsx = require('xlsx')
// const fs = require('fs')
// const path = require('path')
// const downPath = path.resolve(__dirname, '../fileUpload')

// module.exports = async (ctx, next) => {
//     const file = ctx.request.files // 获取上传文件
//     console.log(file)
//     const reader = fs.createReadStream(file.path) // 创建可读流
//     const ext = file.name.split('.').pop() // 获取上传文件扩展名
//     const filePath = `${downPath}/${Math.random().toString()}.${ext}`

//     const upStream = fs.createWriteStream(filePath) // 创建可写流
//     const getRes = await getFile(reader, upStream) // 等待数据存储完成

//     const datas = [] // 可能存在多个sheet的情况
//     if (!getRes) { // 没有问题
//         const workbook = xlsx.readFile(filePath)
//         const sheetNames = workbook.SheetNames // 返回 ['sheet1', ...]
//         for (const sheetName of sheetNames) {
//             const worksheet = workbook.Sheets[sheetName]
//             const data = xlsx.utils.sheet_to_json(worksheet)
//             datas.push(data)
//             console.log(datas)
//             ctx.body.exceldatas = {
//                 'datas': datas,
//                 code: 0
//             }
//         }
//     } else {
//         ctx.body.exceldatas = {
//             code: -1
//         }
//     }
//     next()
// }
// function getFile (reader, upStream) {
//     return new Promise((resolve, reject) => {
//         let stream = reader.pipe(upStream) // 可读流通过管道写入可写流
//         stream.on('finish', function (err) {
//             reject(err)
//         })
//     })
// }
