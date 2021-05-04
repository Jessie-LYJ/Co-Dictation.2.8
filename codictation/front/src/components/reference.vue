<template>
  <div style="max-width: 900px; margin-left:150px; margin-top:70px">
    <div v-if="isShowR" style="width: 600px; margin-left:150px; margin-top:70px">
      <span style="font-size:20px">References:</span> 
      <q-card class="bg-purple-1 box-card">
      <q-card-section>
        <div style="word-break: break-all !important;">{{ reference }}</div>
      </q-card-section>
    </q-card>
    </div>
    <div v-else style="max-width: 900px; margin-left:150px; margin-top:70px; font-size: 20px">No references yet...</div>
    <br />
    <div class="q-pa-md" style="max-width: 900px; margin-left:130px; margin-top:30px" v-if="isShowB">
      <q-input v-model="myReference" filled type="textarea"/>
      <br />
      <q-btn
        color="purple"
        label="Submit"
        @click="submitRefer()"
        style="margin-left: 89%"
      />
    </div>
  </div>
</template>

<script>
import Header from "./basic/Header.vue";
export default {
  data() {
    return {
      name: "",
      diffId: "",
      publisher: "",
      reference: "",
      myReference: "",
      isShowB: false,
      isShowR: false,
      api: "/api",
    };
  },
  components: {
    Header,
  },
  methods: {
    submitRefer() {
      this.$axios.post(this.api + "/updateReference", {
        //数据更新
        params: {
          _id: this.diffId,
          reference: this.myReference.trim(),
        },
      });
      this.isShowR = true;
      this.reference = this.myReference; //后期可改成从数据库取数据
      this.myReference = "";
    },
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.diffId = this.$route.params.diffId;
    //请求数据
    this.$axios
      .get(this.api + "/currentTask?_id=" + this.diffId)
      .then((res) => {
        this.publisher = res.data[0].publisher;
        this.reference = res.data[0].reference;
        if (this.publisher == this.name) {
          this.isShowB = true;
        }
        if (this.reference.length > 0) {
          this.isShowR = true;
        }
      });
  },
};
</script>

<style>
.box-card {
  padding: 18px 0;
}
</style>