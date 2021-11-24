const router = require('koa-router')()
const testCtl = require("../controller/test")

router.prefix('/test')

//添加测试用户
router.post('/login', testCtl.userLogin)

//添加测试用户
router.post('/add', testCtl.userAdd)

//修改测试用户
router.post('/update', testCtl.userUpdate)

//删除测试用户
router.post('/del', testCtl.userDel)

//查询所有测试用户
router.get('/find', testCtl.userFind)

//查询单个测试用户
router.get('/find/:id', testCtl.userFindOne)

module.exports = router
