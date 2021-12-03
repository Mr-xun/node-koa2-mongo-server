const resReturn = require('../utils/resReturn')
const multer = require('koa-multer');
const fs = require('fs')
const path = require('path')
const sd = require('silly-datetime');
let storage = multer.diskStorage({
    //设置文件存储位置
    destination: (req, file, cb) => {
        //使用第三方模块silly-datetime
		var t = sd.format(new Date(), 'YYYYMMDD');
        let dir = "./public/uploads/" +t;
        //判断路径是否存在
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir)
    },
    //设置上传文件名称
    filename: (req, file, cb) => {
        let fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }
});
let uploadMulter = multer({ storage })
//单图片上传
const uploadSigleFile = async ctx => {
    try {
        if (!ctx.req.file) {
            ctx.body = resReturn.fail('请选择文件')
            return
        }
        let path = ctx.origin + '' + ctx.req.file.path.replace('public', '')
        ctx.body = resReturn.success({ url: path }, '上传成功')
    } catch (error) {
        console.log(error)
        ctx.body = resReturn.error(error, '上传失败')
    }
}

module.exports = {
    uploadMulter,
    uploadSigleFile
}