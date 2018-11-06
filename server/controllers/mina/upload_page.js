module.exports = async ctx => {
// module.exports = async ctx => {
    // 获取上传之后的结果
    // 具体可以查看：
    // const data = await uploader(ctx.req)
    // ctx.state.data = data

    try {
        // const docs = await query.find()
        console.log('--------------')
        // console.log(docs)

        ctx.render('index', { })
    } catch (err) {
        console.log(err)
    }
}
