const Users = require("../models/users")
const crud = require('./crudUtil')
const verify = require('../utils/verifyToken')
const TOKEN_CONFIG = require("../config/token.config")
//用户登录
const userLogin = async ctx => {
    let { username, password } = ctx.request.body;
    await Users.findOne({ username, password }).then(async res => {
        if (res) {
            const token = await verify.setToken({ username, _id: res._id })
            console.log(token)
            ctx.body = {
                code: 200,
                msg: '登录成功',
                data: {
                    token,
                    userInfo: res
                }
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '登录失败,用户名或密码错误',
                data: null
            }
        }

    }).catch(err => {
        console.error(err)
        ctx.body = {
            code: -1,
            msg: '登录异常',
            data: null
        }
    })

}

//用户注册
const userRegister = async ctx => {
    let { username, password } = ctx.request.body;
    let isExist = !!await Users.findOne({ username, password })//用户是否存在
    if (isExist) {
        ctx.body = {
            code: -1,
            msg: '用户名已存在',
            data: null
        }
        return
    }
    let dbResult = await Users.create({ username, password }).catch(err => {
        console.error(err);
        ctx.body = {
            code: -1,
            msg: '注册异常',
            errorMsg: err,
            data: null
        }
    })
    if (dbResult) {
        const token = await verify.setToken({ username, _id: dbResult._id })
        ctx.body = {
            code: 200,
            msg: '注册成功',
            data: {
                token,
                userInfo: dbResult
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '注册失败',
            data: null
        }
    }
}

//验证用户登录
const userVerify = async ctx => {
    try {
        let token = ctx.header[TOKEN_CONFIG.header];
        console.log(token,ctx.header,66)
        token = token.replace('Bearer ', '')
        let tokenInfo = await verify.getToken(token);
        let dbResult = await Users.findOne({ _id: tokenInfo._id })
        if (dbResult) {
            ctx.body = {
                code: 200,
                msg: '用户认证成功',
                data: {
                    userInfo: dbResult
                }
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '用户认证失败',
                data: null
            }
        }
    } catch (err) {
        console.error(err);
        ctx.body = {
            code: -1,
            msg: '用户认证异常',
            errorMsg: err,
            data: null
        }
    }
}
module.exports = {
    userLogin,
    userRegister,
    userVerify
}
