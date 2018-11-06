const Koa = require('koa')
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const moment = require('moment')
const Router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const mongoose = require('mongoose')
const config = require('./config')
const { resolve } = require('path')
const { initSchemas, connect } = require('./database/mongodb/init')
// const path = require('path')

// 加载模板引擎
// app.use(views(path.join(__dirname, './views'), {
//     extension: 'ejs'
// }))
// Must be used before any router is used
;(async () => {
    await connect(config.mongodbURL)

    initSchemas()
    // 生成服务器实例
    const app = new Koa()
    const router = new Router()
    const views = require('koa-views')
    app.use(
        views(resolve(__dirname, './views'), {
            extension: 'pug',
            options: {
                moment: moment
            }
        })
    )
    // app.use(koaBody({ multipart: true }))
    // 使用响应处理中间件
    app.use(response)
    // 回话状态
    // 需要keys session才能生效
    app.keys = ['lining']
    app.use(session(app))
    // 解析请求体
    app.use(bodyParser())
    app.use(serve(resolve(__dirname, '../public')))
    app.use(async (ctx, next) => {
        const User = mongoose.model('User')
        let user = ctx.session.user
        // 页面重定向到首页,防止丢失参数
        if (user && user._id) {
            user = await User.findOne({ _id: user._id })

            if (user) {
                ctx.session.user = {
                    _id: user._id,
                    role: user.role,
                    nickname: user.nickname
                }
                // 向pug 页面传递参数
                ctx.state = Object.assign(ctx.state, {
                    user: {
                        _id: user._id,
                        role: user.role,
                        nickname: user.nickname
                    }
                })
            }
        } else {
            ctx.session.user = null
        }

        await next()
    })

    // 引入路由分发
    // const router = require('./routes')
    // app.use(router.routes())
    require('./routes')(router)

    app.use(router.routes()).use(router.allowedMethods())

    // 启动程序，监听端口
    app.listen(config.port, () => debug(`listening on port ${config.port}`))
})()
