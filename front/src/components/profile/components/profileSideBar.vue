<template>
  <q-layout>
    <div class="content-box">
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <q-tabs v-model="innerTab" vertical class="text-purple-9 tab-box">
            <q-img style="height: 200px">
              <div class="absolute-center bg-transparent">
                <div class="avatar-box">
                  <avatar-org class="side-avatar" :name=name></avatar-org>
                </div>
                <div class="text-subtitle1 account-name text-center">
                  {{ name }}
                </div>
                <div
                  class="text-body2 account-identity text-center text-weight-light"
                >
                  「 {{ identity }} 」
                </div>
              </div>
            </q-img>
            <q-separator insert class="q-my-sm" />
            <q-route-tab
              to="/profile/mypublished"
              name="innerPosts"
              icon="assignment"
              label="Tasks"
              v-if="showPosts"
            />

            <q-route-tab
              to="/profile/mytasks"
              name="innerTasks"
              icon="assignment"
              label="Tasks"
              v-if="showTasks"
            />

            <q-route-tab 
              to="/profile/mybadges"
              name="innerBadges" 
              icon="verified" 
              label="Achievement" 
              v-if="isAchievement"
            />

            <q-route-tab 
              to="/profile/mymistakes"
              name="innerMistakes" 
              icon="event_note" 
              label="Mistakes" 
              v-if="isMistakes"
            />

            <q-route-tab
              to="/profile/mycomments"
              name="innerComments"
              icon="question_answer"
              label="Comments"
            />

            <q-separator insert class="q-my-sm" />

            <q-route-tab
              to="/profile/newtask"
              name="innerNewTask"
              icon="add_task"
              label="New Task"
              v-if="isNewTask"
            />
            <q-route-tab
              to="/profile/addusers"
              name="innerAddUsers"
              icon="group_add"
              label="Add Users"
              v-if="isNewUser"
            />
            <q-route-tab
              to="/profile/resetpwd"
              name="innerResetPassword"
              icon="lock_open"
              label="Reset Password"
            />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="innerTab"
            animated
            swipeable
            vertical
            transition-prev="fade"
            transition-next="fade"
          >

            <q-tab-panel name="innerProfile">
              <q-page-container>
                <my-info></my-info>
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerPosts">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerTasks">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerComments">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerBadges">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerMistakes">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerNewTask">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerAddUsers">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>

            <q-tab-panel name="innerResetPassword">
              <q-page-container>
                <router-view />
              </q-page-container>
            </q-tab-panel>
          </q-tab-panels>
        </template> 
      </q-splitter>
    </div>
  </q-layout>
</template>

<script>
import AvatarOrg from "../../basic/Avatar";
import NewTask from "../task";
import AddUsers from "../addUsers";
import MyTasks from "../mytasks";
import MyPosts from "../published";
import MyComments from "../mycomments";
import MyBadges from "../mybadges";
import MyMistakes from "../mymistakes";
import resetPw from "../resetPw";
import MyInfo from "../myinfo";


export default {
  data() {
    return {
      name: "", //当前用户的用户名
      userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
      api: "/api",
      innerTab: "",
      splitterModel: 20,
      status: "0",
      identity: "Student",
      isNewTask: false,
      isNewUser: false,
      showTasks: false,
      showPosts: false,
      isAchievement: false,
      isMistakes: false,
    };
  },
  components: {
    NewTask,
    AddUsers,
    MyTasks,
    MyPosts,
    MyComments,
    AvatarOrg,
    MyBadges,
    MyMistakes,
    resetPw,
    MyInfo
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
      this.userId = res.data[0]._id; //找地方保存
      this.status = res.data[0].status;
      if (this.status == "0") {
        this.identity = "Student";
        this.showTasks = true;
        this.isAchievement = true;
        this.isMistakes = true;
        this.innerTab = "innerProfile";
      }
      if (this.status == "1") {
        this.identity = "Teacher";
        this.isNewTask = true;
        this.isNewUser = true;
        this.showPosts = true;
        this.innerTab = "innerPosts";
      }
      // if (this.status == "2") {
      //   this.identity = "组长";
      //   this.isNewTask = true;
      //   this.showTasks = true;
      //   this.showPosts = true;
      //   this.innerTab = "innerPosts";
      // }
      console.log("userId", this.userId);
      console.log(this.status);
    });
    
  },
};
</script>

<style lang="scss">
.side-avatar {
  width: 4em;
  height: 4em;
}

.absolute-center.bg-transparent {
  width: 95%;
}

.account-name {
  color: black;
  font-family: "Prata";
  font-size: 20px;
  margin-top: 0.6em;
  font-weight: bold;
}

.account-identity {
  color: black;
  font-size: 17px;
  margin-top: 0.6em;
}

.avatar-box {
  text-align: center;
}

.absolute-center {
  margin-top: 6px;
}

.tab-box {
  position: fixed;
  width: 19%;
}

.q-tab__content {
  width: 100%;
}

.q-tab__icon {
  position: absolute;
  left: 0;
  margin: 0 10%;
}

.tab-box .q-tab__label {
  margin-left: 30px;
}

.q-splitter__panel.q-splitter__before {
  width: 19% !important;
}

.q-tab--full {
  min-height: 56px;
}

.q-splitter__separator {
  min-height: 680px;
}

h6, h5, h3, h2, h1 {
  font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
}
</style>
