const utils = require("../../utils/index")
const resReturn = require('../../utils/resReturn')
/**
 * @description 添加数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} params 添加字段参数
 * @param {object} ctx 执行上下文
 * @returns 
 */
const add = (model, params, ctx) => (
    model.create(params).then(res => {
        if (res) {
            ctx.body = {
                code: 200,
                msg: '添加成功',
                data: res
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '添加失败',
                data: ''
            }
        }

    }).catch(err => {
        console.error(err)
        ctx.body = {
            code: -1,
            msg: '添加出现异常',
            data: err
        }
    })
)

/**
 * @description 修改数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} params 修改字段参数
 * @param {object} ctx 执行上下文
 * @returns 
 */
const update = (model, whele, pramas, ctx) => (
    model.updateOne(whele, pramas).then(res => {
        console.log(res);
        ctx.body = {
            code: 200,
            msg: '修改成功',
            data: res
        }
    }).catch(err => {
        console.error(err)
        ctx.body = {
            code: -1,
            msg: '修改出现异常',
            data: err
        }
    })
)


/**
 * @description 删除数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} ctx 执行上下文
 * @returns 
 */
const del = (model, whele, ctx) => (
    model.findOneAndDelete(whele).then(res => {
        ctx.body = {
            code: 200,
            msg: '删除成功',
            data: res
        }
    }).catch(err => {
        console.error(err)
        ctx.body = {
            code: -1,
            msg: '删除出现异常',
            data: err
        }
    })
)


/**
 * @description 查询所有数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} ctx 执行上下文
 * @returns 
 */
const findAll = async (model, where, ctx) => {
    where.is_delete = { $ne: 1 }//过滤已删除状态

    let rows = await model.find(where).catch(err => {
        console.error(err)
        ctx.body = resReturn.error(err)
    })
    ctx.body = resReturn.success({ rows }, '查询成功')
}


/**
 * @description 分页查询数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} ctx 执行上下文
 * @returns 
 */
const findPage = async (model, where, ctx) => {
    let { pageNum, pageSize } = where;
    let pager = utils.setPager(pageNum, pageSize)

    where.is_delete = { $ne: 1 }//过滤已删除状态

    //删除页码参数
    delete where.pageNum
    delete where.pageSize

    //数据总数
    let total = await model.find(where).count() || 0;
    let pages = Math.ceil(total / pager.pageSize);

    let rows = await model.find(where).skip(pager.pageSkip).limit(pager.pageSize).catch(err => {
        console.error(err);
        ctx.body = resReturn.error(err)
    });
    let result = {
        rows,
        total,
        pages
    }
    ctx.body = resReturn.success(result, '查询成功')
}


/**
 * @description 查询单个数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} ctx 执行上下文
 * @returns 
 */
const findOne = async (model, where, ctx) => {
    where.is_delete = { $ne: 1 }//过滤已删除状态

    let result = await model.findOne(where).catch(err => {
        console.error(err)
        ctx.body = resReturn.error(err)
    })
    ctx.body = resReturn.success({ result }, '查询成功')
}

/**
 * @description 批量修改数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} params 修改字段参数
 * @param {object} ctx 执行上下文
 * @returns 
 */
const updateMany = (model, whele, pramas, ctx) => (
    model.updateMany(whele, pramas).then(res => {
        console.log(res);
        ctx.body = {
            code: 200,
            msg: '修改成功',
            data: res
        }
    }).catch(err => {
        console.error(err)
        ctx.body = {
            code: -1,
            msg: '修改出现异常',
            data: err
        }
    })
)
module.exports = {
    add,
    update,
    del,
    findAll,
    findOne,
    findPage,
    updateMany
}