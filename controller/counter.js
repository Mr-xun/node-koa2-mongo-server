const crud = require('./crudUtil/index')
const resReturn = require('../utils/resReturn')
const Counter = require('../models/counter')

//字段计数
const counterGet = async ctx=>{
    await crud.findOne(Counter, {  }, ctx)
}

module.exports = {
    counterGet
}