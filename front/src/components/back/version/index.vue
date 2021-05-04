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
        v-model="Qlist.taskId"
        placeholder="任务id"
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
      <el-table-column prop="_id" sortable="custom" label="id" />
      <el-table-column prop="taskId" sortable="custom" label="任务id" />
      <el-table-column
        prop="version"
        width="450"
        sortable="custom"
        label="版本"
      />
      <el-table-column
        prop="name"
        sortable="custom"
        width="50"
        label="用户名"
      />
      <el-table-column prop="time" sortable="custom" label="时间" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑
          </el-button>
          <br />
          <br />
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
  </div>
</template>

<script>
const _ = require("loadsh");

export default {
  name: "version",
  data() {
    return {
      api: "/version",
      totalData: [],
      users: {},
      Qlist: {
        pagenum: 1, //当前页数
        pagesize: 10,
        name: "",
        taskId: "",
      },
      total: "",
      showBack: false,
      loading: true
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
        this.loading = false
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
      this.$router.push({ path: "/versionEditor", query: { _id: item._id } });
    }, //编辑
    handleDelete(index, item) {
      this.$axios.post(this.api + "/delete", item).then((res) => {
        console.log("res:", res);
        this.findUser();
      });
    }, //删除
    handleCreate() {
      this.$router.push("/videoEditor");
    }, //创建
    //筛选部分
    handleFilter() {
      if (this.Qlist.name == "" && this.Qlist.taskId == "") {
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
        taskId: "",
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
  },
};
</script>

<style>
</style>
