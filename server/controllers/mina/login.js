// // 登录授权接口
// module.exports = async (ctx, next) => {
//     // 通过 Koa 中间件进行登录之后
//     // 登录信息会被存储到 ctx.state.$wxInfo
//     // 具体查看：
//     if (ctx.state.$wxInfo.loginState) {
//         ctx.state.data = ctx.state.$wxInfo.userinfo
//         ctx.state.data['time'] = Math.floor(Date.now() / 1000)
//     }
// }
// import mysql from '../database/mysql'
import { openidAndSessionKey, WXBizDataCrypt } from '../../wechat-lib/mina'
import { throws } from 'assert'
const mongoose = require('mongoose')
const User = mongoose.model('User')
// const User = mongoose.model('User'
// import uuid from 'uuid/v4'
// export async function getUserAsync (ctx, next) {
// module.exports = async ctx => {
//     const { code, userInfo } = ctx.request.body
//     console.log('userInfo= ' + JSON.stringify(userInfo))
//     const minaUser = await openidAndSessionKey(code)
//     console.log('------------------')
//     // console.log(minaUser)
//     let user = await mysql('users')
//         .select()
//         .where('openid', minaUser.openid)
//         .first()
//     console.log(user)
//     console.log('----------------')
//     if (!user) {
//         console.log('******************')
//         // console.log(userInfo.encryptedData)
//         // console.log(userInfo.iv)
//         // todo: 问题是 wx.userInfo() 获取不到加密信息
//         // 复制微信官方提供的解密demo代码
//         // let pc = new WXBizDataCrypt(minaUser.session_key)
//         // // 传入加密的数据和iv
//         // var data = pc.decryptData(userInfo.encryptedData, userInfo.iv)
//         // console.log(data)
//         try {
//             // if (!user) {
//             let _userData = userInfo
//             user = await mysql('users').insert({
//                 id: uuid(),
//                 avatarUrl: _userData.avatarUrl,
//                 nickName: _userData.nickName,
//                 unionid: minaUser.unionid,
//                 openid: minaUser.openid,
//                 sex: _userData.gender,
//                 country: _userData.country,
//                 province: _userData.province,
//                 city: _userData.city
//             })
//             console.log(user)
//             // 不用再查询了,浪费性能
//             // user = await mysql('users')
//             //     .select()
//             //     .where({
//             //         openid: minaUser.openid
//             //     })
//             //     .first()
//             if (user >= 0) {
//                 // 如果存入成功,那么直接组合一个json
//                 user = {
//                     avatarUrl: _userData.avatarUrl,
//                     nickName: _userData.nickName,
//                     unionid: minaUser.unionid,
//                     openid: minaUser.openid,
//                     sex: _userData.gender,
//                     country: _userData.country,
//                     province: _userData.province,
//                     city: _userData.city
//                 }
//             }
//         } catch (err) {
//             console.log(err.sqlMessage)
//             // ctx.body 与ctx.state有什么区别?
//             // ctx.body = {
//             //     code: -1,
//             //     data: { msg: err.sqlMessage }
//             // }
//             ctx.state = {
//                 code: -1,
//                 data: {
//                     msg: err.sqlMessage
//                 }
//             }
//             return
//         }
//     }
//     ctx.state = {
//         code: 0,
//         data: {
//             nickName: user.nickName,
//             avatarUrl: user.avatarUrl,
//             sex: user.sex,
//             openId: user.openid
//         }
//     }
// }

// login
exports.loginAsync = async (ctx, next) => {
    // const { code, avatarUrl, nickName } = ctx.request.body
    const { code, userInfo } = ctx.request.body
    console.log('code-----------')
    console.log(userInfo)

    try {
        const { openid, unionid, session_key } = await openidAndSessionKey(code)

        let user = await User.findOne({
            // unionid // 实际部署的时候获取不到unionid 除非开启了公众平台
            openid
        }).exec()
        console.log('openid-------------------')
        console.log(openid)
        console.log(unionid)
        console.log(session_key)
        if (!openid) {
            this.throw('没有获取到openid')
        }
        if (!user) {
            user = new User({
                openid: [openid],
                nickname: userInfo.nickName,
                unionid: unionid,
                from: 'mina',
                avatarUrl: userInfo.avatarUrl,
                email: openid + '@mina.com'
            })
            user = await user.save()
        } else {
            user.avatarUrl = userInfo.avatarUrl
            user.nickname = userInfo.nickName
            user = await user.save()
        }

        // 返回body,固定字段
        ctx.state = {
            code: 0,
            data: {
                openid: openid,
                nickName: user.nickname,
                avatarUrl: user.avatarUrl
            }
        }
    } catch (err) {
        ctx.state = {
            code: -1,
            data: {
                msg: err
            }
        }
    }
}

export async function getCodeAndsessionKeyAsync (ctx, next) {
    const { code } = ctx.query
    let res = await openidAndSessionKey(code)
    ctx.body = {
        success: true,
        data: res
    }
}
