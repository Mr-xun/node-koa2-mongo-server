const mongoose = require('mongoose');

//用户对象
const ObjectId = mongoose.Schema.Types.ObjectId;
const schema = new mongoose.Schema({
    username: String,
    password: {
        type: String,
        select: false
    },
    avatar: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: '',
    },
}, {
    versionKey: false, // You should be aware of the outcome after set to false
    timestamps: {createdAt: 'createTime', updatedAt: 'updateTime' }
});

const User = mongoose.model('users', schema)

module.exports = User