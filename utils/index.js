/**
 * @description 设置页码
 * @param {number} pageNum 页码
 * @param {number} pageSize 每页个数
 * @returns {object} {
        pageNum,
        pageSize,
        pageSkip
    }
 */
const setPager = (pageNum, pageSize) => {
    if (!pageNum || isNaN(Number(pageNum))) {
        pageNum = 1
    } else {
        pageNum = Number(pageNum)
    }

    if (!pageSize || isNaN(Number(pageSize))) {
        pageSize = 10
    } else {
        pageSize = Number(pageSize)
    }

    let pageSkip = (pageNum - 1) * pageSize
    return {
        pageNum,
        pageSize,
        pageSkip
    }
}
module.exports = {
    setPager
}
