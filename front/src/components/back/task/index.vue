<template>
  <div class="dashboard-container">
    <div class="filter-container" style="margin: 0 0 10px 0">
      <el-input
        v-model="Qlist.publisher"
        placeholder="发布者"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="Qlist.title"
        placeholder="标题"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="Qlist.label"
        placeholder="标签"
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
      <el-table-column prop="_id" sortable="custom" label="任务_id" />
      <el-table-column prop="videoId" sortable="custom" label="视频id" />
      <el-table-column prop="reference" label="参考" />
      <el-table-column prop="deadline" sortable="custom" label="截止日期" />
      <el-table-column prop="time" sortable="custom" label="发布时间" />
      <el-table-column
        prop="authcode"
        width="70"
        sortable="custom"
        label="验证码"
      />
      <el-table-column prop="words" sortable="custom" label="限制字数" />
      <el-table-column prop="averScores" sortable="custom" label="平均分" />
      <el-table-column
        prop="publisher"
        width="70"
        sortable="custom"
        label="发布者"
      />
      <el-table-column prop="title" sortable="custom" label="标题" />
      <el-table-column prop="label" width="70" sortable="custom" label="标签" />
      <el-table-column
        label="更多"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findDiffList(scope.$index, scope.row);
            "
            >用户修改
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findUserList(scope.$index, scope.row);
            "
            >用户列表
          </el-button>
          <br />
          <br />
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findSubmitted(scope.$index, scope.row);
            "
            >已提交列表
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findComment(scope.$index, scope.row);
            "
            >评论
          </el-button>
          <br />
          <br />
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findScoreList(scope.$index, scope.row);
            "
            >分数
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findTechList(scope.$index, scope.row);
            "
            >技术
          </el-button>
          <br />
          <br />
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findMatchList(scope.$index, scope.row);
            "
            >匹配
          </el-button>
          <el-button
            size="mini"
            type="success"
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
  name: "task",
  data() {
    return {
      api: "/task",
      users: {},
      totalData: [],
      Qlist: {
        pagenum: 1, //当前页数
        pagesize: 20,
        publisher: "",
        title: "",
        label: "",
      },
      total: "",
      showBack: false,
      drawerTitle: "",
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
      this.$router.push({ path: "/taskEditor", query: { _id: item._id } });
    }, //编辑
    handleDelete(index, item) {
      this.$axios.post(this.api + "/delete", item).then((res) => {
        console.log("res:", res);
        this.findUser();
      });
    }, //删除
    handleCreate() {
      this.$router.push("/taskEditor");
    }, //创建
    //筛选部分
    handleFilter() {
      if (
        this.Qlist.publisher == "" &&
        this.Qlist.title == "" &&
        this.Qlist.label == ""
      ) {
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
        publisher: "",
        title: "",
        label: "",
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

    handleNodeClick(data) {
      console.log(data);
    },

    findMatchList(index, item) {
      this.drawerTitle = "匹配";
      var list = item.matchList;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: list[i].name,
            children: [
              { label: "匹配率:" + list[i].matchRate },
              { label: "分数: " + list[i].points },
              { label: "时间差: " + list[i].day },
            ],
          });
        }
      }
    },

    findScoreList(index, item) {
      this.drawerTitle = "分数";
      var list = item.scoreList;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: list[i].name,
            children: [
              { label: "技术分:" + list[i].techScores },
              { label: "匹配分: " + list[i].matchScores },
              { label: "总分: " + list[i].scores },
            ],
          });
        }
      }
    },

    findComment(index, item) {
      this.drawerTitle = "评论";
      var list = item.comments;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: list[i].comment,
            children: [
              { label: "发布者:" + list[i].name },
              { label: "发布时间: " + list[i].time },
              { label: "回复", children: [] },
            ],
          });

          var reply = list[i].reply;
          for (var j = 0; j < reply.length; j++) {
            this.list[i].children[2].children.push(
              { label: "回复者 :" + reply[j].responder },
              { label: "回复 :" + reply[j].comment },
              { label: "回复时间 :" + reply[j].time }
            );
          }
        }
      }
    },

    findTechList(index, item) {
      this.drawerTitle = "技术";
      var list = item.techList;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        var tl = {};
        var sentenceList = [];
        for (var j = 0; j < list.length; j++) {
          var stn = list[j].sentence;
          var names = list[j].names;
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
                word: list[j].word,
                names: names,
                len: list[j].len,
                points: list[j].points,
              },
            ];
            sentenceList.push(stn);
          } else {
            tl[stn].push({
              word: list[j].word,
              names: names,
              len: list[j].len,
              points: list[j].points,
            });
          }
        }

        for (var m = 0; m < sentenceList.length; m++) {
          var stn = sentenceList[m];
          this.list.push({
            label: stn,
            children: [],
          });
          for (var n = 0; n < tl[stn].length; n++) {
            this.list[m].children.push({
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
    },

    findSubmitted(index, item) {
      this.drawerTitle = "已提交";
      var list = item.submitted;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: list[i],
          });
        }
      }
    },

    findLabel(index, item) {
      this.drawerTitle = "标签";
      var list = item.label;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: list[i],
          });
        }
      }
    },

    findUserList(index, item) {
      this.drawerTitle = "用户列表";
      var list = item.userList;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: list[i].name,
          });
        }
      }
    },

    findDiffList(index, item) {
      this.drawerTitle = "修改详情";
      var list = item.diffList;
      this.list = [];
      if (list.length == 0 || !list) {
        this.list.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < list.length; i++) {
          this.list.push({
            label: list[i].sentence,
            children: [
              { label: "words", children: [] },
              { label: "author: " + list[i].author },
              { label: "versions", children: [] },
            ],
          });

          var sentenceDiffs = list[i].sentenceDiffs;
          for (var j = 0; j < sentenceDiffs.length; j++) {
            this.list[i].children[2].children.push({
              label: sentenceDiffs[j].provider,
              children: [{ label: "版本： " + sentenceDiffs[j].sentenceDiff }],
            });
          }

          var words = list[i].words;
          for (var j = 0; j < words.length; j++) {
            this.list[i].children[0].children.push({
              label: words[j].index + 1 + ". " + words[j].word,
              children: [
                { label: "已编辑： " + words[j].isedited },
                { label: "编辑详情: ", children: [] },
              ],
            });

            var diffs = words[j].diffs;
            for (var m = 0; m < diffs.length; m++) {
              this.list[i].children[0].children[j].children[1].children.push({
                label: diffs[m].diff,
                children: [
                  { label: "名单", children: [] },
                  { label: "总人数: " + diffs[m].num },
                  { label: "初版本时间: " + diffs[m].time },
                  { label: "修改状态: " + diffs[m].status },
                ],
              });

              var names = diffs[m].names;
              for (var n = 0; n < names.length; n++) {
                this.list[i].children[0].children[j].children[1].children[
                  m
                ].children[0].children.push({
                  label: names[n].username + " " + names[n].edittime,
                });
              }
            }
          }
        }
      }
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
