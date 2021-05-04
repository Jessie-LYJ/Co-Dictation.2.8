const mongoose = require("mongoose")
const {
    Schema,
    model
} = mongoose

const VideoSchema = new Schema({
    title: {
        type: String,
        require: true
    }, //用户自定义标题
    fileName: {
        type: String,
        require: true
    }, //实际储存的名字
    path: {
        type: String,
        require: true
    },
    label: {
        type: Array,
        default: [],
        require: true
    }
})

const Video = model('Video', VideoSchema)

module.exports = Video