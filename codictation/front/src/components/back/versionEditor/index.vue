<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="id">
        <el-input v-model="form._id" disabled="disabled" />
      </el-form-item>
      <el-form-item label="任务_id">
        <el-input v-model="form.taskId" disabled="disabled" />
      </el-form-item>
      <el-form-item label="版本">
        <el-input v-model="form.version" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"/>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="提交时间">
        <el-input v-model="form.time" />
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
      api: "/version",
      form: {
        taskId: "",
        version: "",
        name: "",
        time: "",
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
          this.$router.push(this.api);
          this.form = {
            taskId: "",
            version: "",
            name: "",
            time: "",
          };
        });
      } else {
        this.$axios.post(this.api + "/add", this.form).then((res) => {
          this.$router.push(this.api);
          this.form = {
            taskId: "",
            version: "",
            name: "",
            time: "",
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
