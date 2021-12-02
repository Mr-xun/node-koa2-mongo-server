const mongoose = require('mongoose');

//用户对象
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema({
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
    }
}, {
    versionKey: false, // You should be aware of the outcome after set to false
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});

const User = mongoose.model('users', schema)

module.exports = User