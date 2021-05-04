<template>
  <div class="header-container">
    <div>
      <i class="el-icon-s-fold"></i>
      <span>Co-Dictation 后台管理系统</span>
    </div>
    <el-button plain size="small" @click="SignOut()">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  components: {},
  props: {},
  data() {
    return {
      user: {},
      api: "/api"
    };
  },
  computed: {},
  watch: {},
  // created () {
  //     this.loadUserProfile()
  // },
  mounted() {},
  methods: {
    // loadUserProfile(){
    //    localStorage.getItem('element-')
    // },
    SignOut() {
      localStorage.clear();
      this.$message.success("Log out successfully");
      this.$router.push("/admin");
    }
  }
};
</script>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>