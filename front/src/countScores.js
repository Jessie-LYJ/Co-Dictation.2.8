///////////////贡献分/////////////////

//sort函数按照指定属性进行排列
// function compare(property) {
//     return function (a, b) {
//         var value1 = a[property];
//         var value2 = b[property];
//         return value1 - value2;
//     }
// }
function compare(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = rev ? 1 : -1;
    }
    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    };
}

function isRepeat(arr) {//判断第一个人是否提交了两次
    var hash = {}
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i].username
        if (hash[key]) {
            return true
        }
        hash[key] = true
    }
    return false
}

function countTechScores(diffList, publisher, techPoints, submitted, pct, td) {//传入diffList，发布者，技术总分，已提交名单
    var nameList1 = []//每个修改位置对应的名单，以及分值
    var nameList2 = []
    var finalNameList = []
    var techScoreList = {}//统计每个人得到的分数    
    var totalNum1 = 0//所有参与正确修改的人数
    var totalNum2 = 0//
    var finalTotalNum = 0//
    var isPublisher = false

    for (var i = 0; i < diffList.length; i++) {
        var words = diffList[i].words
        for (var j = 0; j < words.length; j++) {
            if (words[j].isedited) {//只针对改过的词
                for (var k = 0; k < words[j].diffs.length; k++) {
                    var isSecond = isRepeat(words[j].diffs[k].names)
                    if (isSecond) {
                        words[j].diffs[k].names.splice(0, 1)
                    }// 若第一名有两次修改记录，去掉第一名第一次的技术分
                }
                var diffs = words[j].diffs
                    .sort(compare("time"))
                    .sort(compare("num"))
                // 1.综合版，最多人的names获得分数名单
                var names = diffs[diffs.length - 1].names
                names = arithPro(names, pct, td)

                var word = null
                if (words[j].isfirst) {//是否是第一版本
                    word = diffs[diffs.length - 1].diff
                } else {
                    word = diffs[diffs.length - 1].diff
                    if (diffs[diffs.length - 1].styleDiff) {
                        word = diffs[diffs.length - 1].styleDiff
                    }
                }

                totalNum1 += names.length
                var sentence = diffList[i].sentences
                sentence = sentence[sentence.length - 1].sentence
                nameList1.push({ "sentence": sentence, "word": word, "stnIndex": i, "wordIndex": j, "names": names, "len": names.length })
                // 2.发布者版，与发布者在同一组names的获得名单
                for (var m = 0; m < diffs.length; m++) {
                    var names = diffs[m].names
                    var pIndex = names.findIndex((item) => item.username == publisher)
                    if (pIndex != -1) {
                        isPublisher = true
                        if (names.length == 1) {
                            names = [{ "name": names[0].username, "percent": 1 }]
                        } else {
                            names = arithPro(names, pct, td)
                        }
                        totalNum2 += names.length
                        var word2 = null
                        if (words[j].isfirst) {//是否是第一版本
                            word2 = diffs[m].diff
                        } else {
                            word2 = diffs[m].diff
                            if (diffs[m].styleDiff) {
                                word2 = diffs[m].styleDiff
                            }
                        }
                        nameList2.push({ "sentence": sentence, "word": word2, "stnIndex": i, "wordIndex": j, "names": names, "len": names.length })
                    }
                }
            }
        }
    }
    if (submitted.findIndex((item) => item == publisher) != -1) {//如果存在发布者版本，则优先发布者版本
        finalNameList = nameList2
        finalTotalNum = totalNum2
        isPublisher = true
    } else {//没有则采用综合版
        finalNameList = nameList1
        finalTotalNum = totalNum1
    }

    finalNameList.sort(compare('len'))//对finalNameList进行排序，从而按照比例，人数越少的词，分值越高，按照倒序给分，从而获得每个词值多少分
    for (var i = 0; i < finalNameList.length; i++) {
        finalNameList[i].points = (techPoints / finalTotalNum * finalNameList[finalNameList.length - (i + 1)].len).toFixed(2)//每个词对应的分值,并保留两位小数
    }
    var errList = {}

    for (var i = 0; i < finalNameList.length; i++) {//给每个人加总的技术分
        var points = Number(finalNameList[i].points)
        names = finalNameList[i].names
        for (var j = 0; j < names.length; j++) {
            if (!techScoreList[names[j].name]) {
                errList[names[j].name] = 1
                techScoreList[names[j].name] = points * Number(names[j].percent)
            } else {
                errList[names[j].name] += 1
                techScoreList[names[j].name] += points * Number(names[j].percent)
            }
        }
    }

    submitted = Array.from(new Set(submitted))

    if (isPublisher) {
        pIndex = submitted.findIndex((item) => item == publisher)
        submitted.splice(pIndex, 1)
    }

    var list = {}
    for (var i = 0; i < submitted.length; i++) {
        if (!list[submitted[i]]) {
            list[submitted[i]] = 0
        }
        list[submitted[i]] = Math.round(techScoreList[submitted[i]])
    }
    console.log(list, finalNameList)
    return { ts: list, fnl: finalNameList }
}

// 技术分的时间比例，每处错误的得分，越往后得到的越少
// 等差数列，公差d = 0.6/所有正确人数,最多扣去60%的分数
// an = 0.4 + (n-1)*d
function arithPro(array, pct, td) {
    var n = array.length
    var nameP = []
    var array2 = []
    var sequence = 0
    for (var i = 0; i < n; i++) {
        if (i == 0) {
            array2.push({ "name": array[i].username, "sequence": sequence })
        } else {
            var time1 = array[i - 1].edittime
            var time2 = array[i].edittime
            if (dateDiff(time1, time2) <= td * 60) {//相差时间
                array2.push({ "name": array[i].username, "sequence": sequence })
            } else {
                sequence += 1
                array2.push({ "name": array[i].username, "sequence": sequence })
            }
        }
    }
    if (array2[array2.length - 1].sequence == 0) {
        d = 0
    } else {
        d = -pct / array2[array2.length - 1].sequence
    }
    for (var i = 0; i < n; i++) {
        var sq = array2[i].sequence
        var an = 1 + sq * d
        nameP.push({ "name": array[i].username, "percent": an })
    }
    return nameP
}

////////////////////////匹配分/////////////////////////////
function termFreqMap(str) {
    var words = str.split(' ');
    var termFreq = {};
    words.forEach(function (w) {
        termFreq[w] = (termFreq[w] || 0) + 1;
    });
    return termFreq;
}

function addKeysToDict(map, dict) {
    for (var key in map) {
        dict[key] = true;
    }
}

function termFreqMapToVector(map, dict) {
    var termFreqVector = [];
    for (var term in dict) {
        termFreqVector.push(map[term] || 0);
    }
    return termFreqVector;
}

function vecDotProduct(vecA, vecB) {
    var product = 0;
    for (var i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}

function vecMagnitude(vec) {
    var sum = 0;
    for (var i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

function cosineSimilarity(vecA, vecB) {
    return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
}

function textCosineSimilarity(strA, strB) {
    var termFreqA = termFreqMap(strA);
    var termFreqB = termFreqMap(strB);

    var dict = {};
    addKeysToDict(termFreqA, dict);
    addKeysToDict(termFreqB, dict);

    var termFreqVecA = termFreqMapToVector(termFreqA, dict);
    var termFreqVecB = termFreqMapToVector(termFreqB, dict);

    return cosineSimilarity(termFreqVecA, termFreqVecB);
}

function textsim(text1, text2) {
    b = textCosineSimilarity(text1, text2);
    return b//匹配度
}

// 技术分的时间比例：最小二乘法（线性散点斜率求法）
// x=第几天
// y=匹配度
// n=总共几天
// y = a+bx
// b等于(∑(Xi*Yi) - n*averX*averY)/(∑(Xi*Xi) - n*averX*averX)
// a通过代入averX，averY,b可求得
function linearReg(array) {
    var x = []
    var y = []
    for (var i = 0; i < array.length; i++) {
        x.push(array[i].day)
        y.push(array[i].matchRate)
    }

    var n = x.length
    var sumXY, sumX2, sumX, sumY, averX, averY
    sumXY = sumX2 = sumX = sumY = averX = averY = 0
    for (var i = 0; i < n; i++) {
        sumXY += x[i] * y[i]
        sumX2 += x[i] * x[i]
        sumX += x[i]
        sumY += y[i]
    }

    averX = sumX / n
    averY = sumY / n

    // 得出匹配分数的增长斜率以及初始值y = a + bx
    var b = (sumXY - n * averX * averY) / (sumX2 - n * averX * averX)
    var a = averY - b * averX

    // 根据时间而降低的匹配分数的斜率b2为-b，再由平均值（averX,averY）求出a2
    var b2 = -b
    var a2 = averY - b2 * averX
    for (var i = 0; i < array.length; i++) {
        if (!b == false) {
            array[i].points = Math.round(array[i].points * (a2 + b2 * array[i].day))
        }
    }
}

// 两个日期之间的间隔秒数
function dateDiff(sDate1, sDate2) {//（开始日期，结束日期）
    var aDate, oDate1, oDate2, iDays;
    time1 = sDate1.split(" ")[1].split(":")
    time2 = sDate2.split(" ")[1].split(":")

    if (sDate1.search('/') != -1) {
        aDate = sDate1.split(" ")[0].split("/");
    } else {
        aDate = sDate1.split(" ")[0].split("-");
    }
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);//转换为Mm-dd-yyyy格式，构造date

    if (sDate2.search('/') != -1) {
        aDate = sDate2.split(" ")[0].split("/");
    } else {
        aDate = sDate2.split(" ")[0].split("-");
    }
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);

    var total1 = Number(time1[0]) * 3600 + Number(time1[1]) * 60 + Number(time1[2])
    var total2 = Number(time2[0]) * 3600 + Number(time2[1]) * 60 + Number(time2[2])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数  
    var total = iDays * 24 * 60 * 60 + total2 - total1 //计算两个日期时间相差的秒数
    return total;
}

var names = []
function countMatchPoints(versionsList, mixVersion, publisher, publishTime, deadline, matchPoints) {//（每个人的版本合集，综合版，发布者，发布时间，截止时间，匹配总分）
    var countMatchScores = []
    var stdVersion = false
    var isFirstPerson = false
    var firstPerson = versionsList[0].name

    for (var i = 0; i < versionsList.length; i++) {//是否存在发布者的版本
        if (versionsList[i].name == publisher) {
            stdVersion = versionsList[i].version
        }
    }
    for (var i = 0; i < versionsList.length; i++) {
        var matchRate = null
        if (stdVersion == false) {
            matchRate = textsim(mixVersion.join(' '), versionsList[i].version)//与当前综合版对比
        } else {
            matchRate = textsim(stdVersion, versionsList[i].version)//与当前发布者版对比
        }

        var day = dateDiff(publishTime, versionsList[i].time)
        if (versionsList[i].name == firstPerson && isFirstPerson == false) {//如果是第一次出现第一个人的版本，则存入，第二次则无视
            countMatchScores.push({ 'name': versionsList[i].name, 'matchRate': matchRate, 'points': Math.round(matchPoints * matchRate), 'day': day })
            isFirstPerson = true
        } else if (versionsList[i].name != firstPerson) {
            countMatchScores.push({ 'name': versionsList[i].name, 'matchRate': matchRate, 'points': Math.round(matchPoints * matchRate), 'day': day })
        }
    }

    var pIndex = countMatchScores.findIndex((item) => item.name == publisher)
    if (pIndex != -1) {
        countMatchScores.splice(pIndex, 1)
    }
    linearReg(countMatchScores)

    var matchScoreList = {}
    for (var i = 0; i < countMatchScores.length; i++) {
        names.push(countMatchScores[i].name)

        matchScoreList[countMatchScores[i].name] = countMatchScores[i].points
    }
    // return matchScoreList
    return { cms: countMatchScores, ms: matchScoreList }
}

module.exports = {
    countTechScores,
    countMatchPoints,
    linearReg
}
