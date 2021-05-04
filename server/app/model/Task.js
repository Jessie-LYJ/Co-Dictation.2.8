const mongoose = require("mongoose")
const {
    Schema,
    model
} = mongoose

const TaskSchema = new Schema({
    videoId: { //根据videoId获得视频路径和自定义名称 Video _id
        type: String
    },
    title: {
        type: String,
    },
    diffList: { //文本比较数据
        type: Array,
        default: []
    },
    userList: { //成员名单，将任务发送到成员的个人主页
        type: Array,
        default: []
    },
    submitted: { //已提交修改的成员名单
        type: Array,
        default: []
    },
    deadline: { //积分有效期，超过该时间，不计算积分
        type: String
    },
    authcode: { //验证码
        type: String,
        default: ""
    },
    publisher: { //发布者
        type: String
    },
    comments: { //评论列表
        type: Array,
        default: []
    },
    label: { //标签
        type: Array,
        default: []
    },
    time: { //发布时间
        type: String
    },
    words: { //最小字数限制
        type: Number
    },
    reference: { //参考版本
        type: String,
        default: ""
    },
    scoreList: {
        //分数列表
        type: Array,
        default: [],
    },
    techList: {
        //技术分数列表
        type: Array,
        default: [],
    },
    matchList: {
        //匹配分数列表
        type: Array,
        default: [],
    },
    averScores: {
        //平均分
        type: String,
    },
    isManual: {
        //是否手动确认
        type: Boolean,
    },
    isConfirm: {
        //是否已确认
        type: Boolean,
    },
    configuration:{
        type:Object,
        default:{}
    }
})

const Task = model('Task', TaskSchema)

module.exports = Task