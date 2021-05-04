<template>
  <div class="dashboard-container">
    <div class="filter-container" style="margin: 0 0 10px 0">
      <el-input
        v-model="Qlist.name"
        placeholder="用户名"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="Qlist.status"
        placeholder="身份"
        style="width: 200px; margin-right: 7px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-if="showBack"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="closeFilter"
      >
        返回
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="users"
      style="width: 100%"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="_id" sortable="custom" label="用户_id" />
      <el-table-column prop="stuid" sortable="custom" label="学生_id" />
      <el-table-column prop="name" sortable="custom" label="用户名" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="status" sortable="custom" label="身份" />
      <el-table-column
        label="更多"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findMyPublished(scope.$index, scope.row);
            "
            >用户发布
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findMyTasks(scope.$index, scope.row);
            "
            >用户任务
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findMyComments(scope.$index, scope.row);
            "
            >用户评论
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br />
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="Qlist.pagenum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="Qlist.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 抽屉+树状展示用户列表 -->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="rtl"
      :modal-append-to-body="false"
    >
      <el-tree
        :data="list"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
      <el-scrollbar></el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
const _ = require("loadsh");

export default {
  name: "user",
  data() {
    return {
      api: "/user",
      totalData: [],
      drawerTitle: "",
      users: {},
      Qlist: {
        pagenum: 1, //当前页数
        pagesize: 20,
        name: "",
        status: "",
      },
      total: "",
      showBack: false,
      drawer: false,
      list: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      loading: true,
    };
  },
  mounted() {
    this.findUser();
  },
  methods: {
    onSubmit() {
      console.log(123434);
    },
    findUser() {
      this.$axios.post(this.api + "/find").then((res) => {
        this.users = _.chunk(res.data, this.Qlist.pagesize)[
          this.Qlist.pagenum - 1
        ];
        this.totalData = res.data;
        this.total = res.data.length;
        this.loading = false;
      });
    }, //获取初始数据
    sortChange(data) {
      const { prop, order } = data;
      this.$axios.post(this.api + "/sort", { prop, order }).then((res) => {
        console.log("res:", res);
        this.users = res.data;
      });
    }, //对各列进行排序处理
    handleEdit(index, item) {
      this.$router.push({ path: "/userEditor", query: { _id: item._id } });
    }, //编辑
    handleDelete(index, item) {
      this.$axios.post(this.api + "/delete", item).then((res) => {
        console.log("res:", res);
        this.findUser();
      });
    }, //删除
    handleCreate() {
      this.$router.push("/userEditor");
    }, //创建
    //筛选部分
    handleFilter() {
      if (this.Qlist.name == "" && this.Qlist.status == "") {
        this.$message.error("请输入查询信息");
      } else {
        this.$axios.post(this.api + "/filter", this.Qlist).then((res) => {
          console.log("res:", res);
          this.users = res.data;
          this.showBack = true;
        });
      }
    }, //筛选数据
    closeFilter() {
      this.findUser();
      this.Qlist = {
        pagenum: 1, //当前页数
        pagesize: 20,
        name: "",
        status: "",
      };
      this.showBack = false;
    }, //关闭筛选
    // 分页部分
    handleSizeChange(val) {
      this.Qlist.pagesize = val;
      this.users = _.chunk(this.totalData, this.Qlist.pagesize)[
        this.Qlist.pagenum - 1
      ];
    }, // 每页查看条数变化
    handleCurrentChange(val) {
      this.Qlist.pagenum = val;
      this.users = _.chunk(this.totalData, this.Qlist.pagesize)[
        this.Qlist.pagenum - 1
      ];
    }, // 当前页码变化

    findMyPublished(index, item) {
      this.drawerTitle = "已发布";
      var list = item.myPublished;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: "标题: " + list[i].title,
            children: [
              { label: "任务id:" + list[i].taskId },
              { label: "视频id: " + list[i].videoId },
              { label: "截止时间: " + list[i].deadline },
              { label: "验证码: " + list[i].authcode },
              { label: "用户列表", children: [] },
              { label: "标签: " + list[i].label },
              { label: "发布时间: " + list[i].time },
              {
                label:
                  list[i].averScores == "" || "undefined"
                    ? "平均分: 暂无数据"
                    : "平均分: " + list[i].averScores,
              },
              { label: "分数", children: [] },
              { label: "技术详情", children: [] },
              { label: "匹配详情", children: [] },
            ],
          });

          for (var j = 0; j < list[i].userList.length; j++) {
            this.list[i].children[4].children.push({
              label: "学生id: " + list[i].userList[j].stuid,
              children: [
                { label: "姓名: " + list[i].userList[j].name },
                { label: "密码: " + list[i].userList[j].password },
              ],
            });
          }

          if (list[i].scoreList) {
            for (var n = 0; n < list[i].scoreList.length; n++) {
              this.list[i].children[8].children.push({
                label: list[i].scoreList[n].name,
                children: [
                  { label: "技术分: " + list[i].scoreList[n].techScores },
                  { label: "匹配分: " + list[i].scoreList[n].matchScores },
                  { label: "总分: " + list[i].scoreList[n].scores },
                ],
              });
              this.list[i].children[10].children.push({
                label: list[i].matchList[n].name,
                children: [
                  { label: "匹配率: " + list[i].matchList[n].matchRate },
                  { label: "匹配分: " + list[i].matchList[n].points },
                  { label: "时间差: " + list[i].matchList[n].day },
                ],
              });
            }
          }

          if (list[i].techList) {
            var tl = {};
            var sentenceList = [];
            for (var j = 0; j < list[i].techList.length; j++) {
              var stn = list[i].techList[j].sentence;
              var names = list[i].techList[j].names;
              var names2 = [];
              for (var k = 0; k < names.length; k++) {
                names2.push(
                  names[k].name + " " + Math.round(names[k].percent * 100) + "%"
                );
              }
              names = names2;
              if (!tl[stn]) {
                tl[stn] = [
                  {
                    word: list[i].techList[j].word,
                    names: names,
                    len: list[i].techList[j].len,
                    points: list[i].techList[j].points,
                  },
                ];
                sentenceList.push(stn);
              } else {
                tl[stn].push({
                  word: list[i].techList[j].word,
                  names: names,
                  len: list[i].techList[j].len,
                  points: list[i].techList[j].points,
                });
              }
            }

            for (var m = 0; m < sentenceList.length; m++) {
              var stn = sentenceList[m];
              this.list[i].children[9].children.push({
                label: stn,
                children: [],
              });
              for (var n = 0; n < tl[stn].length; n++) {
                this.list[i].children[9].children[m].children.push({
                  label: tl[stn][n].word,
                  children: [
                    { label: "名单: " + tl[stn][n].names },
                    { label: "人数：" + tl[stn][n].len },
                    { label: "分值：" + tl[stn][n].points },
                  ],
                });
              }
            }
          }
        }
      }
    },

    findMyTasks(index, item) {
      this.drawerTitle = "用户任务";
      var list = item.myTasks;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: "标题: " + list[i].title,
            children: [
              { label: "任务id:" + list[i].taskId },
              { label: "视频id: " + list[i].videoId },
              { label: "截止时间: " + list[i].deadline },
              { label: "验证码: " + list[i].authcode },
              { label: "标签: " + list[i].label },
              { label: "提交时间: " + list[i].time },
              {
                label:
                  list[i].averScores == "" || "undefined"
                    ? "平均分: 暂无数据"
                    : "平均分: " + list[i].averScores,
              },
              {
                label:
                  list[i].scores == "" || "undefined"
                    ? "分数: 暂无数据"
                    : "分数: " + list[i].scores,
              },
            ],
          });
        }
      }
    },

    findMyComments(index, item) {
      this.drawerTitle = "用户评论";
      var list = item.myComments;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: "标题: " + list[i].taskTitle,
            children: [
              { label: "任务id:" + list[i].taskId },
              { label: "提交时间: " + list[i].time },
              { label: "评论: " + list[i].comment },
            ],
          });
        }
      }
    },

    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>

<style>
.el-drawer.rtl {
  overflow: scroll;
}

el-button {
  margin: 0, 5px;
}
</style>
