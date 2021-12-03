const mongoose = require('mongoose');
const moment = require('moment-timezone')  //设置mongoose时区
moment.tz.setDefault("Asia/Shanghai");
//用户对象
const schema = new mongoose.Schema({
    user_id: Number,        //用户id
    username: String,       //用户名
    password: {             //密码
        type: String,
        select: false
    },
    avatar: {               //头像
        type: String,
        default: "",
    },
    mobile: {                //联系电话
        type: String,
        default: '',
    },
    role: {                  //角色 1 管理员 2普通用户
        type: Number,
        default: 1,
        enum: [1, 2]
    },
    is_delete: {              //是否删除 1是 0 否
        type: Number,
        default: 0,
        select: false
    },
    create_time: {
        type: String,
    },
    update_time: {
        type: String,
    }
}, {
    versionKey: false, // You should be aware of the outcome after set to false
    timestamps: {
        currentTime: () => {
            return moment().format('YYYY-MM-DD HH:mm:ss');
        }, createdAt: 'create_time', updatedAt: 'update_time'
    }
});

const User = mongoose.model('users', schema)

module.exports = User