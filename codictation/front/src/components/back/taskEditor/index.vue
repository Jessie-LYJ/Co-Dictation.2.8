<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务_id">
        <el-input v-model="form._id" disabled="disabled" />
      </el-form-item>
      <el-form-item label="视频id">
        <el-input v-model="form.videoId" disabled="disabled"/>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-input v-model="form.time" />
      </el-form-item>
      <el-form-item label="截止日期">
        <el-input v-model="form.deadline" />
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="form.authcode" />
      </el-form-item>
      <el-form-item label="发布者">
        <el-input v-model="form.publisher" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="form.label" />
      </el-form-item>
      <el-form-item label="字数要求">
        <el-input v-model="form.words" />
      </el-form-item>
      <el-form-item label="参考">
        <el-input v-model="form.reference" />
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
  name: "taskEditor",
  data() {
    return {
      api: "/task",
      form: {
        videoId: "",
        deadline: "",
        authcode: "",
        publihser: "",
        title: "",
        label: "",
        reference: "",
        words: "",
        time: "",
        averScores: "",
        diffList: [],
        userList: [],
        submitted: [],
        userList: [],
        comment: [],
        scoreList: [],
        techList: [],
        matchList: [],
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
            videoId: "",
            deadline: "",
            authcode: "",
            publihser: "",
            title: "",
            label: "",
            reference: "",
            words: "",
            time: "",
            averScores: "",
            diffList: [],
            userList: [],
            submitted: [],
            userList: [],
            comment: [],
            scoreList: [],
            techList: [],
            matchList: [],
          };
        });
      } else {
        this.$axios.post(this.api + "/add", this.form).then((res) => {
          this.$router.push(this.api);
          this.form = {
            videoId: "",
            deadline: "",
            authcode: "",
            publihser: "",
            title: "",
            label: "",
            reference: "",
            words: "",
            time: "",
            averScores: "",
            diffList: [],
            userList: [],
            submitted: [],
            userList: [],
            comment: [],
            scoreList: [],
            techList: [],
            matchList: [],
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
