//字段计数
const mongoose = require('mongoose');
const moment = require('moment-timezone')  //设置mongoose时区
moment.tz.setDefault("Asia/Shanghai");
const scheme = new mongoose.Schema({
    user_id: {         //用户id
        type: Number,
        default: 0
    },
    create_time: {
        type: String,
    },
    update_time: {
        type: String,
    }
}, {
    versionKey: false, // 不返回__v
    timestamps: {
        currentTime: () => {
            return moment().format('YYYY-MM-DD HH:mm:ss');
        }, createdAt: 'create_time', updatedAt: 'update_time'
    }
})
const Counter = mongoose.model('counter', scheme, 'counter')
module.exports = Counter