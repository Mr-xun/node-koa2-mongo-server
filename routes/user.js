const router = require('koa-router')();
const userCtl = require('../controller/user')

router.prefix('/user')

//用户登录
router.post('/login',userCtl.userLogin)

//用户登录
router.post('/logout',userCtl.userLogout)

//用户注册
router.post('/register',userCtl.userRegister)

//用户认证
router.post('/verify',userCtl.userVerify)

//用户列表
router.get('/list',userCtl.userList)

//用户删除
router.delete('/delete/:ids',userCtl.userBatchDel)

module.exports = router;