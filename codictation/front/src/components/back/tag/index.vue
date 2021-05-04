<template>
  <div class="dashboard-container">
    <div class="filter-container" style="margin: 0 0 10px 0">
      <el-input
        v-model="Qlist.owner"
        placeholder="创建人"
        style="width: 200px; margin-right: 5px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="Qlist.tagName"
        placeholder="标签名称"
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
      <el-table-column prop="_id" sortable="custom" label="标签_id" />
      <el-table-column
        label="用户列表"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="
              drawer = true;
              findUserList(scope.$index, scope.row);
            "
            >详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="owner" sortable="custom" label="创建人" />
      <el-table-column prop="tagName" sortable="custom" label="标签名称" />
      <el-table-column
        label="操作"
        align="center"
        width="230"
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
      title="用户列表"
      :visible.sync="drawer"
      direction="rtl"
      :modal-append-to-body="false"
      style="position: absolute"
    >
      <el-tree
        class="treeitems"
        :data="userList"
        :props="defaultProps"
        @node-click="handleNodeClick"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="fr" style="position: absolute; right: 10%">
            <el-button type="text" size="mini" @click="() => edit(node, data)">
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              v-if="data.children"
              @click="() => add(node, data)"
            >
              新增
            </el-button>
            <el-button
              class="fontRed"
              v-if="data.isSys !== 1"
              type="text"
              size="mini"
              @click="() => del(node, data)"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>

      <el-scrollbar></el-scrollbar>
    </el-drawer>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
    >
      <el-input v-model="msg" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogVisible = false;
            msg = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="onConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const _ = require("loadsh");

export default {
  name: "tag",
  data() {
    return {
      api: "/tag",
      totalData: [],
      users: {},
      Qlist: {
        pagenum: 1, //当前页数
        pagesize: 20,
        owner: "",
        tagName: "",
      },
      total: "",
      showBack: false,
      drawer: false,
      userList: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      loading: true,
      dialogVisible: false,
      dialogTitle: "",
      msg: "",
      treeNode: [],
      treeData: [],
      _id: "",
      listData: [],
    };
  },
  mounted() {
    this.findUser();
  },
  methods: {
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
      this.$router.push({ path: "/tagEditor", query: { _id: item._id } });
    }, //编辑
    handleDelete(index, item) {
      this.$axios.post(this.api + "/delete", item).then((res) => {
        console.log("res:", res);
        this.findUser();
      });
    }, //删除
    handleCreate() {
      this.$router.push("/tagEditor");
    }, //创建
    //筛选部分
    handleFilter() {
      if (this.Qlist.owner == "" && this.Qlist.tagName == "") {
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
        owner: "",
        tagName: "",
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

    // 树形控件
    findUserList(index, item) {
      var userList = item.userList;
      this.userList = [];

      this._id = item._id;
      this.listData = userList;

      if (userList.length == 0) {
        this.userList.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < userList.length; i++) {
          this.userList.push({
            label: "学生id: " + userList[i].stuid,
            children: [
              {
                label: "用户名: " + userList[i].name,
              },
              { label: "姓名: " + userList[i].stuname },
              {
                label: "密码: " + userList[i].password,
              },
            ],
          });
        }
      }
    },
    handleNodeClick(data) {
      // console.log(data);
      // // this.treeClickCount++;
      // // if (this.treeClickCount >= 2) {
      // //   return;
      // // }
      // // window.setTimeout(() => {
      // //   if (this.treeClickCount == 1) {
      // //     this.treeClickCount = 0;
      // //     console.log(data);
      // //   } else if (this.treeClickCount > 1) {
      // //     this.treeClickCount = 0;
      // //     // data.label += "修改成功"
      // //     var a = Number(data.$treeNodeId);
      // //     console.log("11", a, a + 1);
      // //   }
      // // }, 300);
    },

    onConfirm() {
      var index = this.treeNode.parent.data.findIndex(
        (item) => item.label == this.treeData.label
      );
      if (this.dialogTitle == "编辑") {
        this.treeData.label = this.msg;
      } else if (this.dialogTitle == "增加") {
        var arr = {
          label: this.msg,
          children: [
            {
              label: "用户名: ",
            },
            { label: "姓名: " },
            {
              label: "密码: ",
            },
          ],
        };
        this.userList.splice(index + 1, 0, arr);
      }
      this.dialogVisible = false;
      this.msg = "";
      // this.treeToList()
      // this.updateList()
    },

    edit(node, data) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
      this.msg = data.label;
      this.treeNode = node;
      this.treeData = data;
    },

    add(node, data) {
      this.msg = "学生id: ";
      this.dialogVisible = true;
      this.dialogTitle = "增加";
      this.treeData = data;
      this.treeNode = node;
    },

    del(node, data) {
      var index = node.parent.data.findIndex(
        (item) => item.label == data.label
      );
      this.userList.splice(index, 1);
      // this.treeToList()
      // this.updateList()
    },

    updateListData(data,index,dialogTitle) {
      var index = this.treeToList.fin
      var userList = item.userList;
      this.userList = [];
      this._id = item._id;
      if (userList.length == 0) {
        this.userList.push({ label: "暂无数据" });
      } else {
        for (var i = 0; i < userList.length; i++) {
          this.userList.push({
            label: "学生id: " + userList[i].stuid,
            children: [
              {
                label: "用户名: " + userList[i].name,
              },
              { label: "姓名: " + userList[i].stuname },
              {
                label: "密码: " + userList[i].password,
              },
            ],
          });
        }
      }

      // var newItem = {
      //   stuid:
      //   name:
      //   stuname:
      //   password:
      // }
      // if(dialogTitle == "编辑"){

      // }
    },

    updateList() {
      this.$axios.post(this.api + "/updateList", {
        params: {
          _id: this._id,
          userList: this.userList,
        },
      });
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
/* .dashboard-container {

} */
</style>
