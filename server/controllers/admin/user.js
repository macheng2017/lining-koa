// module.exports = async (ctx, next) => {
//     // 通过 Koa 中间件进行登录态校验之后
//     // 登录信息会被存储到 ctx.state.$wxInfo
//     // 具体查看：
//     if (ctx.state.$wxInfo.loginState === 1) {
//         // loginState 为 1，登录态校验成功
//         ctx.state.data = ctx.state.$wxInfo.userinfo
//     } else {
//         ctx.state.code = -1
//     }
// }
// 1. 实现一个注册页面的控制 showSignup
// 2. 增加一个登陆页面的控制 showSignin
// 3. 用户数据的持久化 signup
// 4. 增加一个登陆的校验/判断 signin
// 5. 增加路由规则
// 6. 增加两个Pug页面,注册和登陆
// 7. koa-bodyparser

const mongoose = require('mongoose')
const User = mongoose.model('User')
const validator = require('validator')
// 1. 实现一个注册页面的控制 showSignup
exports.showSignup = async (ctx, next) => {
    await ctx.render('pages/signup', {
        title: '注册页面'
    })
}
// 2. 增加一个登陆页面的控制 showSignin
exports.showSignin = async (ctx, next) => {
    await ctx.render('pages/signin', {
        title: '登陆页面'
    })
}
// 3. 用户数据的持久化 signup
exports.signup = async (ctx, next) => {
    const { email, password, nickname } = ctx.request.body.user

    //= > true
    if (!validator.isEmail(email)) {
        return ctx.render('pages/signup', {
            title: '错误提示!',
            msg: '邮箱格式错误'
        })
    }
    if (validator.isEmpty(nickname) || validator.isEmpty(password)) {
        return ctx.render('pages/signup', {
            title: '错误提示!',
            msg: '昵称或者密码不能为空'
        })
    }
    let user = await User.findOne({ email })
    console.log('User in db')
    console.log(user)
    if (user) {
        return ctx.render('pages/signin', {
            title: '错误提示!',
            msg: '邮箱已经注册过了!,您可以直接登录'
        })
    }

    user = new User({
        email,
        nickname,
        password
    })
    console.log('从注册表单收到的数据')
    console.log(nickname)
    console.log(user)
    console.log('----------------')
    ctx.session.user = {
        _id: user._id,
        role: user.role,
        nickname: user.nickname
    }
    user = await user.save()
    ctx.redirect('/')
}
exports.signin = async (ctx, next) => {
    // 4. 增加一个登陆的校验/判断 signin
    const { email, password } = ctx.request.body.user
    if (!validator.isEmail(email)) {
        return ctx.render('pages/signin', {
            title: '错误提示!',
            msg: '邮箱格式错误'
        })
    }
    if (validator.isEmpty(password)) {
        return ctx.render('pages/signin', {
            title: '错误提示!',
            msg: '邮箱或者密码不能为空'
        })
    }
    const user = await User.findOne({ email })

    if (!user) return ctx.redirect('/user/signup')

    const isMatch = await user.comparePassword(password, user.password)

    if (isMatch) {
        ctx.session.user = {
            _id: user._id,
            role: user.role,
            nickname: user.nickname
        }
        console.log('session-------------')
        console.log(ctx.session)
        ctx.redirect('/')
    } else {
        ctx.redirect('/user/signin')
    }
}

exports.logout = async (ctx, next) => {
    ctx.session.user = {}

    ctx.redirect('/')
}
// 5. 增加路由规则

// 6. 增加两个Pug页面,注册和登陆
// 7. koa-bodyparser

// The page of users list
exports.list = async (ctx, next) => {
    const users = await User.find({}).sort('meta.updatedAt')
    // console.log(users)
    await ctx.render('pages/userlist', {
        title: '用户列表页面',
        users
    })
}
// 需要登录的路由中间件控制
exports.signinRequired = async (ctx, next) => {
    const user = ctx.session.user
    if (!user || !user._id) {
        return ctx.redirect('/user/signin')
    }
    await next()
}
// 需要管理员身份中间件校验
exports.adminRequired = async (ctx, next) => {
    const user = ctx.session.user
    // 现在没办法修改数据库先让普通用户看到用户列表
    if (user.role !== 'admin') {
        // if (user.role !== 'user') {
        return ctx.redirect('/user/signin')
    }
    await next()
}

exports.del = async (ctx, next) => {
    const id = ctx.query.id

    try {
        await User.remove({ _id: id })
        ctx.body = { success: true }
    } catch (err) {
        ctx.body = { success: false }
    }
}
