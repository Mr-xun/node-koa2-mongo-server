const md5 = require('md5')
const crud = require('./crudUtil')
const Users = require("../models/users")
const utils = require("../utils/index")
const verify = require('../utils/verifyToken')
const resReturn = require('../utils/resReturn')
const TOKEN_CONFIG = require("../config/token.config")
//用户登录
const userLogin = async ctx => {
    let { username, password } = ctx.request.body;
    if (!username) {
        ctx.body = resReturn.fail('用户名不能为空')
        return
    }
    if (!password) {
        ctx.body = resReturn.fail('密码不能为空')
        return
    }
    password = md5(password)
    await Users.findOne({ username, password }).then(async res => {
        if (res) {
            const token = await verify.setToken({ username, _id: res._id })
            let resData = {
                token,
                userInfo: res
            }
            ctx.body = resReturn.success(resData, '登录成功')
        } else {
            ctx.body = resReturn.fail('登录失败,用户名或密码错误')
        }

    }).catch(err => {
        console.error(err)
        ctx.body = resReturn.error(err)
    })

}

//用户注册
const userRegister = async ctx => {
    let { username, password } = ctx.request.body;
    if (!username) {
        ctx.body = resReturn.fail('用户名不能为空')
        return
    }
    if (!password) {
        ctx.body = resReturn.fail('密码不能为空')
        return
    }
    password = md5(password)
    let isExist = !!await Users.findOne({ username, password })//用户是否存在
    if (isExist) {
        ctx.body = resReturn.fail('该用户已存在')
        return
    }
    let dbResult = await Users.create({ username, password }).catch(err => {
        console.error(err);
        ctx.body = resReturn.error(err)
    })
    if (dbResult) {
        const token = await verify.setToken({ username, _id: dbResult._id })
        delete dbResult.password
        let resData = {
            token,
            userInfo: dbResult
        }
        ctx.body = resReturn.success(resData, '注册成功')
    } else {
        ctx.body = resReturn.fail('注册失败')
    }
}

//验证用户登录
const userVerify = async ctx => {
    try {
        let token = ctx.header[TOKEN_CONFIG.header];
        token = token.replace('Bearer ', '')
        let tokenInfo = await verify.getToken(token);
        let dbResult = await Users.findOne({ _id: tokenInfo._id })
        if (dbResult) {
            ctx.body = resReturn.success({ userInfo: dbResult }, '用户认证成功')
        } else {
            ctx.body = resReturn.fail('用户认证失败')

        }
    } catch (err) {
        console.error(err);
        ctx.body = resReturn.error(err)
    }
}

//用户列表
const userList = async ctx => {
    let { pageNum, pageSize, username } = ctx.query;
    let where = {
        pageNum, pageSize
    }
    if (username) where.username = new RegExp(username);
    await crud.findPage(Users, where, ctx)
}
module.exports = {
    userLogin,
    userRegister,
    userVerify,
    userList
}
