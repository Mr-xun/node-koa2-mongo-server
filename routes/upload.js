const router = require('koa-router')();
const multer = require('koa-multer');
const fs = require('fs')
const path = require('path')

router.prefix('/upload')

let storage = multer.diskStorage({
    //设置文件存储位置
    destination: (req, file, cb) => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dir = "./public/uploads/" + year + month + day;
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
let upload = multer({ storage })
router.post('/image', upload.single('file'), async ctx => {
    try {
        let path = ctx.origin + '' + ctx.req.file.path.replace('public', '')
        ctx.body = {
            code: 200,
            mgs: '上传成功',
            data: {
                url: path
            }
        }
    } catch (error) {
        ctx.body = {
            code: -1,
            mgs: '上传失败',
            data: null
        }

    }
})

module.exports = router;