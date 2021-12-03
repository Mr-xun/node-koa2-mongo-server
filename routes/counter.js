const router = require('koa-router')();
const counterCtl = require('../controller/counter')

router.prefix('/counter')

//字段计数
router.get('/get',counterCtl.counterGet)

module.exports = router;