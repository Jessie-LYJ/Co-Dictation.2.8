<template>
  <div class="body">
    <q-btn
      label="Home"
      color="purple"
      @click="backHome()"
      id="backHome"
    />
    <q-btn
      label="Administrator"
      color="purple"
      @click="goToAdmin()"
      id="gotoAdmin"
    />

    <div class="container-box">
      <div class="container" :class="{ active: isActive }">
        <div class="card"></div>
        <div class="card">
          <h1 class="title">Login</h1>
          <form>
            <div class="input-container">
              <input required="required" v-model="loginData.name" />
              <label>Username</label>
              <div class="bar"></div>
            </div>
            <div class="input-container">
              <input
                type="password"
                required="required"
                v-model="loginData.password"
              />
              <label>Password</label>
              <div class="bar"></div>
            </div>
            <div class="button-container">
              <button @click.prevent="login()"><span>Go</span></button>
            </div>
            <div style="text-align: center; font-size: 16px; margin-top: 20px">
              <span style="color: #6f4a8e; margin-right: 10px" @click="reg()"
                >Create a new account?</span
              >
              <span style="color: #6f4a8e" @click="alert = true">Forgot your password?</span>
            </div>
          </form>
          <div class="q-pa-md q-gutter-sm">
          <q-dialog v-model="alert">
            <q-card>
              <q-card-section>
                <div class="text-h6">Help Information</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                You can send an email to ask the administrator for help. <br>
                Email: xxxxx@163.com <br>
                Good Luck! 
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="purple" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          </div>
        </div>
        <div class="card alt">
          <div class="toggle" @click="reg()"></div>
          <h1 class="title">
            Register
            <div class="close" @click="log()"></div>
          </h1>
          <form>
            <div class="input-container">
              <input required="required" v-model="registerData.name" />
              <label>Username</label>
              <div class="bar"></div>
            </div>
            <div class="input-container">
              <input
                type="password"
                required="required"
                v-model="registerData.password"
              />
              <label>Password</label>
              <div class="bar"></div>
            </div>
            <div class="input-container">
              <input
                type="password"
                required="required"
                v-model="registerData.password2"
              />
              <label>Repeat Password</label>
              <div class="bar"></div>
            </div>
            <div class="button-container">
              <button @click.prevent="register()"><span>Next</span></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      alert: false,
      isActive: false,
      loginData: {
        name: "",
        password: "",
      },
      registerData: {
        password: "",
        password2: "",
        name: "",
      },
      api: "/api",
    };
  },
  methods: {
    backHome() {
      this.$router.push("/")
    },
    goToAdmin() {
      this.$router.push("/admin");
    },
    reg() {
      this.isActive = true;
      this.registerData = {
        password: "",
        password2: "",
        name: "",
      };
    },
    log() {
      this.isActive = false;
      this.loginData = {
        name: "",
        password: "",
      };
    },
    login() {
      if (this.loginData.password.length > 0) {
        this.$axios.post(this.api + "/login", this.loginData).then((res) => {
          // localStorage.setItem("elementToken", "Bearer " + res.data);
          sessionStorage.setItem("userName", this.loginData.name);
          sessionStorage.setItem("elementToken", "Bearer " + res.data);
          this.$message({
            type: "success",
            message: "Login successfully",
            offset: 70,
          });
          this.$axios
            .get(this.api + "/lastLogin?username=" + this.loginData.name)
            .then((res) => {
              var dataTime = res.data;
            });
          this.$store.dispatch("setUser", this.loginData.name);
          this.$store.dispatch("setToken", "Bearer " + res.data);
          this.$router.push("/profile");
          //登录成功跳转到首页
        });
      } else {
        this.$message({
          type: "warning",
          message: "Failed to login",
        });
        console.log("error submit!!");
        return false;
        //错误信息提示，根据状态码
      }
    },
    register() {
      if (this.registerData.name == "" || this.registerData.password == "") {
        this.$message.error("The username and password cannot be empty.");
      } else {
        if (this.registerData.password !== this.registerData.password2) {
          this.$message.error("The two passwords you entered did not match.");
        } else if (this.registerData.password == this.registerData.password2) {
          this.$axios
            .post(this.api + "/register", this.registerData)
            .then((res) => {
              console.log(res.data);
              this.$message({
                type: "success",
                message: "You have registered successfully.",
                offset: 60,
              });
              this.isActive = false;
              // this.$router.push("/login"); //跳转到登录页面
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
          //错误信息提示，根据状态码
        }
      }
    },
  },
};
</script>

<style lang="scss">
.body {
  background-image: url("../assets/logo/login-bg-2.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  overflow: hidden;
  font-family: "RobotoDraft", "Roboto", sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#gotoAdmin {
  position: fixed;
  right: 2%;
  top: 3%;
}

#backHome {
  position: fixed;
  left: 2%;
  top: 3%;
}
/* Scroll To Bottom */
// #codepen, #portfolio {
//   position: fixed;
//   bottom: 30px;
//   right: 30px;
//   background: #363636;
//   width: 56px;
//   height: 56px;
//   border-radius: 100%;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
//   -webkit-transition: 0.3s ease;
//   transition: 0.3s ease;
//   color: #ffffff;
//   text-align: center;
// }
// #codepen i, #portfolio i {
//   line-height: 56px;
// }
// #codepen:hover, #portfolio:hover {
//   box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
// }

/* CodePen */
// #portfolio {
//   bottom: 96px;
//   right: 36px;
//   background: #ed2553;
//   width: 44px;
//   height: 44px;
//   -webkit-animation: buttonFadeInUp 1s ease;
//   animation: buttonFadeInUp 1s ease;
// }
// #portfolio i {
//   line-height: 44px;
// }

/* Container */
.container-box {
  position: relative;
}

.container {
  position: absolute;
  max-width: 530px;
  min-width: 425px;
  width: 50%;
  margin: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 20%);
}
// .container.active .card:first-child {
//   background: #f2f2f2;
//   margin: 0 15px;
// }
.container.active .card:nth-child(2) {
  background: #fafafa;
  // margin: 0 10px;
}
.container.active .card.alt {
  top: 20px;
  right: 0;
  width: 100%;
  min-width: 100%;
  height: auto;
  border-radius: 20px;
  padding: 10px 0 30px 0;
  overflow: hidden;
}
.container.active .card.alt .toggle {
  position: absolute;
  top: 40px;
  right: -30px;
  box-shadow: none;
  -webkit-transform: scale(15);
  transform: scale(15);
  -webkit-transition: -webkit-transform 0.3s ease;
  transition: -webkit-transform 0.3s ease;
  transition: transform 0.3s ease;
  transition: transform 0.3s ease, -webkit-transform 0.3s ease;
}
.container.active .card.alt .toggle:before {
  content: "";
}
.container.active .card.alt .title,
.container.active .card.alt .input-container,
.container.active .card.alt .button-container {
  left: 0;
  opacity: 1;
  visibility: visible;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}
.container.active .card.alt .title {
  -webkit-transition-delay: 0.3s;
  transition-delay: 0.3s;
}
.container.active .card.alt .input-container {
  -webkit-transition-delay: 0.4s;
  transition-delay: 0.4s;
}
.container.active .card.alt .input-container:nth-child(2) {
  -webkit-transition-delay: 0.5s;
  transition-delay: 0.5s;
}
.container.active .card.alt .input-container:nth-child(3) {
  -webkit-transition-delay: 0.6s;
  transition-delay: 0.6s;
}
.container.active .card.alt .button-container {
  -webkit-transition-delay: 0.7s;
  transition-delay: 0.7s;
}

/* Card */
.card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 10px 0 30px 0;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
  /* Title */
  /* Inputs */
  /* Button */
  /* Footer */
  /* Alt Card */
}
.card:first-child {
  background: rgba(255, 255, 255, 0.6);
  height: 10px;
  border-radius: 20px 20px 0 0;
  margin: 0 15px;
  padding: 0;
}
.card .title {
  position: relative;
  z-index: 1;
  border-left: 5px solid #6f4a8e;
  margin: 0 0 35px;
  padding: 10px 0 10px 50px;
  color: #6f4a8e;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.card .input-container {
  position: relative;
  margin: 0 60px 50px;
}
.card .input-container input {
  outline: none;
  z-index: 1;
  position: relative;
  background: none;
  width: 100%;
  height: 60px;
  border: 0;
  color: #212121;
  font-size: 24px;
  font-weight: 400;
}
.card .input-container input:focus ~ label {
  color: #9d9d9d;
  -webkit-transform: translate(-12%, -50%) scale(0.75);
  transform: translate(-12%, -50%) scale(0.75);
}
.card .input-container input:focus ~ .bar:before,
.card .input-container input:focus ~ .bar:after {
  width: 50%;
}
.card .input-container input:valid ~ label {
  color: #9d9d9d;
  -webkit-transform: translate(-12%, -50%) scale(0.75);
  transform: translate(-12%, -50%) scale(0.75);
}
.card .input-container label {
  position: absolute;
  top: 0;
  left: 0;
  color: #757575;
  font-size: 24px;
  font-weight: 300;
  line-height: 60px;
  -webkit-transition: 0.2s ease;
  transition: 0.2s ease;
}
.card .input-container .bar {
  position: absolute;
  left: 0;
  bottom: 0;
  background: #757575;
  width: 100%;
  height: 1px;
}
.card .input-container .bar:before,
.card .input-container .bar:after {
  content: "";
  position: absolute;
  background: #6f4a8e;
  width: 0;
  height: 2px;
  -webkit-transition: 0.2s ease;
  transition: 0.2s ease;
}
.card .input-container .bar:before {
  left: 50%;
}
.card .input-container .bar:after {
  right: 50%;
}
.card .button-container {
  margin: 0 60px;
  text-align: center;
}
.card .button-container button {
  outline: 0;
  cursor: pointer;
  position: relative;
  display: inline-block;
  background: 0;
  width: 240px;
  border: 2px solid #6f4a8e;
  padding: 20px 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  overflow: hidden;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}
.card .button-container button span {
  position: relative;
  z-index: 1;
  color: #6f4a8e;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}
.card .button-container button:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  background: #6f4a8e;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  margin: -15px 0 0 -15px;
  opacity: 0;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}
.card .button-container button:hover,
.card .button-container button:active,
.card .button-container button:focus {
  border-color: #6f4a8e;
  background-color: #6f4a8e;
}
.card .button-container button:hover span,
.card .button-container button:active span,
.card .button-container button:focus span {
  color: #ffffff;
}
.card .button-container button:active span,
.card .button-container button:focus span {
  color: #ffffff;
}
.card .button-container button:active:before,
.card .button-container button:focus:before {
  opacity: 1;
  -webkit-transform: scale(10);
  transform: scale(10);
}
.card .footer {
  margin: 40px 0 0;
  color: #d3d3d3;
  font-size: 24px;
  font-weight: 300;
  text-align: center;
}
.card .footer a {
  color: inherit;
  text-decoration: none;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
}
.card .footer a:hover {
  color: #bababa;
}
.card.alt {
  position: absolute;
  top: 40px;
  right: -30px;
  z-index: 10;
  width: 100px;
  height: 100px;
  background: none;
  border-radius: 100%;
  box-shadow: none;
  padding: 0;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
  /* Toggle */
  /* Title */
  /* Input */
  /* Button */
}
.card.alt .toggle {
  position: relative;
  background: #6f4a8e;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: #ffffff;
  font-size: 58px;
  line-height: 140px;
  text-align: center;
  cursor: pointer;
}
.card.alt .toggle:before {
  content: "+";
  display: inline-block;
  // font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-transform: translate(0, 0);
  transform: translate(0, 0);
  position: relative;
  top: -20px;
}
.card.alt .title,
.card.alt .input-container,
.card.alt .button-container {
  left: 100px;
  opacity: 0;
  visibility: hidden;
}
.card.alt .title {
  position: relative;
  border-color: #ffffff;
  color: #ffffff;
}
.card.alt .title .close {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 30px;
  display: inline;
  color: #ffffff;
  font-size: 58px;
  font-weight: 400;
}
.card.alt .title .close:before {
  content: "\00d7";
}
.card.alt .input-container input {
  color: #ffffff;
}
.card.alt .input-container input:focus ~ label {
  color: #ffffff;
}
.card.alt .input-container input:focus ~ .bar:before,
.card.alt .input-container input:focus ~ .bar:after {
  background: #ffffff;
}
.card.alt .input-container input:valid ~ label {
  color: #ffffff;
}
.card.alt .input-container label {
  color: rgba(255, 255, 255, 0.8);
}
.card.alt .input-container .bar {
  background: rgba(255, 255, 255, 0.8);
}
.card.alt .button-container button {
  width: 100%;
  background: #ffffff;
  border-color: #ffffff;
}
.card.alt .button-container button span {
  color: #6f4a8e;
}
.card.alt .button-container button:hover {
  background: rgba(255, 255, 255, 0.9);
}
.card.alt .button-container button:active:before,
.card.alt .button-container button:focus:before {
  display: none;
}

/* Keyframes */
@-webkit-keyframes buttonFadeInUp {
  0% {
    bottom: 30px;
    opacity: 0;
  }
}
@keyframes buttonFadeInUp {
  0% {
    bottom: 30px;
    opacity: 0;
  }
}
</style>
