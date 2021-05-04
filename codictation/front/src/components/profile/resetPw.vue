<template>
  <q-page class="q-pa-lg">
    <h3 class="q-my-md">Reset Password</h3>
    <q-separator insert style="width: 55%" class="q-mb-lg"/>
    <q-input
      square
      filled
      v-model="newPassword"
      label="New Password" 
      color="purple-6"
      class="inputP  q-mt-lg"
      :type="isPwd ? 'password' : 'text'"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      square
      filled
      v-model="newPassword2"
      label="Repeat New Password"
      color="purple-6"
      class="inputP q-mt-lg"
      :type="isPwd2 ? 'password' : 'text'"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd2 ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd2 = !isPwd2"
        />
      </template>
    </q-input>
    <q-btn
      color="purple-5"
      label="Reset"
      style="margin-top: 20px"
      @click="resetPw()"
    />
  </q-page>
</template>

<script>
import Header from "../basic/Header.vue";
export default {
  data() {
    return {
      isPwd: true,
      isPwd2: true,
      newPassword: "",
      newPassword2: "",
      username: "",
      api: "/api",
    };
  },
  components: {
    Header,
  },
  methods: {
    resetPw() {
      if (this.newPassword.trim().length == 0) {
        this.$notify({
          type: "warning",
          message: "The password cannot be empty.",
          position: "top-right",
          offset: 100,
        });
      }
      if (
        this.newPassword !== this.newPassword2 &&
        this.newPassword.trim().length > 0
      ) {
        this.$notify({
          type: "warning",
          message: "The two passwords you entered did not match.",
          position: "top-right",
          offset: 100,
        });
      }
      if (
        this.newPassword.trim().length > 0 &&
        this.newPassword == this.newPassword2
      ) {
        this.$axios.post(this.api + "/resetPw", {
          params: {
            name: this.username,
            password: this.newPassword,
          },
        });
        this.$notify({
          type: "success",
          message: "success",
          position: "top-right",
          offset: 100,
        });
        this.newPassword = "";
        this.newPassword2 = "";
      }
    },
  },
  created() {
    this.username = sessionStorage.getItem("userName");
  },
};
</script>

<style scoped>
.inputP {
  width: 40%;
  margin-top: 15px;
}
</style>