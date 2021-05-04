const mongoose = require("mongoose")
const {
    Schema,
    model
} = mongoose

const VersionSchema = new Schema({
    taskId: { //对应哪一项任务
        type: String,
        require: true
    },
    version: { //版本（整篇文章）
        type: String,
        require: true
    },
    name: { //用户名
        type: String,
        require: true
    },
    time: { //提交的时间
        type: String,
        require: true
    }
})

const Version = model('Version', VersionSchema)

module.exports = Version