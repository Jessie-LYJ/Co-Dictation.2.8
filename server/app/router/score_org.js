const express = require('express')
const moment = require('moment');
//let time=moment().format('YYYY/MM/DD HH:mm:ss')
const User = require('../model/User')
const Task = require('../model/Task')

const router = express.Router()

router.get('/', function (req, res) {
    res.send('this is a score response!')
})

router.get('/badges',async(req,res)=>{
    const list = await User.findOne({
        name:req.query.name
    })
    console.log(list.myRecords)
    res.send(list.myRecords)
})

router.get('/task',async(req,res)=>{
    const task = await User.find({"myRecords":{$exists:true}},{
        "_id":0,"name":1,"myRecords":1},)
        .sort({"myRecords.taskNums":-1})
        var newArr = []
        task.map(function(item,index){
            var rank = {}   
            rank['rank'] = index + 1;
            rank['name'] = item.name;
            rank['taskNums'] = item.myRecords.taskNums;
            newArr.push(rank)
        })       
    console.log(newArr)
    res.send(newArr)
})

router.get('/coin',async(req,res)=>{
    const coin = await User.find({"myRecords":{$exists:true}},{
        "_id":0,"name":1,"myRecords":1},)
        .sort({"myRecords.totalCoins":-1})
        var newArr = []
        coin.map(function(item,index){
            var rank = {} 
            rank['rank'] = index + 1;   
            rank['name'] = item.name;
            rank['totalCoins'] = item.myRecords.totalCoins;
            newArr.push(rank)
        })       
    console.log(newArr)
    res.send(newArr)
})

router.get('/taskList', async (req, res) => {
    const list = await Task.find({},{"_id":0,"title":1,"authcode":1,"label":1,"time":1})
    res.send(list)
    console.log(list)
})

router.post("/addlike",async (req, res) =>{
    const list = req.body.params
    console.log(list)
    console.log("addlikelist") 
    const old = await Task.find({_id: list._id},{"_id":0,"comments":1})
    const newArr = old[0]
    for(var i = 0; i < newArr.comments.length; i++){
        if (newArr.comments[i].time == list.comTime){ //时间不是唯一值，可能要考虑换
            console.log("aaaaaaa")
            console.log(newArr.comments[i].time == list.comTime)
            if(newArr.comments[i].likeName){
            const isName = newArr.comments[i].likeName.findIndex((item) => item == list.name)
            console.log(isName)
            if(isName == -1){
                newArr.comments[i].likeName.push(list.name)
                console.log("aaaaaaa")
                newArr.comments[i].likeNum++
                console.log("bbbbbbb")
            } 
            }else{
                newArr.comments[i].likeName=[]
                newArr.comments[i].likeNum=0
                newArr.comments[i].likeName.push(list.name)
                newArr.comments[i].likeNum++
            }      
    }
}
    await Task.updateOne({'_id':list._id},{$set:{'comments':newArr.comments}})

    res.send(newArr.comments)
})

router.get('/taskList', async (req, res) => {
    const list = await Task.find({},{"_id":0,"title":1,"authcode":1,"label":1,"time":1})
    res.send(list)
    console.log(list)
})

router.post("/removelike",async (req, res) =>{
    const list = req.body.params
    const old = await Task.find({_id: list._id},{"_id":0,"comments":1})
    const newArr = old[0]
    for(var i = 0; i < newArr.comments.length; i++){
        if (newArr.comments[i].time == list.comTime){ //时间不是唯一值，可能要考虑换
            // console.log("aaaaaaa")
            // console.log(newArr.comments[i].time == list.comTime)
            if(newArr.comments[i].likeName){
            const isName = newArr.comments[i].likeName.findIndex((item) => item == list.name)
            // console.log(isName)
            if(isName == -1){
                // console.log(isName)
            }else{
                newArr.comments[i].likeName.splice(isName,1)
                newArr.comments[i].likeNum--
            }
            }      
    }
}
    await Task.updateOne({'_id':list._id},{$set:{'comments':newArr.comments}})
    
    res.send(newArr.comments)
})

router.post('/addWrongList', async(req,res) => {
    console.log(req.body.params)
    await User.updateOne({
        name: req.body.params.name
    }, {
        $addToSet: {
            myWrongLists: req.body.params.wrongLists,
        }
    }, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("更新成功")
        }
    })
})

router.post('/updateRank',async(req, res)=>{
    console.log(req.body)
    console.log(req.body.params)
    console.log("updatemyrank")
    console.log(req.query)
    console.log(req)
    res.send("更新成功")

})

router.get('/ranklist',async(req,res)=>{
    const list = await Task.find({"_id":req.query.diffId},{"_id":0,"diffList":1,"techList":1,"scoreList":1,})
    const diffList = list[0].diffList
    const techList = list[0].techList
    const scoreList = list[0].scoreList
    var a = []
    var b = []
    var c=[]
    for (var i = 0; i < diffList.length; i++) {
        var sentenceDiffs = diffList[i].sentenceDiffs;
        for (var j in sentenceDiffs){
            name = sentenceDiffs[j].provider
            stn = sentenceDiffs[j].sentenceDiff
            index = i
            b.push({name,stn,index})
        } 
        a.push({sentenceDiffs})
    }
        var c = []
        b.forEach(el => {
        var oldObj = {
        name: el.name,
        stns:[]
        }
        var stnObj = {
        stn: el.stn,
        index: el.index,
        stnScore: 0
        }
        oldObj.stns.push(stnObj)
        c.push(oldObj)
        })

        var newData = []
        var newObj = {}
        c.forEach((el, i) => {
          if (!newObj[el.name]) {
            newData.push(el);
            newObj[el.name] = true;
          } else {
            newData.forEach(el => {
              if (el.name === c[i].name) {
                el.stns = el.stns.concat(c[i].stns);
              }
            })
          }
        })

        for(var k = 0; k < newData.length; k++){
            var stns = newData[k].stns
            for(var j = 0; j < stns.length; j++){
                for(var i = 0; i < techList.length; i++){
                    if(stns[j].index==techList[i].stnIndex){
                        var names = techList[i].names
                        var isName =names.findIndex((item)=>item.name == newData[k].name)
                        if(isName != -1){
                            stns[j].stnScore +=techList[i].points*names[isName].percent
                        }
                    }
                }
            }
        }
var d=[]
        for(var k = 0; k < newData.length; k++){     
            for(var j = 0; j < scoreList.length; j++){
                if(newData[k].name == scoreList[j].name){

                    var rank = scoreList[j].rank
                    var scores = scoreList[j].scores
                    var techScores = scoreList[j].techScores
                    var matchScores = scoreList[j].matchScores
                    var stn = newData[k].stns
                    var name = newData[k].name
                    d.push({name,rank,scores,techScores,matchScores,stn})
                }
            }
        }

    res.send(d)

})


router.post('/daka',async(req, res) =>{
    const list = req.body.params
    var daka = []
    daka = [{
        time: list.time,
        date: list.date,
    }]
    await User.updateMany({name:list.name}, { $addToSet: { 
        myDakas: daka
     } }, (err, res) => {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })

})

 router.get('/getdaka',async(req, res) =>{
    const list = await User.find({"name":req.query.name},{"_id":0,"myDakas":1})
    res.send(list[0])
})

router.get('/studyRecord',async(req, res) => {
    const list = await User.find({"name":req.query.name},{"_id":0,"myStudyRecords":1})
    res.send(list[0].myStudyRecords)
})

router.get('/wrongList', async (req, res) => {
    console.log(req.body.params)
    console.log(req.query)
    const list = await User.find({"name":req.query.name},{"_id":0,"myWrongLists":1})
    res.send(list[0])
    console.log(list[0])
})

router.post('/updateStudyTime',async (req, res) =>{
    console.log("updatestudytime")
    console.log(req.query)
    console.log(req.body.params)
    var studyRecords = []
    studyRecords = [{
        listenTime: req.body.params.listenTime,
        recordTime: req.body.params.recordTime,
    }]
    await User.findByIdAndUpdate(req.body.params._id, { $addToSet: { 
        myStudyRecords: studyRecords
     } }, (err, res) => {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })

})


//造一些数据
router.post('/test',async(req,res)=>{
    await User.updateMany({name:req.query.name}, {$set:{
        'myRecords.taskNums': 21,  
        'myRecords.totalCoins':123,
        'myRecords.actualCoins':123, 
        'myRecords.rank50s': 10,
        'myRecords.rank30s': 10, 
        'myRecords.rank10s': 5,      
    } }, (err, res) => {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
    res.send("success")
})

module.exports = router