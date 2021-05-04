<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="视频_id">
        <el-input v-model="form._id" disabled="disabled" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="视频文件名">
        <el-input v-model="form.fileName" />
      </el-form-item>
      <el-form-item label="视频储存路径">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="form.label" />
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
  name: "videoEditor",
  data() {
    return {
      api: "/video",
      form: {
        title: "",
        fileName: "",
        path: "",
        label: ""
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
            title: "",
            fileName: "",
            path: "",
            label: ""
          };
        });
      } else {
        this.$axios.post(this.api + "/add", this.form).then((res) => {
          this.$router.push(this.api);
          this.form = {
            title: "",
            fileName: "",
            path: "",
            label: ""
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
