<template>
  <div class="dashboard-container">
    <div class="filter-container" style="margin: 0 0 10px 0">
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
      <el-table-column prop="_id" sortable="custom" label="视频_id" />
      <el-table-column prop="title" sortable="custom" label="标题" />
      <el-table-column prop="fileName" sortable="custom" label="视频文件名" />
      <el-table-column prop="path" label="视频储存路径" />
      <el-table-column prop="label" sortable="custom" label="标签" />
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
  </div>
</template>

<script>
const _ = require("loadsh");

export default {
  name: "video",
  data() {
    return {
      api: "/video",
      users: {},
      totalData: [],
      Qlist: {
        pagenum: 1, //当前页数
        pagesize: 20,
        title: "",
        label: "",
      },
      total: "",
      showBack: false,
      loading: true,
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
      this.$router.push({ path: "/videoEditor", query: { _id: item._id } });
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
      if (this.Qlist.title == "" && this.Qlist.label == "") {
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
  },
};
</script>

<style>
</style>
