module.exports = {
    //请求头
    header: 'authorization',
    // token密钥
    signKey: 'mrxun-server-jwt',
    //过期时间  七天
    signTime: 3600 * 24 * 7,
    //不需要验证的路由 用户登录、用户注册
    unRoute: [/^\/user\/login/, /^\/user\/register/]
}