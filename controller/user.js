const Users = require("../models/users")
const crud = require('./crudUtil')
const verify = require('../utils/verifyToken')
const TOKEN_CONFIG = require("../config/token")
//用户登录
const userLogin = async ctx => {
    let { username, password } = ctx.request.body;
    await Users.findOne({ username, password }).then(async res => {
        if (res) {
            const token = await verify.setToken({ username, _id: res._id })
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
    let isExist = false;//用户是否存在

    await Users.findOne({ username, password }).then(res => {
        if (res) isExist = true
    })
    if (isExist) {
        ctx.body = {
            code: -1,
            msg: '用户名已存在',
            data: null
        }
        return
    }

    await Users.create({ username, password }).then(async res => {
        if (res) {
            const token = await verify.setToken({ username, _id: res._id })
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: {
                    token,
                    userInfo: res
                }
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '注册失败',
                data: null
            }
        }
    }).catch(err => {
        console.error(err);
        ctx.body = {
            code: -1,
            msg: '注册异常',
            data: null
        }
    })

}

//验证用户登录
const userVerify = async ctx => {
    let token = ctx.header[TOKEN_CONFIG.header];
    token = token.replace('Bearer ', '')
    try {
        let result = await verify.getToken(token);
        await Users.findOne({ _id: result._id }).then(res => {
            if (res) {
                ctx.body = {
                    code: 200,
                    msg: '用户认证成功',
                    data: {
                        userInfo: res
                    }
                }
            } else {
                ctx.body = {
                    code: -1,
                    msg: '用户认证失败',
                    data: {
                        userInfo: res
                    }
                }
            }
        })
    } catch (err) {
        console.error(err);
        ctx.body = {
            code: -1,
            msg: '用户认证异常',
            data: null
        }
    }
}
module.exports = {
    userLogin,
    userRegister,
    userVerify
}
