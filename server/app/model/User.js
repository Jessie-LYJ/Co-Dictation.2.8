const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const {
    Schema,
    model
} = mongoose

const UserSchema = new Schema({
    stuid: {//学号, 便于老师管理；自己注册的用户不需要该信息
        type: String,
        default: ''
    },
    password: {//密码
        type: String,
        require: true,
        // set(val) {
        //     return bcrypt.hashSync(val, 10)
        // }
    },
    name: {//用户名，唯一
        type: String,
        require: true
    },
    stuname: {
        type: String,
        default: ''
    },
    lastLogin:{
        type: String,
    },
    myDakas:{
        type:Array,
        default:[]
    },
    status: {
        type: String,
        default: '0'
    }, //身份 3=>管理员 0=>普通用户 1=>老师 2=>组长
    myPublished: {//我的发布 老师和组长
        type: Array,
        default: []
    },
    myTasks: {//我的任务列表 普通用户和组长
        type: Array,
        default: []
    },
    //我的评论附带该评论下方所有的回复
    myComments: {
        type: Array,
        default: []
    },
    myCoins:{
        type:Array,
        default:[]
    },
    myRecords:{
        type:Object,
    },
    myWrongLists:{
        type:Array,
        default:[]  
    },
    myStudyRecords:{
        type:Array,
        default:[]
    },
    configuration:{
        type:Object,
        default:
            {
                SMscore: 60,
                timePercentage: 0.6,
                timeSpan: 6
            }
    },
    myBadges:{
        type:Array,
        default:[]
    }
})

const User = model('User', UserSchema)

module.exports = User