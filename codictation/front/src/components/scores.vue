<template>
  <div style="margin-top:70px">
    <div style="height: 64px"><Header></Header></div>
    <div class="dashboard-container">
      <!-- <h2>分数展示</h2> -->
      <q-btn
        id="export"
        color="purple"
        label="Export"
        @click="handleDownload()"
      />
      <!-- <el-button type="primary" @click="handleDownload()">导出</el-button> -->
      <!-- <el-button type="primary" @click="goBack()">返回</el-button> -->
      <div
        class="q-pa-md"
        style="max-width: 400px; margin-left: 5%; margin-top: 2%"
      >
        <div class="q-gutter-md">
          <span>Configuration：</span>
          <q-input
            standout="bg-purple text-white"
            v-model="configuration.SMscore"
            label="Total score of SM"
            type="number"
            @blur="checkNum()"
          />
          <q-input
            standout="bg-purple text-white"
            v-model="configuration.timePercentage"
            label="Percentage of time(0.00)"
            type="number"
            
            @blur="checkNum()"
          />
          <q-input
            standout="bg-purple text-white"
            v-model="configuration.timeSpan"
            label="Span of submission time between 2 people(min)"
            type="number"
            @blur="checkNum()"
          />
        </div>
      </div>
      <div style="margin-left: 6%">
        <q-btn
          color="purple"
          label="Preview"
          @click="pre()"
          style="margin-right: 0.5%"
        />
        <q-btn
          color="purple"
          label="Cancel"
          v-if="isPre"
          @click="cancelPre()"
          style="margin-right: 0.5%"
        />
        <q-btn color="purple" label="Save" v-if="isSave" @click="savePre()" />
      </div>

      <div style="margin-left: 5%">
        <div class="q-pa-md" style="width: 350px">
          <q-list bordered separator>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Average score(AS)</q-item-label>
                <q-item-label caption>{{ averScores }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>The number of people passing AS</q-item-label>
                <q-item-label caption>{{ exceedAverNum }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Total number of people</q-item-label>
                <q-item-label caption>{{ scoresData.length }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Pass rate</q-item-label>
                <q-item-label caption>{{ pass60Rate }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Pass AS Rate</q-item-label>
                <q-item-label caption>{{ passAverRate }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Max score</q-item-label>
                <q-item-label caption>{{ maxScore }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Mini score</q-item-label>
                <q-item-label caption>{{ minScore }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <br />
      <div style="position: absolute; top: 17.5%; left: 35%">
        <el-table
          v-loading="loading"
          :data="scoresData"
          style="width: 800px"
          border
          fit
          highlight-current-row
        >
          <el-table-column type="index" label="Index"> </el-table-column>
          <el-table-column prop="name" sortable label="student" />
          <el-table-column
            prop="techScores"
            sortable
            label="Score on modifications(SM)"
          />
          <el-table-column
            prop="matchScores"
            sortable
            label="Score on texts similarity(STS)"
          />
          <el-table-column prop="scores" sortable label="Total score" />
          <el-table-column prop="rank" sortable label="Rank" />
          <el-table-column label="Details">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleCheck(scope.$index, scope.row)"
                >CHECK
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentpage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalData.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX, { WorkSheet } from "xlsx";
import Header from "../components/basic/Header.vue";
const _ = require("loadsh");

var {
  countTechScores,
  countMatchPoints,
  linearReg,
} = require("../countScores.js");

export default {
  data() {
    return {
      name: "",
      diffId: "",
      userId: "",
      averScores: "", //页面显示的平均分
      oAverScores: "", //数据库中的平均分
      oScoresData: [], //根据数据库中内容生成的表格
      scoresData: [], //页面展示的中的表格
      SMscore: "", //数据库中的该任务的偏好设置
      timePercentage: "",
      timeSpan: "",
      configuration: [], //页面展示的该任务的偏好设置
      c: "",
      totalData: [],
      api: "/api",
      matchPoints: 40, //匹配总分
      techList2: [], //参数调整后的技术详情
      matchList2: [], //参数调整后的匹配详情
      scoreList2: [], //参数调整后的分数详情
      averScores2: "", //参数调整后的平均分
      preScoresData: [], //参数调整后的表格

      loading: true,
      isPre: false, //是否预览
      isSave: false, //是否保存
      //页面
      exceedAverNum: "", //超过平均分人数
      pass60Rate: "", //超过60的比率
      passAverRate: "", //超过平均分的比率
      maxScore: "", //最大值
      minScore: "", //最小值

      // 数据库中获取到的值
      oExceedAverNum: "",
      oPass60Rate: "",
      oPassAverRate: "",
      oMaxScore: "",
      oMinScore: "",
      //分页
      pagesize: 5,
      currentpage: 1,
    };
  },
  methods: {
    checkNum(){//对输入数字进行限制
      if(this.configuration.SMscore > 0){
        this.configuration.SMscore = this.configuration.SMscore>100?100:this.configuration.SMscore
      } else {
        this.configuration.SMscore = 0
      }

      if(this.configuration.timePercentage > 0){
        this.configuration.timePercentage = this.configuration.timePercentage>1?1:this.configuration.timePercentage
      } else {
        this.configuration.timePercentage = 0
      }

      if(this.configuration.timeSpan < 0){
        this.configuration.timeSpan = 0
      }

    },
    
    pre() {
      this.loading = true;
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          //获取数据库中内容
          var diffList = res.data[0].diffList;
          var publisher = res.data[0].publisher;
          var submitted = res.data[0].submitted;
          var matchList = res.data[0].matchList;
          //根据页面的参数再次进行计算
          var { ts, fnl } = countTechScores(
            diffList,
            publisher,
            this.configuration.SMscore,
            submitted,
            this.configuration.timePercentage,
            this.configuration.timeSpan
          );
          var matchList2 = matchList;
          for (var i = 0; i < matchList2.length; i++) {
            this.matchPoints = 100 - this.configuration.SMscore;
            matchList2[i].points = Math.round(
              this.matchPoints * matchList2[i].matchRate
            );
          }
          linearReg(matchList2);
          //生成预览表格
          this.formPreData(matchList2, ts, fnl);
          this.$notify({
            title: "",
            message: "Preview successfully",
            position: "bottom-right",
            type: "success",
          });
        });
    },

    formPreData(matchList, techList, fnl) {
      this.scoreList2 = []
      this.techList2 = fnl;
      this.matchList2 = matchList;
      var sum = 0;
      for (var i = 0; i < this.matchList2.length; i++) {
        var name = this.matchList2[i].name;
        var scores = Math.round(techList[name] + this.matchList2[i].points);
        sum += scores;
        this.scoreList2.push({
          name: name,
          techScores: techList[name],
          matchScores: this.matchList2[i].points,
          scores: scores,
        });
      }

      this.scoreList2.sort(this.compare("scores", false));
      
      for (var j = 0; j < this.scoreList2.length; j++) {
        this.scoreList2[j].rank = j + 1;
      }

      this.averScores2 = Math.round(sum / this.matchList2.length);
      //通过已获得数据进行计算，生成表格
      var preScoresData = [];
      for (var i = 0; i < matchList.length; i++) {
        var name = matchList[i].name;
        var points = matchList[i].points;
        var nIndex = this.scoreList2.findIndex((item)=> item.name == name)
        preScoresData.push({
          name: name,
          techScores: techList[name],
          matchScores: points,
          scores: Math.round(techList[name] + points),
          rank:this.scoreList2[nIndex].rank
        });
      }
      this.countDetails(preScoresData, this.averScores2);
      //生成预览
      this.preScoresData = preScoresData;
      this.averScores = this.averScores2;
      this.totalData = this.preScoresData;
      this.scoresData = _.chunk(this.totalData, this.pagesize)[
        this.currentpage - 1
      ];
      this.loading = false;
      this.isPre = true;
      this.isSave = true;
    },

    countDetails(scoresData, averScores) {
      var pass60;
      var slist = [];
      for (var i = 0; i < scoresData.length; i++) {
        slist.push(scoresData[i].scores);
        if (scoresData[i].scores >= averScores) {
          this.exceedAverNum += 1;
        }
        if (scoresData[i].scores >= 60) {
          pass60 += 1;
        }
      }
      this.pass60Rate = Math.round((pass60 / slist.length) * 100);
      this.passAverRate = Math.round((this.exceedAverNum / slist.length) * 100);
      this.pass60Rate = this.pass60Rate ? this.pass60Rate + "%" : 0;
      this.passAverRate = this.passAverRate ? this.passAverRate + "%" : 0;
      this.maxScore = Math.max.apply(null, slist);
      this.minScore = Math.min.apply(null, slist);
    },

    cancelPre() {
      //取消预览
      this.totalData = this.oScoresData;
      this.scoresData = _.chunk(this.totalData, this.pagesize)[
        this.currentpage - 1
      ];
      this.configuration.SMscore = this.SMscore;
      this.configuration.timePercentage = this.timePercentage;
      this.configuration.timeSpan = this.timeSpan;
      this.averScores = this.oAverScores;
      this.exceedAverNum = this.oExceedAverNum;
      this.pass60Rate = this.oPass60Rate;
      this.passAverRate = this.oPassAverRate;
      this.maxScore = this.oMaxScore;
      this.minScore = this.oMinScore;
      this.isPre = false;
      this.isSave = false;
      this.$notify({
        message: "Cancel",
        position: "bottom-right",
      });
    },

    savePre() {
      //更新数据库中内容
      this.$confirm("Save?", "Alert", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true,
      }).then(() => {
        this.$axios.post(this.api + "/updateScoresList", {
          params: {
            _id: this.diffId,
            scoreList: this.scoreList2,
            techList: this.techList2,
            matchList: this.matchList2,
            averScores: this.averScores2,
          },
        });

        this.$axios.post(this.api + "/updateMyPublishedScores", {
          params: {
            _id: this.userId,
            taskId: this.diffId,
            scoreList: this.scoreList2,
            techList: this.techList2,
            matchList: this.matchList2,
            averScores: this.averScores2,
            configuration: this.configuration,
          },
        });

        this.$axios.post(this.api + "/updateStuScores", {
          //保存修改后，对已查看分数的学生的分数进行修改
          params: {
            taskId: this.diffId,
            scoreList: this.scoreList2,
          },
        });

        this.$axios.post(this.api + "/updateTasksConfiguration", {
          //保存修改后，对任务的configuration进行修改
          params: {
            taskId: this.diffId,
            configuration: this.configuration,
          },
        });

        this.isPre = false;
        this.isSave = false;
        this.scoreList2 = []
      });
    },

    formScoresData(matchList, scoreList) {
      //根据已获得数据生成表格
      for (var i = 0; i < matchList.length; i++) {
        var name = matchList[i].name;
        var index = scoreList.findIndex((item) => item.name == name);
        this.oScoresData.push({
          name: name,
          techScores: scoreList[index].techScores,
          matchScores: scoreList[index].matchScores,
          scores: scoreList[index].scores,
          rank: scoreList[index].rank
        });
      }
      //生成预览
      this.totalData = this.oScoresData;
      this.scoresData = _.chunk(this.totalData, this.pagesize)[
        this.currentpage - 1
      ];
      this.loading = false;
    },

    handleDownload() {
      var tableHeader = [
        [
          "Student",
          "Score on modifications(SM)(" + this.configuration.SMscore + ")",
          "Score on texts similarity(STS)(" + this.matchPoints + ")",
          "Total score",
          "Rank"
        ],
      ]; //表头
      var dataList = [];
      this.totalData.forEach((item) => {
        dataList.push([
          item.name,
          item.techScores,
          item.matchScores,
          item.scores,
          item.rank
        ]);
      }); //表数据
      var filename = this.timestamp(); //文件名，以时间命名
      var sheet = "sheet1"; //存在第几个表
      let aoa = [];

      var overview = [];

      overview.push(
        ["Average score(AS)", String(this.averScores)],
        ["The number of people passing AS", String(this.exceedAverNum)],
        ["Total number of people", String(dataList.length)],
        ["Pass rate", String(this.pass60Rate)],
        ["Pass AS rate", String(this.passAverRate)],
        ["Max score", String(this.maxScore)],
        ["Mini score", String(this.minScore)]
      );
      var a = [[], []]; //当a=[[],[]]时相当于空两行

      // aoa的数据格式：[[],[],[],[]]   数组的第一个子数组可以指定为表头  根据情况而定
      aoa = overview.concat(a, tableHeader, dataList);

      let workSheet = XLSX.utils.aoa_to_sheet(aoa);
      let workBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workBook, workSheet, sheet);
      //保存
      XLSX.writeFile(workBook, filename + ".xlsx");
    }, //导出Excel表

    add0(m) {
      return m < 10 ? "0" + m : m;
    },

    timestamp() {
      var time = new Date();
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();

      return (
        y +
        this.add0(m) +
        this.add0(d) +
        this.add0(h) +
        this.add0(mm) +
        this.add0(s)
      );
    }, //生成时间戳

    handleCheck(index, item) {
      var path = "/diff/" + this.diffId + "/scoresStu";
      this.$router.push({ path: path, query: { name: item.name } });
    }, //编辑

    goBack() {
      //返回上一页
      this.$router.go(-1);
    },

    handleSizeChange(val) {
      this.pagesize = val;
      this.scoresData = _.chunk(this.totalData, this.pagesize)[
        this.currentpage - 1
      ];
    }, // 每页查看条数变化
    handleCurrentChange(val) {
      this.currentpage = val;
      this.scoresData = _.chunk(this.totalData, this.pagesize)[
        this.currentpage - 1
      ];
    }, // 当前页码变化

    compare(attr, rev) {
      //第二个参数没有传递 默认升序排列
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = rev ? 1 : -1;
      }
      return function(a, b) {
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
    },
  },

  components: {
    Header,
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.diffId = this.$route.params.diffId;
    //请求数据
    this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
      var myPublished = res.data[0].myPublished;
      this.userId = res.data[0]._id;
      var index = myPublished.findIndex((item) => item.taskId === this.diffId);
      var techList = myPublished[index].techList;
      var matchList = myPublished[index].matchList;
      var scoreList = myPublished[index].scoreList;
      this.averScores = myPublished[index].averScores;
      this.oAverScores = this.averScores;
      this.configuration = myPublished[index].configuration;
      this.SMscore = myPublished[index].configuration.SMscore;
      this.timePercentage = myPublished[index].configuration.timePercentage;
      this.timeSpan = myPublished[index].configuration.timeSpan;
      this.exceedAverNum = myPublished[index].exceedAverNum;
      this.pass60Rate = myPublished[index].pass60Rate;
      this.passAverRate = myPublished[index].passAverRate;
      this.maxScore = myPublished[index].maxScore;
      this.minScore = myPublished[index].minScore;
      this.oExceedAverNum = myPublished[index].exceedAverNum;
      this.oPass60Rate = myPublished[index].pass60Rate;
      this.oPassAverRate = myPublished[index].passAverRate;
      this.oMaxScore = myPublished[index].maxScore;
      this.oMinScore = myPublished[index].minScore;
      this.formScoresData(matchList, scoreList);
    });
    this.$forceUpdate();
  },
};
</script>

<style>
#export {
  position: fixed;
  top: 12%;
  right: 3%;
  padding: 3px 25px;
}
</style>