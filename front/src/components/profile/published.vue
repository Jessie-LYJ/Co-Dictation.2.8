<template>
  <q-page class="q-pa-lg">
    <h3 class="q-my-md">Task List</h3>
    <q-separator insert style="width: 55%" />
    <div
      v-if="myPublished.length > 0"
      class="q-pa-md q-gutter-sm row col-12"
      style="max-width: 100%"
    >
      <div class="col-9">
        <q-list
          bordered
          class="rounded-borders row q-my-sm"
          v-model="currentContent"
          v-for="(item, index) in currentContent"
          :key="index"
        >
          <q-item clickable @click="intoTask(index)" class="col-9">
            <q-item-section avatar>
              <q-checkbox
                v-model="selectedTask"
                :val="item.title"
                color="cyan-7"
                v-if="item.averScores"
              />
            </q-item-section>

            <q-item-section avatar top>
              <q-icon name="send" color="purple" size="28px" />
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
                  {{ item.averScores ? item.averScores : "SCORES" }}
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
      </div>
      <div class="col-3 justify-center q-gutter-md q-px-md q-py-lg">
        <div class="row">
          <q-btn
            class="q-mx-md"
            label="Select All"
            color="purple-5"
            push
            icon="select_all"
            @click="selectAll()"
            style="width: 15em"
          />
        </div>
        <div class="row">
          <q-btn
            class="q-mx-md"
            label="Bulk Download"
            color="purple-5"
            push
            icon="download"
            @click="exportSelectedData()"
            style="width: 15em"
          />
        </div>
      </div>
      <q-pagination
        v-show="myPublished.length > 8"
        v-model="currentpage"
        color="purple-8"
        :max="Math.ceil(myPublished.length / 8)"
        :max-pages="6"
        :page-size="pagesize"
        :current-page.sync="currentpage"
        :boundary-numbers="true"
        :boundary-links="true"
        :direction-links="true"
        :ellipses="true"
        class="fixed-bottom justify-center q-mb-lg"
      >
      </q-pagination>
    </div>

    <div v-else>No task has been published yet...</div>
  </q-page>
</template>

<script>
import XLSX from "xlsx";

export default {
  data() {
    return {
      name: "", //当前用户的用户名
      userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
      api: "/api",
      myPublished: [],
      pagesize: 8,
      currentpage: 1,
      currentContent: [],
      selectedTask: [], // checkbox所选中的 task title
      isAll: false,
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
      this.myPublished = res.data[0].myPublished.reverse();
      this.showCurrent(this.currentpage);
      console.log(this.currentContent);
    });
  },
  methods: {
    // 进入到任务详情页面
    intoTask(index) {
      var diffId = this.currentContent[index].taskId; //任务_id
      var path = "/diff/" + diffId;
      this.$router.push(path);
    },
    // 老师进入该任务各个学生得分情况页面
    startEx(index) {
      var diffId = this.currentContent[index].taskId; //任务_id
      var path = "/diff/" + diffId;
      if (this.currentContent[index].averScores) {
        path = "/diff/" + diffId + "/scores";
      }
      this.$router.push(path);
    },
    showCurrent(cpage) {
      var min = (cpage - 1) * this.pagesize;
      var max = cpage * this.pagesize;
      this.currentContent = this.myPublished.slice(min, max);
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
          var find_result = this.findElem(this.myPublished, "taskId", taskId);
          this.myPublished.splice(find_result, 1);
          this.$axios.post(this.api + "/deleteMyPublished", {
            params: {
              username: this.name,
              myPublished: this.myPublished,
              taskId: taskId,
            },
          });
          this.$axios.post(this.api + "/deleteTitle", {
            params: {
              title: this.myPublished[find_result].title,
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

    exportSelectedData() {
      var workBook = XLSX.utils.book_new();
      for (var i = 0; i < this.myPublished.length; i++) {
        var tableHeader = [
          [
            "Student",
            "Score on modifications(SM)(" +
              this.myPublished[i].configuration.SMscore +
              ")",
            "Score on texts similarity(STS)(" +
              (100 - Number(this.myPublished[i].configuration.SMscore)) +
              ")",
            "Total score",
            "Rank",
          ],
        ]; //表头
        var dataList = [];
        var scoresData = this.myPublished[i].scoreList;
        var taskTitle = this.myPublished[i].title;
        var index = this.selectedTask.findIndex((item) => item == taskTitle);
        if (scoresData != "" && index != -1) {
          scoresData.forEach((item) => {
            dataList.push([
              item.name,
              item.techScores,
              item.matchScores,
              item.scores,
              item.rank,
            ]);
          }); //表数据
          var sheet = this.myPublished[i].title;
          var overview = [];
          overview.push(
            ["Average score(AS)", String(this.myPublished[i].averScores)],
            [
              "The number of people passing AS",
              String(this.myPublished[i].exceedAverNum),
            ],
            ["Total number of people", String(dataList.length)],
            ["Pass rate", String(this.myPublished[i].pass60Rate)],
            ["Pass AS rate", String(this.myPublished[i].passAverRate)],
            ["Max score", String(this.myPublished[i].maxScore)],
            ["Mini score", String(this.myPublished[i].minScore)]
          );

          var aoa = [];
          var a = [[], []]; //当a=[[],[]]时相当于空两行
          aoa = overview.concat(a, tableHeader, dataList);

          var workSheet = XLSX.utils.aoa_to_sheet(aoa);

          XLSX.utils.book_append_sheet(workBook, workSheet, sheet);
          //保存
        }
      }

      var filename = this.timestamp(); //文件名，以时间命名

      XLSX.writeFile(workBook, filename + ".xlsx");
    }, //导出Excel表

    add0(m) {
      return m < 10 ? "0" + m : m;
    },

    timestamp() {
      //生成时间戳
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
    },

    selectAll() {
      //全选
      if (!this.isAll) {
        this.currentContent.forEach((item) => {
          if (item.averScores) {
            this.selectedTask.push(item.title);
          }
        });
        this.selectedTask = Array.from(new Set(this.selectedTask));
      } else {
        this.selectedTask = [];
      }
      this.isAll = !this.isAll;
    },
  },
};
</script>

<style>
.q-item__section.column.q-item__section--top.q-item__section--main.justify-start {
  flex-direction: column;
}
.q-item__section.column.q-item__section--top.q-item__section--main.justify-start {
  justify-content: space-between;
}
i.material-icons.q-icon.notranslate.text-purple {
  margin-top: 0.23em;
}
.q-item__section.column.col-4.gt-sm.q-item__section--top.q-item__section--main.justify-start {
  padding-top: 0.15em;
}
.q-item.q-item-type.row.no-wrap.col-2 {
  margin-top: 0.3em;
}
.q-notifications__list--bottom {
  right: 50px;
  left: auto;
  bottom: 20px;
}
</style>
