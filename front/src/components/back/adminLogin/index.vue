<template>
<div class="body">
  <el-button plain icon="el-icon-back" id="backToUser" @click="backToUser()">User</el-button>
<div class="box">
    <h4>Administrator</h4>
    <el-form
      :model="registerData"
      status-icon
      :rules="rules"
      ref="registerForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="Username" prop="name">
        <el-input v-model="registerData.name"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="registerData.password" @keyup.enter.native="submitForm('registerForm')"></el-input>
      </el-form-item>
      <div class="item-button">
        <el-button type="primary" @click="submitForm('registerForm')">Login</el-button>
      </div>
    </el-form>
  </div>
</div>
  
</template>

<script>
export default {
  data() {
    return {
      api:"/api",
      registerData: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "Please enter a valid account!", trigger: "blur" },
          { min: 3, max: 32, message: "Account length should be between 3 and 32", trigger: "blur" }
        ],
        password: [
          { required: true, message: "Please enter a valid password", trigger: "blur" },
          { min: 3, max: 32, message: "Password length should be between 3 and 32", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   alert("submit!");
          this.$axios.post(this.api+"/adminLogin", this.registerData).then(res => {
            console.log(res.data);
            localStorage.setItem("elementToken", "Bearer " + res.data);
            this.$router.push("/index");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    backToUser(){
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.body {
  background-image: url("../../../assets/logo/login-bg-3.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  overflow: hidden;
  font-family: "RobotoDraft", "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.box {
  background-color: white;
  width: 550px;
  height: 350px;
  margin: 180px auto;
  padding: 20px;
  border: 1px solid white;
  border-radius: 10px;
  box-shadow: 0 0 5px #eee;
  font-size: 16px;
}
#backToUser {
  position: fixed;
  margin-left: 20px;
  margin-top: 20px;
}
h4 {
  text-align: center;
  /* margin-bottom: 50px; */
}
.el-input {
  width: 91%;
}
.item-button {
  display: flex;
}
.item-button button {
  width: 200px;
  margin: 0 auto;
}
</style>