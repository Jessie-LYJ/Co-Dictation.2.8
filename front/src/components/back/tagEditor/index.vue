<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="标签_id">
        <el-input v-model="form._id" disabled="disabled" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="form.owner" />
      </el-form-item>
      <el-form-item label="标签名称">
        <el-input v-model="form.tagName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-model="submitText">{{submitText}}</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "tagEditor",
  data() {
    return {
      api: "/tag",
      form: {
        userList: "",
        owner: "",
        tagName: "",
      },
      submitText:""
    };
  },
  mounted() {
    if (this.$route.query._id) {
      this.$axios
        .post(this.api + "/get", { _id: this.$route.query._id })
        .then((res) => {
          this.form = res.data;
        });
      this.submitText = "保存修改"
    } else {
      this.submitText = "立即创建"
    }
  },
  methods: {
    onSubmit() {
      if (this.form._id) {
        this.$axios.post(`${this.api}/update`, this.form).then((res) => {
          console.log("bar:", res);
          this.$router.push(this.api);
          this.form = {
            userList: "",
            owner: "",
            tagName: "",
          };
        });
      } else {
        this.$axios.post(this.api + "/add", this.form).then((res) => {
          this.$router.push(this.api);
          this.form = {
            userList: "",
            owner: "",
            tagName: "",
          };
        });
      }
    },
    onCancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>
