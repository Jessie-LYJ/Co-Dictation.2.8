<template>
  <div class="main-body" style="margin-top:70px">
    <div style="height: 64px"><Header></Header></div>
    <br />
    <div class="dashboard-container">
      <div class="div1">
        <q-table
          title="Score Details"
          :data="details"
          :columns="columns"
          row-key="score1"
          hide-pagination
        />
      </div>
      <div class="div3">
        <q-card bordered class="bg-purple-1 my-card">
          <q-card-section>
            <div class="text-h6" v-if="name == username">My Version</div>
            <div class="text-h6" v-else>Student: {{ name }}</div>
          </q-card-section>
    <!-- <p>{{this.filename}}</p> -->
          <q-separator inset />

          <q-card-section>
            <span v-for="(sen, index) in stnDiff" :key="index">
              <span
                v-for="(word, wordIndex) in sen.words"
                :key="wordIndex"
                @click="showAll($event, wordIndex, index)"
                :class="{ active: isActive }"
              >
                <el-badge class="badge">
                  <span
                    v-if="
                      regtest.test(word) &&
                      techList.findIndex((item) => item.word == word) != -1
                    "
                    v-html="word"
                    style="background-color: #ffffbb"
                  >
                  </span>
                  <span
                    v-else-if="
                      regtest.test(word) &&
                      techList.findIndex((item) => item.word == word) == -1
                    "
                    v-html="word"
                  >
                  </span>
                  <span v-else>
                    {{ word }}
                  </span>
                </el-badge>
              </span>
            </span>
          </q-card-section>
        </q-card>

        <div id="wordOperate" ref="main">
          <a class="aui_close" @click="closeShow()">×</a>
          <el-table :data="tableData" class="eltable">
            <el-table-column
              type="String"
              prop="diff"
              label="Different versions"
              width="200"
            >
              <template slot-scope="scope">
                <span v-html="scope.row.diff"></span>
              </template>
            </el-table-column>
            <el-table-column prop="names" label="Student" width="380">
              <template slot-scope="scope">
                <span v-for="(item, i) in scope.row.names" :key="i">
                  <span
                    v-if="item.username == submitted[0]"
                    style="font-weight: bold"
                    >{{ item.username + "; " }}</span
                  >
                  <span v-else>{{ item.username + "; " }}</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="isScoresData" style="margin-top: 5px">
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              label="Score details of SM"
            >
              <q-card>
                <q-card-section>
                  <el-table :data="scoresData" class="eltable">
                    <el-table-column prop="ra" label="Correct answer">
                      <template slot-scope="scope">
                        <span v-html="scope.row.ra"></span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="op" label="Your score"> </el-table-column>
                    <el-table-column prop="tp" label="Points"> </el-table-column>
                    <el-table-column prop="accry" label="Accuracy">
                    </el-table-column>
                  </el-table>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>

          <div>
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              label="Current sentence"
              style="margin-bottom:7px;"
            >
              <q-card>
                <q-card-section>
                  <p v-html="stnSenDiffs.stnSenDiffs" style="font-size:16px; line-height: 1.5em"></p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-btn color="purple" label="Add to Mistakes" @click="addWronglist()" />
            <el-col :span="8">
              
              <el-autocomplete
                class="inline-input"
                v-model="state1"
                :fetch-suggestions="querySearch"
                placeholder="Annotation"
                @select="handleSelect"
              ></el-autocomplete>
            </el-col>
          </div>
        </div>
      </div>
      <!-- v-if="isEcharts" -->
      <div class="div0">
        <q-card v-if="isEcharts2">
          <q-card-section>
            <div class="col-12">
              <div class="q-px-sm q-mb-md">
                <q-card flat class="no-border-radius text-grey-9">
                  <q-card-section class="row items-center chart-bar">
                    <q-item-label
                      class="col q-gutter-sm text-left row chart-title"
                    >
                      <q-avatar
                        color="purple-1"
                        size="lg"
                        text-color="purple"
                        class="q-mr-sm"
                        icon="insights"
                      ></q-avatar>
                      <div class="text-h6 text-weight-bold">
                        「　Score line Chart 」
                      </div>
                    </q-item-label>
                    <q-item-label class="col q-gutter-sm text-right">
                      <q-select
                        standout="bg-purple-7 text-white"
                        color="purple"
                        label="Range of Choice"
                        v-model="labelSelected"
                        :options="options"
                        class="float-right"
                        style="min-width: 240px"
                        @change="formEcharts(labelSelected)"
                      >
                        <template v-slot:prepend>
                          <q-icon name="date_range" />
                        </template>
                      </q-select>
                    </q-item-label>
                    <div class="row q-pa-md chart-box">
                      <q-item-label
                        class="col-md-10 col-md-12 q-mb-md"
                        :class="{ 'q-pr-md': $q.screen.gt.sm }"
                      >
                        <div class="q-mt-none">
                          <div
                            id="eChartsContainer"
                            style="height: 225px; width: 700px"
                          ></div>
                        </div>
                      </q-item-label>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- <div > -->
      <!-- <h5 v-if="isEcharts">成绩变化趋势：</h5> -->
      <!-- <div class="div0">
          <select
            v-model="labelSelected"
            v-if="isEcharts"
            style="
              font-size: 50%;
            "
            class="form-control"
            id="selected"
            name="label"
            @change="formEcharts(labelSelected)"
          >
            <option disabled="disabled" value="">--选择范围--</option>
            <option value="all">全部</option>
            <option value="10">最近10个</option>
            <option value="30">最近30个</option>
            <option value="60">最近60个</option>
          </select>
          <div
            id="eChartsContainer"
            style="height: 200%; margin-top: 20px"
          >
          </div>        
        </div> -->
      <!-- </div> -->
    </div>

    <div class="div2">
      <!-- <div class="q-pa-md"> -->
      <q-table
        title="Leader Board"
        :data="rankData"
        :columns="columns2"
        row-key="name"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :pagination.sync="pagination"
        hide-pagination
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="accent"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
            <q-td v-for="col in props.cols" :key="col.scores" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <el-table
                  :data="props.row.stn"
                  height="200"
                  border="true"
                  width="100%"
                  :row-style="{ height: 0 + 'px' }"
                  :cell-style="{ padding: 0 + 'px' }"
                >
                  <el-table-column prop="stn" label="Sentence">
                    <template slot-scope="scope">
                      <div v-html="scope.row.stn"></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stnScore"
                    label="Score"
                    width="84%"
                    align="center"
                  ></el-table-column>
                </el-table>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row justify-center q-mt-md">
        <q-pagination
          v-model="pagination.page"
          color="purple-7"
          :max="pagesNumber"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/basic/Header.vue";
var echarts = require("../echarts.min.js");

const stringOptions = [
  { value: "New word" },
  { value: "Reduction" },
  { value: "Loss of plosion" },
  { value: "Liaison" },
  { value: "Misspelling" },
  { value: "Similar words" },
];

export default {
  data() {
    return {
      name: "", //当前查询用户
      username: "", //当前登录用户
      title:"",
      filename:"",
      diffId: "",
      averScores: "",
      sIndex: "", //学生对应在数组中的index
      techList: [],
      matchList: [],
      scoreList: [],
      detailData: [], //tree列表
      diffList: [],
      submitted: [],
      totalLen: null, //总共提交的人数
      api: "/api",
      defaultProps: {
        children: "children",
        label: "label",
      },
      stnDiff: [],
      regtest: /[<ins>|<del>|<subins>]/g,
      isActive: false,
      seen: false,
      tempindex: 0,
      current: 0,
      stnSenDiffs: {},
      tableData: [],
      scoresData: [],
      isScoresData: false,
      ownPoints: "", //用户得分
      totalPoints: "", //总分
      accuracy: 100 + "%", //正确率
      rightAnswer: "",
      restaurants: stringOptions,
      state1: "",
      myPublished: [],
      isEcharts: false,
      isEcharts2: true,
      labelSelected: "",
      rankData: [],
      columns: [
        {
          name: "score1",
          required: true,
          label: "Modifications",
          align: "center",
          field: (row) => row.score1,
        },
        { name: "score2", align: "center", label: "Texts similarity", field: "score2" },
        { name: "score3", align: "center", label: "Total score", field: "score3" },
        {
          name: "score4",
          align: "center",
          label: "Average score",
          field: "score4",
        },
        { name: "rank", align: "center", label: "Rank", field: "rank" },
      ],
      details: [],
      columns2: [
        {
          name: "rank",
          required: true,
          label: "Rank",
          align: "center",
          field: (row) => row.rank,
        },
        { name: "name", align: "center", label: "User", field: "name" },
        { name: "scores", align: "center", label: "Scores", field: "scores" },
      ],
      pagination: {},
      labelSelected: "",
      options: [
        { label: "All", value: "all" },
        { label: "Last 10 tasks", value: "10" },
        { label: "Last 20 tasks", value: "20" },
        { label: "Last 40 tasks", value: "40" },
      ],
    };
  },
  computed: {
    pagesNumber() {
      return Math.ceil(this.rankData.length / this.pagination.rowsPerPage);
    },
  },
  methods: {
    //错题本
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    handleSelect(item) {
      console.log(item);
    },
    addWronglist() {
      var wrongList = [];
      wrongList.push({
        type: this.state1,
        sentence: this.stnSenDiffs.stnSenDiffs,
        sTime:this.stnSenDiffs.sTime,
        eTime:this.stnSenDiffs.eTime,
        diffId: this.diffId,
        filename: this.filename,
        
      });
      //更新错题本
      this.$axios.post("/score/addWrongList", {
        params: {
          name: this.name,
          wrongLists: wrongList,
        },
      });
      this.$notify({
        type: "success",
        message: "success",
        position: "top-right",
        offset: 100,
      });
    },

    findElem(arrayToSearch, attr, val) {
      for (var i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][attr] == val) {
          return i;
        }
      }
      return -1;
    },

    formDetail() {
      for (var i = 0; i < this.diffList.length; i++) {
        var sentenceDiffs = this.diffList[i].sentenceDiffs;
        //add
        var sTime = this.diffList[i].sTime;
        var eTime = this.diffList[i].eTime;
       //
        var s_words = this.diffList[i].words;
        var my_words_diff = s_words
          .map((item) => {
            for (var ele = 0; ele < item.diffs.length; ele++) {
              var name_index = this.findElem(
                item.diffs[ele].names,
                "username",
                this.name
              );
              if (name_index != -1) {
                if (item.diffs[ele].hasOwnProperty("styleDiff")) {
                  return item.diffs[ele].styleDiff;
                } else {
                  return item.diffs[ele].diff;
                }
              }
            }
          })
          .filter((d) => d);
        // console.log("my_words_diff", my_words_diff);
        var stn_df_index = sentenceDiffs.findIndex(
          (item) => item.provider == this.name
        );
        this.stnDiff.push({
          sentence: sentenceDiffs[stn_df_index].sentenceDiff,
          words: my_words_diff,
          sTime:sTime,
          eTime:eTime,
  
          
        });
      }
      // 判断是否有标点符号，如无则加上相应的标点符号
      var reg_end = /\.|\!|\?|\.\"|\.\'|\!\"|\!\'|\?\"|\?\'/g;
      this.stnDiff.forEach((item) => {
        var lastWord = item.words[item.words.length - 1];
        var sen = item.sentence;
        if (/<subins>/g.test(lastWord)) {
          if (
            reg_end.test(
              lastWord.match(/(?<=<subins>).*?(?=<\/subins>)/g)[0].slice(-1)
            ) == false
          ) {
            var punct1 = sen.slice(0, sen.length - 9).slice(-1);
            item.words[item.words.length - 1] = lastWord.replace(
              lastWord.slice(-9),
              punct1 + "</subins>"
            );
          } else if (
            reg_end.test(
              lastWord.match(/(?<=<subins>).*?(?=<\/subins>)/g)[0].slice(-2)
            ) == false
          ) {
            var punct1 = sen.slice(0, sen.length - 9).slice(-2);
            item.words[item.words.length - 1] = lastWord.replace(
              lastWord.slice(-9),
              punct2 + "</subins>"
            );
          }
        } else if (/<ins>|<del>/g.test(lastWord) == false) {
          if (reg_end.test(lastWord.slice(-1)) == false) {
            var punct1 = item.sentence.slice(-1);
            item.words[item.words.length - 1] = lastWord + punct1;
          } else if (reg_end.test(lastWord.slice(-2) == false)) {
            var punct2 = item.sentence.slice(-2);
            item.words[item.words.length - 1] = lastWord + punct2;
          }
        }
      });
    },

    goBack() {
      this.$router.go(-1);
    },

    //卡片
    changePos(event) {
      var wordOperate = document.getElementById("wordOperate");
      wordOperate.style.position = "fixed";
      wordOperate.style.display = "inline-block";
      wordOperate.style.backgroundColor = "white";
      if (event.clientX < window.screen.width / 2) {
        wordOperate.style.left = event.clientX + 5 + "px";
      } else {
        wordOperate.style.left = event.clientX - wordOperate.offsetWidth + "px";
      }

      if (event.clientY > window.screen.height / 2) {
        wordOperate.style.top = event.clientY - wordOperate.offsetHeight + "px";
      } else {
        wordOperate.style.top = event.clientY + "px";
      }
      this.state1 = "";
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    showAll(event, index, s_index) {
      event || (event = window.event);
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true);
      //s_index表示句子序号；index表示单词序号
      this.seen = true;
      this.current = index;
      this.tempindex = index;
      this.isActive = true;

      // 测试占位用，如无用可删
      var senDiff = this.stnDiff[s_index].sentence;
      //add
      var sensTime = this.stnDiff[s_index].sTime;
      var seneTime = this.stnDiff[s_index].eTime;
      //
      var a ={
        "stnSenDiffs":senDiff,
        "sTime" :sensTime,
        "eTime" : seneTime,
      }
      this.stnSenDiffs = a;

      // 展示该错误的所有形式
      var my_words = this.diffList[s_index].words
        .map((item) => {
          for (var ele = 0; ele < item.diffs.length; ele++) {
            var name_index = this.findElem(
              item.diffs[ele].names,
              "username",
              this.name
            );
            if (name_index != -1) {
              return item;
            }
          }
        })
        .filter((d) => d);
      this.tableData = my_words[index].diffs;

      // 展示分数详情
      for (var i = 0; i < this.tableData.length; i++) {
        // 获取每该位置下的每个错误形式
        var diff = this.tableData[i].diff;
        // 判断总错误合集中是否存在该错误，存在则获取其index
        var tIndex = this.techList.findIndex(
          (item) => item.stnIndex == s_index && item.word == diff
        );
        if (tIndex != -1) {
          // 如果存在该错误，则获取对应名单列表，总分
          var names = this.techList[tIndex].names;
          // 获取该处总分
          this.totalPoints = this.techList[tIndex].points;
          // 判断该学生是否在名单列表中，存在则获取其index
          var isName = names.findIndex((item) => item.name == this.name);
          if (isName == -1) {
            this.ownPoints = 0; //如不存在，则该学生在此处得分为零
          } else {
            this.ownPoints = this.totalPoints * names[isName].percent; //存在则计算学生所获得的分数
          }
          // 计算该错误的正确率
          this.accuracy =
            Math.round((names.length / this.totalLen) * 100) + "%";
          this.rightAnswer = this.techList[tIndex].word;
          this.scoresData = [
            {
              ra: this.rightAnswer,
              tp: this.totalPoints,
              op: this.ownPoints,
              accry: this.accuracy,
            },
          ];
          this.isScoresData = true;
          break;
        } else {
          this.scoresData = [];
          this.isScoresData = false;
        }
      }

      this.changePos(event);
      document.addEventListener("click", this.hidePanel, false);
    },
    closeShow() {
      this.seen = false;
      this.current = null;
      this.tempindex = null;
      this.isActive = false;
      var wordOperate = document.getElementById("wordOperate");
      wordOperate.style.display = "none";
      document.removeEventListener("click", this.hidePanel, false);
    },
    hidePanel(e) {
      if (this.$refs.main && !this.$refs.main.contains(e.target)) {
        //点击除弹出层外的空白区域
        this.closeShow();
      }
    },
    compare(key) {
      return function (value1, value2) {
        var val1 = value1[key];
        var val2 = value2[key];
        return val1 - val2;
      };
    },
    formEcharts(labelSelected) {
      var container = document.getElementById("eChartsContainer");
      var myChart = echarts.init(container);
      var xData = [];
      var yData = [];
      for (var i = this.myPublished.length - 1; i >= 0; i--) {
        if (this.myPublished[i].scoreList != "") {
          var index = this.myPublished[i].scoreList.findIndex(
            (item) => item.name == this.name
          );
          if (index != -1) {
            xData.push(this.myPublished[i].title);
            yData.push(this.myPublished[i].scoreList[index].scores);
            if (xData.length == labelSelected) {
              break;
            }
          }
        }
      }
      if (yData.length <= 1) {
        container.remove();
        return;
      } else {
        // 指定图表的配置项和数据
        var option = {
          xAxis: {
            name: "Title",
            type: "category",
            data: xData,
          },
          yAxis: {
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: "#AAAAAA",
                width: 1,
                type: "solid",
              },
            },
          },
          series: [
            {
              data: yData,
              type: "line",
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        this.isEcharts = true;
        
      }
    },
  },
  components: {
    Header,
  },
  created() {
    // this.$router.go(-1);
    if (this.$route.query.name) {
      this.name = this.$route.query.name;
    } else {
      this.name = sessionStorage.getItem("userName");
    }
    this.username = sessionStorage.getItem("userName");
    this.diffId = this.$route.params.diffId;
    this.$axios
      .post(this.api + "/getScoresList?diffId=" + this.diffId)
      .then((res) => {
        this.techList = res.data[0].techList;
        this.matchList = res.data[0].matchList;
        this.scoreList = res.data[0].scoreList;
        this.averScores = res.data[0].averScores;
        this.diffList = res.data[0].diffList;
        this.submitted = res.data[0].submitted;
        this.title = res.data[0].title;
        var fileTitle = res.data[0].title;
        var pIndex = this.submitted.findIndex(
          (item) => item == res.data[0].publisher
        );
        this.submitted.splice(pIndex, 1);
        this.submitted = Array.from(new Set(this.submitted));
        this.totalLen = this.submitted.length;
        this.sIndex = this.scoreList.findIndex(
          (item) => item.name == this.name
        );
        var detail = {
          score1: this.scoreList[this.sIndex].techScores,
          score2: this.scoreList[this.sIndex].matchScores,
          score3: this.scoreList[this.sIndex].scores,
          score4: this.averScores,
          rank: this.scoreList[this.sIndex].rank,
        };
        this.details.push(detail);
        this.formDetail();

      this.$axios.get(this.api+"/fileName?title=" + fileTitle).then((res)=>{
      this.filename = res.data[0].fileName
    })
     
      
      });

    

    this.$axios.get(this.api + "/profile?name=" + this.username).then((res) => {
      this.myPublished = res.data[0].myPublished.reverse();
      this.formEcharts(this.labelSelected);
      if(this.isEcharts == false) {
        this.isEcharts2 = false
      }
    });

    this.$axios.get("/score/ranklist?diffId=" + this.diffId).then((res) => {
      res.data.sort(this.compare("rank"));
      this.rankData = res.data;
      console.log("eiei", this.rankData);
      this.pagination = {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: this.rankData.length,
      };
    });
  },
  mounted() {},
};
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 850px
  font-size: 18px
  margin-left: 6%
  margin-bottom: 5%
</style>

<style>
#q-app {
  overflow: hidden;
}

#eChartsContainer canvas {
  border-radius: 0;
}

.chart-title {
  margin-top: 6px;
}
.chart-bar {
  padding: 1px 1px;
}
.chart-box {
  margin-top: -1.5em;
  margin-bottom: -3em;
}

.scroll {
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.div3 {
  top: 14%;
  left: 3%;
  position: absolute;
}
.div1 {
  top: 14%;
  right: 6%;
  position: absolute;
  /* border: #999 solid 1px; */
  width: 600px;
}
.div2 {
  right: 6%;
  top: 34%;
  position: absolute;
  /* border: #999 solid 1px; */
  width: 600px;
}
.div0 {
  right: -2%;
  top: 90%;
  position: absolute;
  /* border: #999 solid 1px; */
  width: 750px;
}
ins {
  color: green;
  font-weight: bold;
}

subins {
  color: blue;
}

del {
  color: indianred;
}

.badge {
  font-size: 1em;
  padding: 0.25em 0.16em;
  font-weight: normal;
  /* 字体可能得改改 */
}

/* 卡片 */
.active:hover {
  color: rgb(0, 0, 95);
  border-radius: 2px;
  border-bottom: 1px solid black;
}
#wordOperate {
  display: none;
  width: 600px;
  padding: 5px 5px;
  border-radius: 5px;
  transition-duration: 100ms;
  line-height: 100%;
  box-shadow: 0px 0px 7px rgb(143, 141, 141);
  z-index: 10001;
}
.aui_close {
  width: 15px;
  height: 15px;
  line-height: 15px;
  display: block;
  position: absolute;
  right: 10px;
  top: 10px;
  font-family: Helvetica, STHeiti;
  _font-family: "\u9ed1\u4f53", "Book Antiqua", Palatino;
  font-size: 18px;
  border-radius: 20px;
  background: #999;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -moz-transition: linear 0.06s;
  -webkit-transition: linear 0.06s;
  transition: linear 0.06s;
  padding: 0;
  text-align: center;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  z-index: 20;
}
.aui_close:hover {
  width: 17px;
  height: 17px;
  line-height: 17px;
  right: 9px;
  top: 9px;
  color: #fff;
  box-shadow: 0 1px 3px rgba(209, 40, 42, 0.5);
  background: #d1282a;
  border-radius: 24px;
  transition: all 0.2s ease-out;
  text-decoration: none;
  opacity: 0.8;
}
</style>
