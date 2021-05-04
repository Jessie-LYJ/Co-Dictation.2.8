<template>
  <q-page class="q-pa-lg">
    <h3 class="q-my-md">Daily Study Plan</h3>
    <q-separator insert style="width: 55%" />
    <div class="row q-my-md">
      <div class="col-5 q-mx-sm q-pl-lg">
        <h6 class="q-my-md">Set daily study time：</h6>
        <div>
          <q-btn-group>
            <q-btn
              color="purple-4"
              @click="changepro(15)"
              glossy
              label="15 minutes"
            />
            <q-btn
              color="purple-5"
              @click="changepro(30)"
              glossy
              label="30 minutes"
            />
            <q-btn
              color="purple-6"
              @click="changepro(45)"
              glossy
              label="45 minutes"
            />
            <q-btn
              color="purple-8"
              @click="changepro(60)"
              glossy
              label="60 minutes"
            />
          </q-btn-group>
        </div>

        <h6 class="q-mt-xl q-mb-sm">
          Keep track of your milestones:
          <span
            ><strong>{{ Math.floor(this.test1) }}</strong> mins /
            <strong>{{ this.progress }}</strong> mins</span
          >
        </h6>

        <div class="row justify-around q-gutter-sm q-px-md">
          <div class="column justify-center">
            <q-btn
              color="purple"
              icon="today"
              v-if="check"
              @click="Daka()"
              label="Clock In"
            />
            <q-btn
              color="purple"
              icon="today"
              v-else
              :disabled="true"
              label="Plan Fulfilled"
            />
          </div>
          <q-circular-progress
            show-value
            :value="Math.floor((this.test1 / this.progress) * 100)"
            size="90px"
            :thickness="0.2"
            color="purple"
            center-color="grey-3"
            track-color="transparent"
            class="q-mt-sm q-mx-lg"
          >
            {{ Math.floor((this.test1 / this.progress) * 100) }}%
          </q-circular-progress>
        </div>
      </div>

      <div class="col-6 q-mx-md row justify-center">
        <div class="vue-calendar">
          <div class="vue-calendar__title">
            <span>{{ month + 1 }}月 {{ year }}</span>
          </div>
          <div class="vue-calendar__navigation">
            <span class="prev" @click="changeMonth(-1)">&lt;</span
            ><span class="next" @click="changeMonth(1)">&gt;</span>
          </div>

          <div class="vue-calendar__week">
            <ul>
              <li v-for="(day, index) in weekDay" :key="index">{{ day }}</li>
            </ul>
          </div>

          <div class="vue-calendar__main">
            <ul>
              <li v-for="(offset, index) in firstDay" :key="index + 'A'"></li>
              <li
                v-for="(date, index) in monthDate"
                :key="index + 'B'"
                :class="[
                  { today: isNowYearMonthDay(date) },
                  { daka: isDaka(date) },
                  { over: isBeforeToday(date) },
                ]"
              >
                <div class="date">{{ date }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div
      id="eChartsContainer"
      style="height: 330%; margin-left: -3.5em;"
      v-if="isFormData"
    ></div>
    <!-- 徽章 -->

    <q-separator insert class="q-mt-lg" style="width: 90%" />

    <h3 class="q-my-lg">My Badges</h3>
    <q-separator insert style="width: 55%" />

    <div class="row">
      <div class="col-3 column justify-center">
        <h4 class="q-my-md text-center">Persistent Learner</h4>
      </div>

      <div class="container_badge col-9 q-px-md">
        <template v-for="(item, index) in dakaBadges">
          <div :key="item.name" class="pic" :class="{ active: item.isget }">
            <el-popover placement="right" width="250" trigger="hover">
              <el-card style="text-align:center">
                <div>
                  <img
                    :src="require('@/assets/badges/' + item.picName)"
                    style="width:140px; margin:0 auto"
                  />
                  <span v-text="item.name" style="font-weight:bold"></span>
                  <p v-text="item.intro"></p>
                  <p v-text="item.getTime"></p>
                </div>
              </el-card>
              <img
                :src="require('@/assets/badges/' + item.picName)"
                slot="reference"
                class="q-mt-xl"
                style="margin-left: 3em;"
              />
            </el-popover>

            <div v-if="item.state == 0" class="q-mt-md">
              <q-icon name="fmd_bad" class="q-mx-sm" color="grey-5"></q-icon>
              <span style="color: grey">Not Achieved</span>
            </div>
            <q-btn
              v-else-if="item.state == 1"
              @click="unlock('daka', index)"
              color="purple"
              label="UnLock Now"
              size="sm"
              class="q-mt-lg"
            />
            <div v-else class="q-mt-md">
              <q-icon name="verified" class="q-mx-sm" color="green-4"></q-icon>
              <span style="color: green">Achieved</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <q-separator insert class="q-mt-lg" style="width: 90%" />

    <div class="row">
      <div class="col-3 column justify-center">
        <h4 class="q-my-md text-center">Scholar</h4>
      </div>
      <div class="container_badge col-9 q-px-md">
        <template v-for="(item, index) in taskBadges">
          <div :key="item.name" class="pic" :class="{ active: item.isget }">
            <el-popover placement="right" width="250" trigger="hover">
              <el-card style="text-align:center">
                <div>
                  <img
                    :src="require('@/assets/badges/' + item.picName)"
                    style="width:120px; margin:0 auto"
                  />
                  <span v-text="item.name" style="font-weight:bold"></span>
                  <p v-text="item.intro"></p>
                  <p v-text="item.getTime"></p>
                </div>
              </el-card>
              <img
                :src="require('@/assets/badges/' + item.picName)"
                slot="reference"
                class="q-mt-xl"
                style="margin-left: 3em;"
              />
            </el-popover>

            <div v-if="item.state == 0" class="q-mt-md">
              <q-icon name="fmd_bad" class="q-mx-sm" color="grey-5"></q-icon>
              <span style="color: grey">Not Achieved</span>
            </div>
            <q-btn
              color="purple"
              label="UnLock Now"
              v-else-if="item.state == 1"
              @click="unlock('task', index)"
              size="sm"
              class="q-mt-lg"
            />
            <div v-else class="q-mt-md">
              <q-icon name="verified" class="q-mx-sm" color="green-4"></q-icon>
              <span style="color: green">Achieved</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <q-separator insert class="q-mt-lg" style="width: 90%" />

    <div class="row">
      <div class="col-3 column justify-center">
        <h4 class="q-my-md text-center">Perfect Score</h4>
      </div>
      <div class="container_badge col-9 q-px-md">
        <template v-for="(item, index) in scoreBadges">
          <div :key="item.name" class="pic" :class="{ active: item.isget }">
            <el-popover placement="right" width="240" trigger="hover">
              <el-card style="text-align:center">
                <div>
                  <img
                    :src="require('@/assets/badges/' + item.picName)"
                    style="width:120px; margin:0 auto"
                  />
                  <span v-text="item.name" style="font-weight:bold"></span>
                  <p v-text="item.intro"></p>
                  <p v-text="item.getTime"></p>
                </div>
              </el-card>
              <img
                :src="require('@/assets/badges/' + item.picName)"
                slot="reference"
                class="q-mt-xl"
                style="margin-left: 3em;"
              />
            </el-popover>
            <div v-if="item.state == 0" class="q-mt-md">
              <q-icon name="fmd_bad" class="q-mx-sm" color="grey-5"></q-icon>
              <span style="color: grey">Not Achieved</span>
            </div>
            <q-btn
              color="purple"
              label="UnLock Now"
              v-else-if="item.state == 1"
              @click="unlock('score', index)"
              size="sm"
              class="q-mt-lg"
            />
            <div v-else class="q-mt-md">
              <q-icon name="verified" class="q-mx-sm" color="green-4"></q-icon>
              <span style="color: green">Achieved</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script>
var echarts = require("../../echarts.min.js");
export default {
  data() {
    return {
      isFormData: false,
      name: "", //当前用户的用户名
      //userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
      api: "/score",
      Badges: [
        {
          name: "10 Day",
          intro: "daka for 10 days",
          picName: "1.svg",
          getTime: "",
          isget: true,
          state: 0,
        },
        {
          name: "100 Day",
          intro: "daka for 100 days",
          picName: "2.svg",
          getTime: "",
          isget: true,
          state: 0,
        },
        {
          name: "1000 Day",
          intro: "daka for 1000 days",
          picName: "3.svg",
          getTime: "",
          isget: true,
          state: 0,
        },

        {
          name: "newbie scholar",
          intro: "Completed 1 task",
          picName: "4.svg",
          getTime: "",
          isget: true,
          state: 0,
        },
        {
          name: "Seasoned Apprentice",
          intro: "Complete 10 tasks",
          picName: "5.svg",
          getTime: "",
          isget: true,
          state: 0,
        },
        {
          name: "Learning Master",
          intro: "Complete 100 tasks",
          picName: "6.svg",
          getTime: "",
          isget: true,
          state: 0,
        },

        {
          name: "A student",
          intro: "Ranking 50% for 10 times",
          picName: "7.svg",
          getTime: "",
          isget: true,
          state: 0,
        },
        {
          name: "A+ student",
          intro: "Ranking 30% for 10 times",
          picName: "8.svg",
          getTime: "",
          isget: true,
          state: 0,
        },
        {
          name: "A++ student",
          intro: "Ranking 10% for 10 times",
          picName: "9.svg",
          getTime: "",
          isget: true,
          state: 0,
        },
      ],

      dakaBadges: [],
      taskBadges: [],
      scoreBadges: [],

      dakaDays: 0,
      today: "",
      studyre: [],
      test1: 0,
      progress: 15,
      todayTime: "",
      goal: "",
      //打卡按钮
      check: true,

      //calendar
      nowTime: Date.now(),
      year: null,
      month: null,
      nowDate: null,
      weekDay: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      monLeap: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      monNml: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      events: [
        // {
        //   id: 1,
        //   date: "2021-04-10",
        // },
        // {
        //   id: 2,
        //   date: "2021-01-21",
        // },
      ],
    };
  },
  components: {},
  computed: {
    monthDate() {
      const index = this.month;
      return this.year && this.year % 4 === 0
        ? this.monLeap[index]
        : this.monNml[index];
    },
    firstDay() {
      return new Date(this.year, this.month, 1).getDay();
    },
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    console.log(this.name);

    this.$axios.get(this.api + "/getbadges/?name=" + this.name).then((res) => {
      var list = res.data;
      var allLen = this.Badges.length;
      var badgesgot = list.myBadges;
      var userlen = badgesgot.length;

      if (badgesgot !== undefined && userlen !== 0) {
        for (var i = 0; i < allLen; i++) {
          for (var j = 0; j < userlen; j++) {
            if (this.Badges[i].name == badgesgot[j].name) {
              this.Badges[i].getTime = badgesgot[j].getTime;
              this.Badges[i].isget = badgesgot[j].isget;
              this.Badges[i].state = badgesgot[j].state;
            }
          }
        }
      }

      var tasklen = list.myTasks.length;
      var dakalen = list.myDakas.length;
      // var rank10= list.myRecords.rank10
      var rank10 = list.myRecords.rank10;
      var rank30 = list.myRecords.rank30;
      var rank50 = list.myRecords.rank50;

      if (dakalen >= 1000 && this.Badges[2].state == 0) {
        this.Badges[2].state = 1;
      }
      if (dakalen >= 100 && this.Badges[1].state == 0) {
        this.Badges[1].state = 1;
      }
      if (dakalen >= 100 && this.Badges[0].state == 0) {
        this.Badges[0].state = 1;
      }
      if (tasklen >= 1 && this.Badges[3].state == 0) {
        this.Badges[3].state = 1;
      }
      if (tasklen >= 10 && this.Badges[4].state == 0) {
        this.Badges[4].state = 1;
      }
      if (tasklen >= 100 && this.Badges[5].state == 0) {
        this.Badges[5].state = 1;
      }
      if (rank10 >= 10 && this.Badges[8].state == 0) {
        this.Badges[8].state = 1;
      }
      if (rank30 >= 10 && this.Badges[7].state == 0) {
        this.Badges[7].state = 1;
      }
      if (rank50 >= 10 && this.Badges[6].state == 0) {
        this.Badges[6].state = 1;
      }

      this.dakaBadges.push(this.Badges[0], this.Badges[1], this.Badges[2]);
      this.taskBadges.push(this.Badges[3], this.Badges[4], this.Badges[5]);
      this.scoreBadges.push(this.Badges[6], this.Badges[7], this.Badges[8]);
    });

    this.$axios
      .get(this.api + "/studyRecord/?name=" + this.name)
      .then((res) => {
        this.studyre = res.data;
        this.test();
        this.formEcharts();
      });

    this.$axios.get(this.api + "/getdaka/?name=" + this.name).then((res) => {
      console.log(res.data);
      var list = res.data.myDakas;
      //add
      // this.dakaDays = list.length
      const nowDay = this.$moment().format("YYYY-MM-DD");
      list.find((event) => {
        if (event.date == nowDay) {
          this.check = false;
        }
      });
      this.events = list;
    });

    this.$axios.get(this.api + "/badges/?name=" + this.name).then((res) => {
      var records = res.data;
    });
  },
  updated() {},
  mounted() {
    this.initialize();
    this.isDaka();
  },
  methods: {
    //badges
    unlock(type, index) {
      let today = this.$moment(new Date()).format("YYYY-MM-DD");
      var badge;
      if (type == "daka") {
        this.dakaBadges[index].isget = false;
        this.dakaBadges[index].getTime = today;
        this.dakaBadges[index].state = 2;
        badge = this.dakaBadges[index];
      } else if (type == "score") {
        this.scoreBadges[index].isget = false;
        this.scoreBadges[index].getTime = today;
        this.scoreBadges[index].state = 2;
        badge = this.scoreBadges[index];
      } else if (type == "task") {
        this.taskBadges[index].isget = false;
        this.taskBadges[index].getTime = today;
        this.taskBadges[index].state = 2;
        badge = this.taskBadges[index];
      }
      this.$axios.post("/score/addMyBadges", {
        params: {
          name: this.name,
          mybadge: badge,
        },
      });
    },

    changepro(num) {
      this.progress = num;
    },
    test() {
      var arr = this.studyre;
      var arry = [];
      var today = this.$moment(new Date()).format("MM/DD");
      arr.forEach((d) => {
        const recordTime = this.$moment(
          d.recordTime,
          "YYYY/MM/DD hh:mm:ss"
        ).format("MM/DD");
        const listenTime = Math.floor((d.listenTime / 60) * 100) / 100;
        if (recordTime == today) {
          arry.push(listenTime);
        }
      });
      var x = eval(arry.join("+"));
      if (!x) {
        this.test1 = 0;
      } else {
        this.test1 = x;
      }
    },

    //折线图
    formEcharts() {
      var container = document.getElementById("eChartsContainer");
      var myChart = echarts.init(container);
      var xData = [];
      var yData = [];

      //处理数据，1.合并同一个日期的听写时间 2.改变时间样式成MM/DD 3.将具体听写时间转化成分钟
      var arr = this.studyre;
      console.log(arr)
       if(arr.length > 0) {
        this.isFormData = true;
        console.log(this.isFormData)
      };
      var arry = [];
      arr.forEach((d) => {
        const recordTime = this.$moment(
          d.recordTime,
          "YYYY/MM/DD hh:mm:ss"
        ).format("MM/DD");
        const listenTime = Math.floor((d.listenTime / 60) * 100) / 100;
        arry.push({ recordTime, listenTime });
      });
      let newArr = [];
      var temp = {};
      for (var i in arry) {
        var key = arry[i].recordTime;
        if (temp[key]) {
          temp[key].recordTime = temp[key].recordTime;
          temp[key].listenTime = temp[key].listenTime + arry[i].listenTime;
        } else {
          temp[key] = {};
          temp[key].recordTime = arry[i].recordTime;
          temp[key].listenTime = arry[i].listenTime;
        }
      }
      for (var k in temp) {
        newArr.push(temp[k]);
      }

      for (var i = 0; i < newArr.length; i++) {
        if (newArr[i].listenTime != "") {
          xData.push(newArr[i].recordTime);
          yData.push(newArr[i].listenTime);
        }
      }

      var option = {
        xAxis: {
          name: "Date",
          type: "category",
          data: xData,
        },
        yAxis: {
          name: "min",
          type: "value",
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
    },

    initialize() {
      const now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.nowDate = now.getDate();
    },
    isBeforeToday(date) {
      const target = new Date(this.year, this.month, date + 1);
      return target < this.nowTime;
    },
    changeMonth(next) {
      const targetMonth = this.month + next;
      if (targetMonth < 0) {
        this.month = 11;
        this.year--;
      } else if (targetMonth > 11) {
        this.month = 0;
        this.year++;
      } else {
        this.month = targetMonth;
      }
    },
    //isDaka
    isDaka(dayToCheck) {
      const month = this.month + 1;
      const year = this.year;
      var isdaka = "0";
      if (this.events) {
        this.events.find((event) => {
          let eventYear = event.date.split("-")[0];
          let eventDay = event.date.split("-")[2];
          let eventMonth = event.date.split("-")[1].slice(1);
          if (
            dayToCheck == eventDay &&
            eventMonth == month &&
            eventYear == year
          ) {
            isdaka = "1";
          }
        });
      }
      if (isdaka == "1") {
        return true;
      } else {
        return false;
      }
    },

    isNowYearMonthDay(date) {
      const now = new Date();
      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth();
      const nowDay = this.$moment().format("D");
      if (this.year === nowYear && this.month === nowMonth && date == nowDay) {
        console.log("aaaaaaa" + date + nowDay);
      }
      return this.year === nowYear && this.month === nowMonth && date == nowDay;
    },
    Daka() {
      var goal = this.test1 / this.progress;
      if (goal >= 1) {
        const name = this.name;
        const time = this.test1;
        const date = this.$moment(new Date()).format("YYYY-MM-DD");
        this.$axios.post(this.api + "/daka", {
          params: {
            name: name,
            time: time,
            date: date,
          },
        });
        console.log("success" + date + time);
        this.events.push({ time: time, date: date });
        this.check = false;
        this.dakaDays = this.dakaDays + 1;
      } else if (goal < 1) {
        this.$notify({
          // title: "警告",
          type: "warning",
          message: "You have not fulfilled your plan!",
          position: "top-right",
          offset: 100,
        });
      }
    },
  },
};
</script>

<style>
.progress {
  width: 50rem;
}

img {
  display: block;
  width: 160px;
  height: 130px;
}

.pic.active {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.container_badge {
  display: inline-grid;
  grid-template-columns: 250px 250px 250px;
  grid-template-rows: 250px;
}

.pic {
  text-align: center;
  /* border: 1px solid #e5e4e9; */
}

/* calendar css-code */
body {
  -webkit-font-smoothing: antialiased;
  font-family: "Montserrat", sans-serif;
  text-rendering: optimizeLegibility;
}

.vue-calendar {
  position: relative;
  max-width: 320px;
  border-radius: 5px;
  overflow: hidden;
  padding: 9px;
  background-color: #f8fafa;
  -moz-box-shadow: 0px 15px 15px rgba(32, 23, 23, 0.09);
  -webkit-box-shadow: 0px 15px 15px rgba(32, 23, 23, 0.09);
  box-shadow: 0px 15px 15px rgba(32, 23, 23, 0.09);
}
.vue-calendar ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}
.vue-calendar ul li {
  width: calc(100% / 7);
  text-align: center;
}
.vue-calendar__title {
  text-align: center;
  margin: 10px 0;
  color: #222741;
  font-size: 20px;
  font-weight: 700;
}
.vue-calendar__title h3,
.vue-calendar__title p {
  margin: 0;
}
.vue-calendar__navigation {
  position: absolute;
  width: 100%;
  top: 10px;
}
.vue-calendar__navigation span {
  position: absolute;
  display: block;
  font-size: 30px;
  font-weight: 700;
  opacity: 0.6;
  cursor: pointer;
}
.vue-calendar__navigation span:hover {
  opacity: 1;
}
.vue-calendar__navigation span.prev {
  left: 0;
}
.vue-calendar__navigation span.next {
  right: 19px;
}
.vue-calendar__week ul li {
  font-weight: 700;
  padding: 10px 0;
  color: #99a4ae;
}
.vue-calendar__week {
  border-bottom: 2px solid #f2f6f8;
  margin-bottom: 4px;
  justify-content: center;
}
.vue-calendar__main ul {
  flex-wrap: wrap;
}
.vue-calendar__main ul li {
  height: 40px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.3s;
  box-sizing: border-box;
  padding-top: 10px;
  font-style: "Montserrat";
  border: 2px solid transparent;
  border-radius: 50%;
  color: #424588;
  font-size: 12px;
  font-weight: 700;
  /* display: flex; */
  align-items: center;
  justify-content: center;
}
.date {
  font-style: "Montserrat";
}
.vue-calendar__main ul li.today {
  color: #fff;
  background: #bb50ce;
  border-color: #fefefe;
  box-shadow: 0px 2px 2px rgb(0 0 0 / 10%);
}
.vue-calendar__main ul li.over {
  opacity: 0.6;
}

.vue-calendar__main ul li.daka {
  border-radius: 9999px;
  background-color: #75d4c9;
  border-color: #fefefe;
  box-shadow: 0px 2px 2px rgb(0 0 0 / 10%);
  color: #fff;
}
.text-white {
  --tw-text-opacity: 1;
  color: rgba(255, 255, 255, var(--tw-text-opacity));
}
.rounded-full {
  border-radius: 9999px;
}
.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgba(37, 99, 235, var(--tw-bg-opacity));
}
.vue-calendar__main ul li:not(.today):not(.over):hover {
  background: #ffa258;
  border-color: #fefefe;
  box-shadow: 0px 2px 2px rgb(0 0 0 / 10%);
  color: #fff;
}
.vue-calendar__main ul li .text,
.vue-calendar__main ul li .price {
  font-size: 10px;
}
</style>
