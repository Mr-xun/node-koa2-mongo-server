const JWT = require('jsonwebtoken');
const TOKEN_CONFIG = require('../config/token')

const verify = {
    //设置token
    setToken(info) {
        return new Promise((resolve, reject) => {
            let token = JWT.sign(info, TOKEN_CONFIG.signKey, {
                expiresIn: TOKEN_CONFIG.signTime
            })
            resolve(token)
        })
    },
    //解析token信息
    getToken(token) {
        return new Promise((resolve, reject) => {
            if (!token.split('').length) {
                reject({
                    error: 'the token is impty'
                });
            } else {
                let data = JWT.verify(token.replace('Bearer ', ''), TOKEN_CONFIG.signKey);
                resolve(data);
            }
        });
    }
}

module.exports = verify