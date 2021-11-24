const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const MongoConnect = require('./db')
const koajwt = require('koa-jwt')
const TOKEN_CONFIG = require('./config/token');
const veriy = require('./utils/verifyToken')
//连接数据库
MongoConnect()

const index = require('./routes/index')
const test = require('./routes/test')
const user = require('./routes/user')
const upload = require('./routes/upload')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

app.use(async (ctx, next) => {
    return next().catch((err) => {
        console.log(err.status,err.name,err.message)
        if (err.status === 401) {
            // 自定义返回结果
            ctx.status = 401;
            ctx.body = {
                code: 401,
                msg: 'The token is invalid',
                error: err.name + ':' + err.message
            }
        } else {
            throw err;
        }
    })
});
//jwt认证
app.use(koajwt({
    secret: TOKEN_CONFIG.signKey
}).unless({
    path: TOKEN_CONFIG.unRoute
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(test.routes(), test.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
