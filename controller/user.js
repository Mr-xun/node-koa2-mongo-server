const md5 = require('md5')
const crud = require('./crudUtil')
const Users = require("../models/users")
const Counter = require("../models/counter")
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
    let result = await crud.findOne(Users, { username, password }, ctx);
    if (result) {
        const token = await verify.setToken({ username, _id: result._id })
        let resData = {
            token,
            userInfo: result
        }
        ctx.body = resReturn.success(resData, '登录成功')
    } else {
        ctx.body = resReturn.fail('登录失败,用户名或密码错误')
    }
}

//用户登出
const userLogout = async ctx => {
    ctx.body = resReturn.success(null, '登出成功')
}

//用户注册
const userRegister = async ctx => {
    let { username, password, avatar, mobile, role } = ctx.request.body;
    if (!username) {
        ctx.body = resReturn.fail('用户名不能为空')
        return
    }
    if (!password) {
        ctx.body = resReturn.fail('密码不能为空')
        return
    }
    password = md5(password)
    let isExist = !!await crud.findOne(Users, { username, password }, ctx)//用户是否存在

    if (isExist) {
        ctx.body = resReturn.fail('该用户已存在')
        return
    }
    let { user_id } = await Counter.findOneAndUpdate({}, { $inc: { user_id: 1 } }, {
        new: true,
        upsert: true
    })
    let params = {
        user_id, username, password, avatar, mobile, role
    }
    await crud.add(Users, params, ctx)
}

//用户修改
const userUpdate = async ctx => {
    let { username, avatar, mobile, role, user_id } = ctx.request.body;
    if (!user_id) {
        ctx.body = resReturn.fail('缺少用户user_id参数')
        return
    }
    if (!username) {
        ctx.body = resReturn.fail('用户名不能为空')
        return
    }
    let isExist = !!await crud.findOne(Users, { username: { $in: username }, user_id: { $nin: user_id } }, ctx)//用户是否存在 
    if (isExist) {
        ctx.body = resReturn.fail('该用户名已存在')
        return
    }
    let params = {
        username, avatar, mobile, role
    }
    await crud.updateOne(Users, { user_id }, params, ctx)
}

//验证用户登录
const userVerify = async ctx => {
    try {
        let token = ctx.header[TOKEN_CONFIG.header];
        token = token.replace('Bearer ', '')
        let tokenInfo = await verify.getToken(token);
        let dbResult = await crud.findOne(Users, { user_id: tokenInfo.user_id }, ctx)
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

//用户批量删除
const userBatchDel = async ctx => {
    let { ids } = ctx.params;
    if (!ids || ids == 'undefined') {
        ctx.body = resReturn.fail('删除失败')
        return
    }
    let deleteIds = ids.split(',')
    await crud.updateMany(Users, { user_id: { $in: deleteIds } }, { is_delete: 1 }, ctx)
}
module.exports = {
    userLogin,
    userLogout,
    userRegister,
    userUpdate,
    userVerify,
    userList,
    userBatchDel
}
