const router = require('koa-router')();
const uploadCtl = require('../controller/upload')

router.prefix('/upload')

//单文件上传
router.post('/file', uploadCtl.uploadMulter.single('file'), uploadCtl.uploadSigleFile)

module.exports = router;