<template>
  <div class="home-container">
    <h5>欢迎登录后台管理系统！</h5>
    <div id="calendar">
      <el-calendar v-model="value"> </el-calendar>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeIndex",
  data() {
    return {
      value: new Date(),
    };
  },
  beforeCreate() {
    const token = localStorage.getItem("elementToken");
    if (!token) {
      this.$router.push("/admin");
    }
  },

  // beforeMount() {
  //   this.$axios.get("/").then(res => {
  //     console.log(res.data);
  //   });
  // }
};
</script>

<style>
#calendar {
  margin-left: 68%;
  margin-top: 5%;
  width: 370px;
}
.el-calendar-table .el-calendar-day{
  height: 37px;
}
</style>