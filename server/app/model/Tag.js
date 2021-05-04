const mongoose = require("mongoose")
const {
    Schema,
    model
} = mongoose

const TagSchema = new Schema({
    tagName: { //标签名
        type: String,
        require: true
    }, 
    owner: { //谁设置的标签名
        type: String,
        require: true
    },
    userList: { //属于该标签的学生名单，在发布任务时加入
        type: Array,
        require: true
    }
})

const Tag = model('Tag', TagSchema)

module.exports = Tag