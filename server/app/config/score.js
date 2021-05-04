function dateDiff(sDate1, sDate2) {//（开始日期，结束日期）
    var aDate, oDate1, oDate2, iDays;
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
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数  
    return iDays;
}

module.exports = {
    dateDiff
}