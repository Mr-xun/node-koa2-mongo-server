const { Test } = require('../models/test')
const crud = require('./crudUtil')
const jwt = require('jsonwebtoken')
//添加系统用户
const userAdd = async (ctx) => {
    let { username = "", pwd = "" } = ctx.request.body;
    await crud.add(Test, { username, pwd }, ctx)
}

//修改系统用户
const userUpdate = async (ctx) => {
    let params = ctx.request.body;
    await crud.updateOne(Test, {
        _id: params._ids
    }, {
        username: params.username,
        pwd: params.pwd
    }, ctx)
}

//删除系统用户
const userDel = async (ctx) => {
    let { _id } = ctx.request.body;
    await crud.updateOne(Test, { _id }, ctx)
}

//查询系统用户
const userFind = async (ctx) => {
    let { username } = ctx.request.query;
    await crud.find(Test, { username }, ctx)
}

//查询单个系统用户
const userFindOne = async (ctx) => {
    let { id } = ctx.params;
    await crud.findOne(Test, { _id: id }, ctx)
}

//用户登录系统
const userLogin = async (ctx) => {
    let user = {
        username: 'admin',
        pwd: '123'
    }
    let token = jwt.sign(user,
        'xx-lf',
        { expiresIn: 3600 * 24 * 7 }
    )
    ctx.status
    ctx.body = {
        code: 200,
        msg: '登录成功',
        token
    }
}

module.exports = {
    userAdd,
    userUpdate,
    userDel,
    userFind,
    userFindOne,
    userLogin
}