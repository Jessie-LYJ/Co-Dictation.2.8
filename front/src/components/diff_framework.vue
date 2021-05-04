<template>
  <div class="main-body">
    <div style="height: 64px"><Header></Header></div>
    <div class="q-pa-none fixed sub-nav-bar">
      <q-btn-group spread>
        <q-btn
          color="purple"
          @click.native="toMain()"
          label="Main"
          class="elbutton"
        />
        <q-btn
          color="purple"
          @click.native="toComment()"
          label="Comment"
          class="elbutton"
        />
        <q-btn
          color="purple"
          @click.native="toReference()"
          label="References"
          class="elbutton"
        />
      </q-btn-group>
    </div>
  </div>
</template>

<script>
import Header from "./basic/Header.vue";
import Diff from "./diff.vue";
import Comment from "./comment.vue";
import Reference from "./reference.vue";

export default {
  data() {
    return {
      name: "", //当前用户的用户名
      userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
      api: "/api",
      tab: "diff-page",
    };
  },
  methods: {
    toMain() {
      this.$router.push("/diff/" + this.diffId + "/main");
    },
    toComment() {
      this.$router.push("/diff/" + this.diffId + "/comment");
    },
    toReference() {
      this.$router.push("/diff/" + this.diffId + "/reference");
    },
  },
  components: {
    Header,
    Diff,
    Comment,
    Reference,
  },
  created() {
    document.querySelector("body").removeAttribute("style");
    this.name = sessionStorage.getItem("userName");
    this.diffId = this.$route.params.diffId;
    this.toMain();
  },
};
</script>

<style>
/* 背景与前景（视频与任务）的排版 */
.main-body {
  font-size: 16px;
  min-height: 100vh;
  /* background: url('../assets/images/swirl.png') repeat; */
}

.sub-nav-bar {
  top: 64px;
  width: 100%;
}

.q-tab__icon {
  position: absolute;
  left: 0;
  margin: 0 10%;
}

.q-tab--full {
  min-height: 56px;
}
</style>
