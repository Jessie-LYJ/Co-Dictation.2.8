<template>
  <q-page class="q-pa-lg">
    <div class="row" style="width: 90%">
      <h3 class="col-7 q-my-md">My Tasks</h3>
      <h4 class="col-5 q-my-sm text-center justify-center q-pt-md">
        <span class="aver-score" style="font-size:80%">「　Personal average score：{{ stuAverScore?stuAverScore:0 }} 」</span>
      </h4>
    </div>
    <q-separator insert style="width: 65%" class="q-mb-md" />
    <div v-show="showChart">
      <div class="col-12">
        <div class="q-px-sm q-mb-md q-mt-sm">
          <q-card flat class="no-border-radius text-grey-9" style="width: 85%">
            <q-card-section class="row items-center chart-bar">
              <q-item-label class="col q-gutter-sm text-left row chart-title">
                <q-avatar
                  color="purple-1"
                  size="lg"
                  text-color="purple"
                  class="q-mr-sm"
                  icon="insights"
                ></q-avatar>
                <div class="text-h6 text-weight-bold">「　Score line Chart： 」</div>
              </q-item-label>
              <q-item-label class="col q-gutter-sm text-right">
                <q-select
                  standout="bg-purple-6 text-white" 
                  color="purple"
                  label="Range of Choice"
                  v-model="labelSelected"
                  :options="options"
                  class="float-right"
                  style="min-width: 250px"
                  @change="formEcharts(labelSelected)"
                >
                  <template v-slot:prepend>
                    <q-icon name="date_range" />
                  </template>
                </q-select>
              </q-item-label>
            </q-card-section>
            <div class="row chart-box">
              <q-item-label
                class="col-md-10 col-xs-12 q-mb-sm"
                :class="{ 'q-pr-md': $q.screen.gt.sm }"
              >
                <div class="q-mt-none">
                  <div
                    id="eChartsContainer"
                    style="height: 240%;"
                  ></div>
                </div>
              </q-item-label>
              <q-separator insert style="width: 95%" />
            </div>
          </q-card>
        </div>
      </div>
    </div>
    
    <div
      v-if="myTasks.length > 0"
      class="q-px-md q-py-sm q-gutter-sm"
      style="max-width: 85%;"
    >
      <q-list
        bordered
        class="rounded-borders row"
        style="max-width: 95%"
        v-model="currentContent"
        v-for="(item, index) in currentContent"
        :key="index"
      >
        <q-item clickable @click="intoTask(index)" class="col-9">
          <q-item-section avatar top>
            <q-icon name="assignment" color="purple" size="28px" />
          </q-item-section>

          <q-item-section top class="col-4 gt-sm">
            <q-item-label class="q-mt-sm">{{ item.title }}</q-item-label>
          </q-item-section>

          <q-item-section top>
            <q-item-label caption lines="1">
              <span class="text-grey">Release Date: {{ item.time }}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              <span class="text-purple-9">Deadline: {{ item.deadline }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="col-2">
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                class="gt-xs"
                size="14px"
                flat
                dense
                @click="startEx(index)"
              >
                {{ item.scores ? item.scores : "SCORE" }}
              </q-btn>
            </div>
          </q-item-section>
        </q-item>

        <q-item class="col-1">
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                class="gt-md text-red-9"
                size="16px"
                flat
                round
                dense
                icon="delete_forever"
                @click="deleteTask(item.taskId)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-pagination
        v-show="myTasks.length > 7"
        v-model="currentpage"
        color="purple-8"
        :max="Math.ceil(myTasks.length / 7)"
        :max-pages="3"
        :page-size="pagesize"
        :current-page.sync="currentpage"
        :boundary-numbers="true"
        :boundary-links="true"
        :direction-links="true"
        :ellipses="true"
        class="fixed-bottom-right q-mb-lg q-mr-lg"
      >
      </q-pagination>
    </div>

    <div v-else>No dictation task yet...</div>
  </q-page>
</template>

<script>
var echarts = require("../../echarts.min.js");

export default {
  data() {
    return {
      name: "", //当前用户的用户名
      userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
      api: "/api",
      myTasks: [],
      pagesize: 7,
      currentpage: 1,
      currentContent: [],
      stuAverScore: 0,
      labelSelected: "",
      options: [
        { label: "All", value: "all" },
        { label: "Last 10 tasks", value: "10" },
        { label: "Last 20 tasks", value: "20" },
        { label: "Last 40 tasks", value: "40" },
      ],
      showChart: true,
    };
  },
  watch: {
    currentpage() {
      this.showCurrent(this.currentpage);
    },
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    console.log(this.name);
    this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
      this.userId = res.data[0]._id; //找地方保存
      this.myTasks = res.data[0].myTasks.reverse();
      var totalscore = 0;
      var total = 0;
      for (var i = 0; i < this.myTasks.length; i++) {
        if (this.myTasks[i].scores != "") {
          totalscore += Number(this.myTasks[i].scores);
          total += 1;
        }
      }
      this.stuAverScore = Math.round(totalscore / total);
      this.showCurrent(this.currentpage);
      console.log(this.currentContent);
    });
  },
  updated() {
    this.formEcharts(this.labelSelected);
  },
  methods: {
    showCurrent(cpage) {
      var min = (cpage - 1) * this.pagesize;
      var max = cpage * this.pagesize;
      this.currentContent = this.myTasks.slice(min, max);
    },
    // 进入到任务详情页面
    intoTask(index) {
      var diffId = this.currentContent[index].taskId; //任务_id
      var path = "/diff/" + diffId;
      this.$axios.get(this.api + "/currentTask?_id=" + diffId).then((res) => {
        if (res.data.length == 0) {
          this.$notify({
            type: "warning",
            message: "The task has been deleted.",
            position: "top-right",
            offset: 100,
          });
        } else {
          this.$router.push(path);
        }
      });
    },
    // 学生进入个人分数详情页面
    startEx(index) {
      var diffId = this.currentContent[index].taskId; //任务_id
      var path = "/diff/" + diffId;
      if (this.currentContent[index].scores) {
        path = "/diff/" + diffId + "/scoresStu";
      }
      this.$axios.get(this.api + "/currentTask?_id=" + diffId).then((res) => {
        if (res.data.length == 0) {
          this.$notify({
            type: "warning",
            message: "The task has been deleted.",
            position: "top-right",
            offset: 100,
          });
        } else {
          this.$router.push(path);
        }
      });
    },
    //确定数组里是否有某个元素
    findElem(arrayToSearch, attr, val) {
      for (var i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][attr] == val) {
          return i;
        }
      }
      return -1;
    },
    //删除user-myTasks里面的任务
    deleteTask(taskId) {
      this.$q
        .dialog({
          title: "Confirm Deletion",
          message: "Delete this task permanently?",
          ok: {
            push: true,
          },
          cancel: {
            push: true,
            color: "negative",
          },
          persistent: true,
        })
        .onOk(() => {
          var find_result = this.findElem(this.myTasks, "taskId", taskId);
          this.myTasks.splice(find_result, 1);
          this.$axios.post(this.api + "/deleteMyTasks", {
            params: {
              username: this.name,
              myTasks: this.myTasks,
            },
          });
          this.showCurrent(this.currentpage);
          this.$q.notify({
            progress: true,
            message: "Deleted!",
            color: "purple",
            icon: "auto_delete",
          });
        });
    },

    formEcharts(labelSelected) {
      var container = document.getElementById("eChartsContainer");
      var myChart = echarts.init(container);
      var xData = [];
      var yData = [];
      for (var i = this.myTasks.length - 1; i >= 0; i--) {
        if (this.myTasks[i].scores != "") {
          xData.push(this.myTasks[i].title);
          yData.push(this.myTasks[i].scores);

          if (xData.length == labelSelected.value) {
            break;
          }
        }
      }
      if (yData.length <= 1) {
        container.remove();
        this.showChart = false;
        return;
      } else {
        // 指定图表的配置项和数据
        var option = {
          xAxis: {
            name: "Task title",
            type: "category",
            data: xData,
          },
          yAxis: {
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
      }
    },
  },
};
</script>

<style>
.aver-score, .chart-title .text-h6, h4  {
  font-family: Cambria, "Times New Roman", Times, 　Helvetica, Tahoma, Arial,
    STXihei, “华文细黑”, Heiti, “黑体”, “Microsoft YaHei”, “微软雅黑”, SimSun,
    “宋体”, sans-serif;
}

#eChartsContainer canvas {
  border-radius: 0;
}

.chart-title {
  margin-top: 6px;
}
.chart-bar {
  padding: 3px 16px;
}
.chart-box {
  margin-top: -1em;
}
</style>
