const { User } = require('../models')
const crud = require('./crudUtil')
//添加系统用户
const userAdd = async (ctx) => {
    let { username = "", pwd = "" } = ctx.request.body;
    await crud.add(User, { username, pwd }, ctx)
}

//修改系统用户
const userUpdate = async (ctx) => {
    let params = ctx.request.body;
    await crud.update(User, {
        _id: params._ids
    }, {
        username: params.username,
        pwd: params.pwd
    }, ctx)
}

//删除系统用户
const userDel = async (ctx) => {
    let { _id } = ctx.request.body;
    await crud.update(User, { _id }, ctx)
}

//查询系统用户
const userFind = async (ctx) => {
    let { username } = ctx.request.query;
    await crud.find(User, { username }, ctx)
}

//查询单个系统用户
const userFindOne = async (ctx) => {
    let { id } = ctx.params;
    await crud.findOne(User, { _id: id }, ctx)
}

module.exports = {
    userAdd,
    userUpdate,
    userDel,
    userFind,
    userFindOne
}