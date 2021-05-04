var express = require('express');
var fs = require("fs");
var os = require("os");
const Task = require('../model/Task')

const router = express.Router()

router.get('/name', callName)

function callName(req, res) {
    var spawn = require("child_process").spawn
    var process = spawn('python', [".\\app\\router\\hello.py",
                                    'Viola',
                                    'Ho'])
    
    process.stdout.on('data', function (data) {
        console.log(data.toString())
        res.send(data.toString())
    })

    process.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

}

router.post("/splitVideo",async (req, res) =>{

    // console.log(req.body.params)
    var argv = req.body.params.fileName
    var data = req.body.params.sentences;
    var videoId = req.body.params.videoId;
    var  list = await Task.find({videoId:videoId},{"_id":0,"diffList":1})

    var fileName = argv.split(".")[0]+".txt"
    var filePath = "D:\\folder\\audios\\"+fileName
    var readDir = fs.readdirSync("D:\\folder\\audios\\");
    var num = readDir.findIndex(function (item) {
        return item === fileName
    })

 if(num == -1){
     //num ==-1 没有该文件,将数组逐行append入txt文件中
       for(var i=0;i<data.length;i++){
                fs.appendFileSync(filePath,data[i]+os.EOL);
                // console.log("write success")
            }
 }else{
     // 更新版本，该文件存在，先删除原文件，然后重新写入
    fs.unlinkSync(filePath)
    for(var i=0;i<data.length;i++){
        fs.appendFileSync(filePath,data[i]+os.EOL);
        // console.log("append success")
    }
 }

    var spawn = require("child_process").spawn
    var process = spawn('python', ["D:\\folder\\test.py",argv])

    process.stdout.on('data', function (data) {
        console.log(data.toString())
        process.kill() 
    })

    process.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        getResult()
        console.log("next step2")
    });

function getResult(){
var srtName = argv.split(".")[0]+'.srt'
console.log(srtName)
    var srtDir = fs.readdirSync("D:\\folder\\output\\");
    console.log(srtDir)
    var isSplit = srtDir.findIndex(function (item) {
        return item === srtName
    })
    console.log(isSplit)
    var result = []
    var result2 = []
    if(isSplit == -1){
        res.send("Split failed")
    }else{
        var srtPath = "D:\\folder\\output\\"+srtName
        fs.readFile(srtPath, (err, buffer) => {
            if(err) {
              console.log(err)
            }else {
            //split 去除空行
              result = buffer.toString().split(/[\r\n]/)
            //splice 去除空值
              for(var i = 0;i<result.length;i++){
                    if(result[i] == ""){
                        result.splice(i,1);
                            i= i-1; 
                        }       
              }
            //处理成对象数组
              var obj = []
              for(var i = 0;i<result.length-1;i=i+3){
                var a={}
                    a={
                        "index":result[i],
                        "sTime":result[i+1].split(' --> ')[0],
                        "eTime":result[i+1].split(' --> ')[1],
                        "optimal":result[i+2],
                    }
                    obj.push(a)
                    a={}   
              }
              //将obj写入difflist里面
              var newdiffList = list[0].diffList.map((item,index) => {
                return {...item, ...obj[index]};
              });

         Task.updateOne({
             videoId:videoId
            },{
                $set:{
                    diffList:newdiffList,
                }
            }, err => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("更新成功")
                }
            })  
        // console.log(newdiffList[0])
              
            }
          })
    }


}

    
})




module.exports = router


