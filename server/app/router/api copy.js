//用来做人员管理的路由处理
const express = require("express")
// const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')
const moment = require('moment');

const User = require('../model/User')
const Version = require('../model/Version')
const Tag = require('../model/Tag')
const Video = require('../model/Video')
const Task = require('../model/Task')

const {
    secret
} = require('../config/key')
const {
    dateDiff
} = require('../config/score')
const router = express.Router()

//注册接口
router.post('/register', async (req, res) => {
    // console.log(req.body)
    const user = await User.findOne({
        name: req.body.name
    })
    if (user) {
        return res.status(409).send('该用户已存在')
    }
    const newUser = await new User(req.body).save()
    res.send(newUser)
})

//登录接口
router.post('/login', async (req, res) => {
    //查询用户是否存在
    const user = await User.findOne({
        name: req.body.name
    })
    if (!user) {
        return res.status(422).send('该用户不存在')
    }
    // let isPassword = await bcrypt.compareSync(req.body.password, user.password)
    // if (!isPassword) {
    //     return res.status(422).send('密码错误')
    // }
    if (req.body.password !== user.password) {
        return res.status(422).send('密码错误')
    }
    const {
        _id,
        name
    } = user
    const token = jwt.sign({
        _id,
        name
    }, secret, {
        expiresIn: '24h'
    })
    //返回token
    res.send(token)
    // res.send({token, user})
})

//获取User的lastLogin
router.get('/lastLogin', async (req, res) => {
    // let date = new Date();
    // let time = date.toLocaleString("chinese", {
    //     hour12: false,
    // });
    let time = moment().format('YYYY/MM/DD HH:mm:ss')
    // console.log(req.query)
    const list = await User.findOne({
        name: req.query.username
    })
    await User.updateOne({
        _id: list._id
    }, {
        $set: {
            lastLogin: time
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
    var usercoins = []
    var sDate = ""
    usercoins = [{
        coin: 1,
        type: "+",
        msg: "每日登录",
        time: time,
    }]
    if (!list.lastLogin) {
        sDate = 1
    } else {
        sDate = dateDiff(list.lastLogin, time)
    }
    if (sDate !== 0) {
        await User.findByIdAndUpdate(list._id, {
            $addToSet: {
                myCoins: usercoins,
            }
        }, (err, res) => {
            if (err) {
                console.log("Error:" + err);
            } else {
                console.log("Res:" + res);
            }
        })
        await User.updateMany({
            _id: list._id
        }, {
            $inc: {
                'myRecords.totalCoins': 0.5,
                'myRecords.actualCoins': 0.5,
            }
        }, (err, res) => {
            if (err) {
                console.log("Error:" + err);
            } else {
                console.log("Res:" + res);
            }
        })
        res.send(list.lastLogin)
    } else {
        console.log('error')
    }
})


//后台登录接口
router.post('/adminLogin', async (req, res) => {
    //查询用户是否存在
    const user = await User.findOne({
        name: req.body.name
    })
    if (!user) {
        return res.status(422).send('该用户不存在')
    }
    // let isPassword = await bcrypt.compareSync(req.body.password, user.password)
    // if (!isPassword) {
    //     return res.status(422).send('密码错误')
    // }
    if (req.body.password !== user.password) {
        return res.status(422).send('密码错误')
    } else {
        if (!user.status === '3') {
            return res.status(422).send('没有权限')
        }
    }
    const {
        _id,
        name
    } = user
    const token = jwt.sign({
        _id,
        name
    }, secret, {
        expiresIn: '24h'
    })
    //返回token
    res.send(token)
    // res.send({token, user})
})

//获取数据库中所有的title
router.get('/titleList', async (req, res) => {
    const list = await Video.find()
    res.send(list)
    console.log(list)
})

//获取数据库中所有的task
router.get('/taskList', async (req, res) => {
    const list = await Task.find()
    res.send(list)
    console.log(list)
})
// router.get('/taskList', async (req, res) => {
//     const list = await Task.find({}, { "_id": 0, "title": 1, "authcode": 1, "label": 1, "time": 1 })
//     res.send(list)
//     console.log(list)
// })

//获取数据库中属于当前用户的tag列表
router.get('/tagList', async (req, res) => {
    const list = await Tag.find({
        owner: req.query.owner
    })
    res.send(list)
    console.log(list)
})

//返回当前用户的信息文档 profile
router.get('/profile', async (req, res) => {
    const list = await User.find({
        name: req.query.name
    })
    res.send(list)
    console.log(list)
})

//发布任务
router.post('/task', async (req, res) => {
    var info = req.files[0]
    var otherInfo = req.body //可获取表单传过来的其他信息，如videoLabel和title
    console.log('otherInfo(表单传过来的信息)：', otherInfo)
    // console.log("获取到的videoLable", otherInfo.videoLabel)
    var title = otherInfo.title //用户自定义标题
    var fileName = info.filename + '.' + info.originalname.split('.').pop() //实际储存的名字
    var newName = info.destination + fileName
    var deadline = otherInfo.deadline
    var authcode = otherInfo.authcode
    var publisher = otherInfo.publisher
    var isManual = otherInfo.isManual == "on" ? true : false
    console.log('---------' + otherInfo.tag)
    var userList = []
    var scoreList = []
    var matchList = []
    var techList = []
    var averScores = ''
    var scores = ''
    var configuration = {
        SMscore: otherInfo.SMscore,
        timePercentage: otherInfo.timePercentage,
        timeSpan: otherInfo.timeSpan
    }
    let date = new Date();
    let time = date.toLocaleString("chinese", {
        hour12: false,
    });
    if (otherInfo.tag) {
        var tagItem = await Tag.findOne({
            tagName: otherInfo.tag
        })
        userList = tagItem.userList
        for (var i = 0; i < userList.length; i++) {
            delete userList[i].password;
            userList[i].my_sentences = [];
        }
    }


    // 根据发布者姓名找到其_id,并获取“myPublished”属性
    var userPublished = []
    if (publisher) {
        var publisherInfo = await User.findOne({
            name: publisher
        })
        var publisherId = publisherInfo._id
        userPublished = publisherInfo.myPublished
    }

    // 利用fs模块的文件重命名
    // info.path是文件的在传递中被修改的路径+名字（没有文件名后缀），newName加了后缀
    fs.rename(info.path, newName, async (err) => {
        if (err) {
            res.send('失败')
        } else {
            let newVideo = {
                title: title,
                fileName: fileName,
                path: info.destination,
                label: otherInfo.videoLabel
            }

            const newVideo2 = await new Video(newVideo).save()
            // res.send(newVideo2)
            var video_id = newVideo2._id
            let newTask = {
                videoId: video_id, //视频ID相当于任务ID
                deadline: deadline,
                authcode: authcode,
                publisher: publisher,
                userList: userList,
                title: title,
                label: otherInfo.videoLabel,
                words: otherInfo.words,
                time: time,
                scoreList: scoreList,
                techList: techList,
                matchList: matchList,
                averScores: averScores,
                isManual: isManual,
                isConfirm: false,
                configuration:configuration
            }
            const newTask2 = await new Task(newTask).save()
            // res.send(newTask2) 
            var task_id = newTask2._id

            // 更新User表中的“myPublished”数据
            userPublished = [{
                taskId: task_id,
                videoId: video_id,
                deadline: deadline,
                authcode: authcode,
                userList: userList,
                title: title,
                label: otherInfo.videoLabel,
                time: time,
                scoreList: scoreList,
                techList: techList,
                matchList: matchList,
                averScores: averScores,
                exceedAverNum: "",
                pass60Rate: "",
                passAverRate: "",
                maxScore: "",
                minScore: "",
                configuration:configuration
            }]

            var usercoins = []
            usercoins = [{
                coin: 5,
                type: "+",
                msg: "发布任务",
                time: time,
            }]
            await User.findByIdAndUpdate(publisherId, {
                $addToSet: {
                    myPublished: userPublished,
                    myCoins: usercoins,
                },
                $set: {
                    configuration:configuration, 
                 }
            }, (err, res) => {
                if (err) {
                    console.log("Error:" + err);
                } else {
                    console.log("Res:" + res);
                }
            })
            await User.updateMany({
                _id: publisherId
            }, {
                $inc: {
                    'myRecords.totalCoins': 2.5,
                    'myRecords.actualCoins': 2.5,
                }
            }, (err, res) => {
                if (err) {
                    console.log("Error:" + err);
                } else {
                    console.log("Res:" + res);
                }
            })
            // res.send(publisher + ":" + userPublished)

            // 根据发布任务中的小组名单来更新User表中的“myTasks”数据
            var userTask = []
            if (userList) {
                for (let i = 0; i < userList.length; i++) {
                    var userInfo = await User.findOne({
                        name: userList[i].name
                    })
                    var userId = userInfo._id
                    userTask = userInfo.myTasks
                    userTask = [{
                        taskId: task_id,
                        videoId: video_id,
                        deadline: deadline,
                        authcode: authcode,
                        title: title,
                        label: otherInfo.videoLabel,
                        time: time,
                        scores: scores
                    }]
                    await User.findByIdAndUpdate(userId, {
                        $addToSet: {
                            myTasks: userTask
                        }
                    }, (err, res) => {
                        if (err) {
                            console.log("Error:", err);
                        } else {
                            console.log("Res:", res);
                        }
                    })
                }
            }

            res.redirect('http://localhost:8080/#/profile/') //此处地址待更改
            fs.access(info.path, (err) => {
                if (err) {
                    console.log("不存在该文件");
                } else {
                    fs.unlink(info.path, function (error) {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                        console.log('删除文件成功');
                    }) //如果产生多余文件，则删除
                }
            })

        }
    })

})

//导入名单，加上标签
router.post('/addUsers', async (req, res) => {
    const newTag = await new Tag(req.body).save()
    res.send(newTag)
    var userList = req.body.userList;
    // console.log(userList)
    for (let i = 0; i < userList.length; i++) {
        var user = await User.findOne({
            name: userList[i].name
        })
        if (user) {
            return res.status(409).send('该用户已存在')
        } else {
            await new User(userList[i]).save()
        }

    }
})

//返回当前任务文档
router.get('/currentTask', async (req, res) => {
    const list = await Task.find({
        _id: req.query._id
    })
    res.send(list)
    console.log(list)
})

//返回当前视频文档
router.get('/currentVideo', async (req, res) => {
    const list = await Video.find({
        _id: req.query._id
    })
    res.send(list)
    console.log(list)
})

router.get('/currentVideoPublisher', async (req, res) => {
    const list = await User.find({
        name: req.query.name
    })
    res.send(list)
    console.log(list)
})

//处理文本比较数据（好像没用了，可删）
router.post('/diff', async (req, res) => {
    let diffList = []
    let sentences = req.body.params.sentences
    for (var i = 0; i < sentences.length; i++) {
        diffListItem = {
            sentence: sentences[i],
            diffs: [] //记录该句子的修改情况
        }
        diffList.push(diffListItem)
    }
    //存储第一位用户提交的第一版本句子
    await Task.find({
        _id: req.body.params._id
    }, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            Task.updateOne({
                _id: req.body.params._id
            }, {
                $set: {
                    diffList: diffList,
                    userList: req.body.params.userList
                }
            }, err => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("更新成功")
                }
            })
        }
    })
    let newversion = [{
        taskId: req.body.params._id,
        name: req.body.params.username,
        version: req.body.params.version1,
        time: req.body.params.time
    }]
    //向数据库更新版本列表-重写 新建文档
    const newVersion = new Version(newversion).save()
    res.send(newVersion)
})


//更新版本列表
router.post('/updateVersion', async (req, res) => {
    // console.log(req.body)
    let newversion = {
        taskId: req.body.params._id,
        version: req.body.params.new_version,
        name: req.body.params.username,
        time: req.body.params.time
    }
    const newVersion = new Version(newversion).save()
    //myRecords
    await User.findByIdAndUpdate(req.body.params.userId, {
        $inc: {
            'myRecords.taskNums': 0.5,
            'myRecords.totalCoins': 5,
            'myRecords.actualCoins': 5,
        }
    }, (err, res) => {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }
    })
    var usercoins = []
    usercoins = [{
        coin: 10,
        type: "+",
        msg: "第一个提交听写任务",
        time: req.body.params.time,
    }]
    await User.findByIdAndUpdate(req.body.params.userId, {
        $addToSet: {
            myCoins: usercoins,
        }
    }, (err, res) => {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }
    })
    res.send(newVersion)

})

//返回当前任务的所有版本
router.get('/allVersions', async (req, res) => {
    const list = await Version.find({
        taskId: req.query._id
    })
    res.send(list)
    console.log(list)
})

//更新文本比较数据
router.post('/updatediff', async (req, res) => {
    await Task.updateOne({
        _id: req.body.params._id
    }, {
        $set: {
            diffList: req.body.params.diffList,
            userList: req.body.params.userList,
            submitted: req.body.params.submitted
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
    res.send("成功")
})

//更改密码
router.post('/resetPw', async (req, res) => {
    await User.updateOne({
        name: req.body.params.name
    }, {
        $set: {
            password: req.body.params.password,
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

//暂时保留
router.post('/tempsave', async (req, res) => {
    await Task.updateOne({
        _id: req.body.params._id
    }, {
        $set: {
            userList: req.body.params.userList,
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

//删除我的任务
router.post('/deleteMyTasks', async (req, res) => {
    await User.updateOne({
        name: req.body.params.username
    }, {
        $set: {
            myTasks: req.body.params.myTasks,
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

//删除我的发布
router.post('/deleteMyPublished', async (req, res) => {
    await User.updateOne({
        name: req.body.params.username
    }, {
        $set: {
            myPublished: req.body.params.myPublished,
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })

    await Task.deleteOne({
        _id: req.body.params.taskId
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

// 更新我的评论数据
router.post('/updateMyComments', async (req, res) => {
    // console.log(req.body.params.myComments)
    await User.updateOne({
        name: req.body.params.reviewer
    }, {
        $set: {
            myComments: req.body.params.myComments
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("我的评论更新成功")
        }
    });
})

//更新评论数据
router.post('/updateComment', async (req, res) => {
    await Task.updateOne({
        _id: req.body.params._id
    }, {
        $set: {
            comments: req.body.params.comments
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

//更新参考版本
router.post('/updateReference', async (req, res) => {
    await Task.updateOne({
        _id: req.body.params._id
    }, {
        $set: {
            reference: req.body.params.reference
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

// 更新User表中的myTask
// 除分配的用户外，根据用户是否参与听写文本提交来决定是否将此任务加入到自己的任务栏
router.post('/updateMyTasks', async (req, res) => {
    await User.findByIdAndUpdate(req.body.params._id, {
        $inc: {
            'myRecords.taskNums': 0.5,
            'myRecords.totalCoins': 2.5,
            'myRecords.actualCoins': 2.5,
        }
    }, (err, res) => {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }
    })
    var usercoins = []
    usercoins = [{
        coin: 5,
        type: "+",
        msg: "提交听写任务",
        time: req.body.params.time,
    }]
    await User.findByIdAndUpdate(
        req.body.params._id, {
            $addToSet: {
                myTasks: req.body.params.myTasks,
                myCoins: usercoins,
            }
        }, err => {
            if (err) {
                console.log("Error:", err)
            } else {
                console.log("myTasks更新成功, Res: ", res)
            }
        })
})

// 获取每个人的版本
router.post('/getVersions', async (req, res) => {
    const list = await Version.find({
        taskId: req.body.params._id
    })
    res.send(list)
})

// 获取分数列表
router.post('/getScoresList', async (req, res) => {
        const list = await Task.find({
            _id: req.query.diffId
        })
        res.send(list)
    }),

    router.post('/updateScoresList', async (req, res) => {
        await Task.updateOne({
            _id: req.body.params._id
        }, {
            $set: {
                scoreList: req.body.params.scoreList,
                techList: req.body.params.techList,
                matchList: req.body.params.matchList,
                averScores: req.body.params.averScores
            }
        }, err => {
            if (err) {
                console.log("Error:", err)
            } else {
                console.log("Task更新成功, Res: ", res)
            }
        })
        res.send("成功")
    }),

    // 更新用户“myTasks”中的分数
    router.post('/updateMyTasksScores', async (req, res) => {
        var userTasks = req.body.params.userTasks
        var list = await User.find({
            _id: req.body.params._id
        }) //req.body.params._id
        var myTasksList = list[0].myTasks
        var index = myTasksList.findIndex(
            (item) => item.taskId === req.body.params.taskId
        );
        if (index == -1) {
            userTasks[userTasks.length - 1].scores = req.body.params.scores
            myTasksList = userTasks
        } else {
            var myTasks = myTasksList[index]
            myTasks.scores = req.body.params.scores
            myTasksList[index] = myTasks
        }
        //按照听写成绩排名，前50% +5金币，前30% +8金币，前10% +10金币
        // var usercoins = []
        // var rank = req.body.params.userRank
        // var a, b, c, d = ""
        // let date = new Date();
        // let time = date.toLocaleString("chinese", {
        //     hour12: false,
        // });
        // if (rank <= 50 & rank > 30) {
        //     usercoins = [{
        //         coin: 5,
        //         type: "+",
        //         msg: "听写排名前50%",
        //         time: time,
        //     }]
        //     a = 2.5, b = 0.5, c = 0, d = 0
        // } else if (rank <= 30 & rank > 10) {
        //     usercoins = [{
        //         coin: 8,
        //         type: "+",
        //         msg: "听写排名前30%",
        //         time: time,
        //     }]
        //     a = 4, b = 0, c = 0.5, d = 0
        // } else if (rank <= 10) {
        //     usercoins = [{
        //         coin: 10,
        //         type: "+",
        //         msg: "听写排名前10%",
        //         time: time,
        //     }]
        //     a = 5, b = 0, c = 0, d = 0.5
        // }
        await User.updateOne({
            _id: req.body.params._id
        }, {
            $set: {
                myTasks: myTasksList,
                // myCoins: usercoins,
            }
        }, err => {
            if (err) {
                console.log("Error:", err)
            } else {
                console.log("myTasks更新成功, Res: ", res)
            }
        })
        // await User.updateMany({ _id: req.body.params._id }, {
        //     $inc: {
        //         'myRecords.totalCoins': a,
        //         'myRecords.actualCoins': a,
        //         'myRecords.rank50s': b,
        //         'myRecords.rank30s': c,
        //         'myRecords.rank10s': d,
        //     }
        // }, (err, res) => {
        //     if (err) {
        //         console.log("Error:" + err);
        //     }
        //     else {
        //         console.log("Res:" + res);
        //     }
        // })
        res.send("成功")
    }),

    // 更新用户“myPublished”中的分数
    router.post('/updateMyPublishedScores', async (req, res) => {
        const list = await User.find({
            _id: req.body.params._id
        })
        const myPublishedList = list[0].myPublished

        const index = myPublishedList.findIndex(
            (item) => item.taskId == req.body.params.taskId
        );
        const myPublished = myPublishedList[index]

        var scoreList = req.body.params.scoreList
        var techList = req.body.params.techList
        var matchList = req.body.params.matchList
        var averScores = req.body.params.averScores
        var configuration = req.body.params.configuration
        var exceedAverNum, pass60, pass60Rate, passAverRate, maxScore, minScore
        var slist = []
        for (var i = 0; i < scoreList.length; i++) {
            slist.push(scoreList[i].scores)
            if (scoreList[i].scores >= averScores) {
                exceedAverNum += 1
            }
            if (scoreList[i].scores >= 60) {
                pass60 += 1
            }
        }
        pass60Rate = Math.round(pass60 / slist.length * 100)
        passAverRate = Math.round(exceedAverNum / slist.length * 100)
        maxScore = Math.max.apply(null, slist)
        minScore = Math.min.apply(null, slist)

        var newMyPublished = {
            taskId: myPublished.taskId,
            videoId: myPublished.videoId,
            deadline: myPublished.deadline,
            authcode: myPublished.authcode,
            userList: myPublished.userList,
            title: myPublished.title,
            label: myPublished.label,
            time: myPublished.time,
            scoreList: scoreList,
            techList: techList,
            matchList: matchList,
            averScores: averScores,
            exceedAverNum: exceedAverNum ? exceedAverNum : 0,
            pass60Rate: pass60Rate ? pass60Rate + "%" : 0,
            passAverRate: passAverRate ? passAverRate + "%" : 0,
            maxScore: maxScore,
            minScore: minScore,
            configuration:configuration
        }

        myPublishedList[index] = newMyPublished
        await User.updateOne({
            _id: req.body.params._id
        }, {
            $set: {
                myPublished: myPublishedList
            }
        }, err => {
            if (err) {
                console.log("Error:", err)
            } else {
                console.log("myPublished更新成功, Res: ", res)
            }
        })
        res.send("成功")
    })

router.post('/updateIsManual', async (req, res) => {
        await Task.updateOne({
            _id: req.body.params._id
        }, {
            $set: {
                isManual: req.body.params.isManual,
                isConfirm: req.body.params.isConfirm,
            }
        })
        res.send("成功")
    }),

    router.post('/updateStuScores', async (req, res) => {
        const list = req.body.params.scoreList
        var taskId = req.body.params.taskId
        for (var i = 0; i < list.length; i++) {
            var name = list[i].name
            var scores = list[i].scores
            var user = await User.find({
                name: name
            })
            var userTasksList = user[0].myTasks
            var taskIndex = userTasksList.findIndex((item) => item.taskId == taskId)

            if (taskId != -1) {
                var targetTask = userTasksList[taskIndex]
                if (targetTask.scores != "") {
                    targetTask.scores = scores
                    userTasksList[taskIndex] = targetTask
                    await User.updateOne({
                        name: name
                    }, {
                        $set: {
                            myTasks: userTasksList
                        }
                    })
                }
            }
        }

        res.send("成功")
    })

    router.post('/updateTasksConfiguration', async (req, res) => {
        await Task.updateOne({
            _id: req.body.params.taskId
        }, {
            $set: {
                configuration: req.body.params.configuration,
            }
        })
        res.send("成功")
    }),
module.exports = router