const utils = require("../../utils/index")
const resReturn = require('../../utils/resReturn')
/**
 * @description 添加数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} params 添加字段参数
 * @param {object} ctx 执行上下文
 * @returns 
 */
const add = async (model, params, ctx) => {
    let result = await model.create(params).catch(err => {
        console.error(err)
        ctx.body = resReturn.error(err)
    })
    if (result) {
        ctx.body = resReturn.success(null, '创建成功')
    } else {
        ctx.body = resReturn.fail('创建失败')
    }
    return result
}

/**
 * @description 单挑数据修改的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} params 修改字段参数
 * @param {object} ctx 执行上下文
 * @returns 
 */
const updateOne = async (model, whele, params, ctx) => {
    const result = await model.updateOne(whele, params).catch(err => {
        console.error(err)
        ctx.body = resReturn.error(err)
    })
    ctx.body = resReturn.success(null)
    return result
}
/**
 * @description 批量修改数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} params 修改字段参数
 * @param {object} ctx 执行上下文
 * @returns 
 */
const updateMany = async (model, whele, params, ctx) => {
    const result = await model.updateMany(whele, params).catch(err => {
        console.error(err)
        ctx.body = resReturn.error(err)
    })
    ctx.body = resReturn.success(null)
    return result
}

/**
 * @description 物理删除单条数据的公共方法
 * @param {object} model SchemaModel
 * @param {object} where 查询条件
 * @param {object} ctx 执行上下文
 * @returns 
 */
const deleteOne = async (model, whele, ctx) => {
    const result = await model.findOneAndDelete(whele).catch(err => {
        console.error(err)
        ctx.body = resReturn.error(err)

    })
    ctx.body = resReturn.success(null)
    return result
}


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
    ctx.body = resReturn.success({ rows })
    return rows
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

    //过滤已删除状态
    where.is_delete = { $ne: 1 }

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
    ctx.body = resReturn.success(result)
    return rows

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
    ctx.body = resReturn.success({ result })
    return result
}

module.exports = {
    add,
    deleteOne,
    findAll,
    findOne,
    findPage,
    updateOne,
    updateMany
}