<template>
  <q-layout view="lHh Lpr fff">
    <q-header elevated class="bg-white text-grey-10" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          shrink
          class="row items-center no-wrap"
        >
          <a href="/">
            <img
              src="../../assets/logo/logo.svg"
              class="vertical-middle"
              style="width: 130px; height: 24px"
            />
          </a>
        </q-toolbar-title>

        <q-space />

        <q-tabs align="justify" class="text-brown-10">
          <q-route-tab
            name="dictation"
            label="Dictations"
            to="/dictation"
            exact
          />
          <q-route-tab
            name="leaderboard"
            label="Leaderboard"
            to="/leaderboards"
            exact
          />
          <q-tab
            name="personal center"
            label="Personal Center"
            @click="intoProfile()"
            v-if="isTeacher == false"
          />
          <q-tab
            name="management center"
            label="Management Center"
            @click="intoProfile()"
            v-else
          />
        </q-tabs>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <div class="q-gutter-sm row items-center no-wrap" v-if="name">
            <avatar-org :name=name></avatar-org>
            <em class="text-subtitle1 q-mr-md">{{ name }}</em>
            <q-btn
              dense
              flat
              color="brown-7"
              icon="logout"
              label="Sign Out"
              @click="logout()"
              class="q-mr-lg"
            >
              <q-tooltip content-class="bg-brown-13">Sign Out</q-tooltip>
            </q-btn>
          </div>

          <div class="q-gutter-sm row items-center no-wrap q-mr-sm" v-else>
            <q-btn
              flat
              color="brown-7"
              icon="login"
              label="Sign In"
              @click="login()"
            />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <img
              class="q-pl-md q-pt-lg"
              src="../../assets/logo/logo.svg"
              style="width: 150px; height: 50px"
            />
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item
            v-for="(link, index) in links1"
            :key="index"
            clickable
            class="GPL__drawer-item"
            :to="link.to"
            v-show="status==1 ? link.isTeacher : link.isTeacher==false"
            :disable="disable"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            class="GPL__drawer-item"
            to="/profile/mycomments"
            :disable="disable"
          >
            <q-item-section avatar>
              <q-icon name="question_answer" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Comments</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <div>
          <q-item
            v-for="(link, i) in links2"
            :key="i"
            clickable
            class="GPL__drawer-item"
            :to="link.to"
            v-show="status==1 ? link.isTeacher : link.isTeacher==false"
            :disable="disable"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            class="GPL__drawer-item"
            to="/profile/resetpwd"
            :disable="disable"
          >
            <q-item-section avatar>
              <q-icon name="lock_open" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reset Password</q-item-label>
            </q-item-section>
          </q-item>
          </div>

          <q-separator class="q-my-md" />

          <!-- <q-item clickable class="GPL__drawer-item GPL__drawer-item--storage">
            <q-item-section avatar>
              <q-icon name="cloud" />
            </q-item-section>
            <q-item-section top>
              <q-item-label>Storage</q-item-label>
              <q-linear-progress :value="storage" class="q-my-sm" />
              <q-item-label caption>2.6 GB of 15 GB</q-item-label>
            </q-item-section>
          </q-item> -->
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import AvatarOrg from "./Avatar";

export default {
  name: "GooglePhotosLayout",
  data() {
    return {
      userId: "",
      name: "",
      api: "/api",
      imgstring: "",
      status: "0",
      isTeacher: false,
      leftDrawerOpen: false,
      // storage: 0.26,
      links1: [
        { icon: "assignment", text: "Tasks", to: "/profile/mypublished", isTeacher: true },
        { icon: "assignment", text: "Tasks", to: "/profile/mytasks", isTeacher: false },
        { icon: "verified", text: "Achievement", to: "/profile/mybadges", isTeacher: false },
        { icon: "event_note", text: "Mistakes", to: "/profile/mymistakes", isTeacher: false },
      ],
      links2: [
        { icon: "add_task", text: "New Task", to: "/profile/newtask", isTeacher: true },
        { icon: "group_add", text: "Add Users", to: "/profile/addusers", isTeacher: true },
      ],
      disable: true,
    };
  },
  components: {
    AvatarOrg,
  },
  methods: {
    login() {
      this.$router.replace("/login");
    },
    logout() {
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("elementToken");
      this.$router.push("/Login");
    },
    intoProfile() {
      if (this.name) {
        this.$router.push("/profile");
      } else {
        this.$router.push("/Login");
      }
    },
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    console.log(this.name);
    this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
      this.userId = res.data[0]._id; //找地方保存
      this.status = res.data[0].status;
      if (this.status == "1") {
        this.isTeacher = true;
      }
      if (this.name) {
        this.disable = false;
      }
    });
  },
};
</script>

<style lang="sass">
.GPL
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 35%
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368
    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem
    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px
  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500
  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px

canvas
    width: 34px;
    height: 34px;
    border-radius: 50%;
    margin: 0 10px 0 15px;

.q-tab__label, span.block
    font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
    text-transform: capitalize;
    font-size: 18px;

span.block
    font-size: 16px;
</style>
