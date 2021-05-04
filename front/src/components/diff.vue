<template>
  <q-page style="margin-top: 60px">
    <!-- 按钮组合 -->
    <div class="buttons">
      <q-btn
        color="purple"
        icon="keyboard_arrow_down"
        round
        @click="toBest('#mainContent')"
        style="margin-bottom: 3px"
      >
        <q-tooltip
          content-class="bg-accent"
          anchor="center left"
          self="center right"
          :offset="[10, 10]"
          >The Optimal Version</q-tooltip
        >
      </q-btn>
      <br />
      <q-btn
        color="purple"
        icon="tv"
        round
        v-if="isVideo"
        @click="pip()"
        slot="reference"
        style="margin-bottom: 3px"
      >
        <q-tooltip
          content-class="bg-accent"
          anchor="center left"
          self="center right"
          :offset="[10, 10]"
          >Picture in Picture Mode</q-tooltip
        >
      </q-btn>
      <br />
      <q-btn
        color="purple"
        icon="keyboard_arrow_up"
        round
        v-if="isVideo"
        @click="toTop()"
        style="margin-bottom: 3px"
      >
        <q-tooltip
          content-class="bg-accent"
          anchor="center left"
          self="center right"
          :offset="[10, 10]"
          >To The Top</q-tooltip
        >
      </q-btn>
    </div>
    <div>
      <div class="video-container q-px-xl">
        <!-- 视频展现 -->
        <div class="video-left-box">
          <div class="video-box q-mx-sm q-ml-lg" v-if="isVideo">
            <vue-core-video-player
              id="video"
              :src="require('../assets/video/' + fileName)"
              controls
              :autoplay="autoplay"
              @play="playFunc"
              @pause="pauseFunc"
              @loadedmetadata="loaded"
            ></vue-core-video-player>
          </div>
          <div class="audio-box q-mr-sm q-mb-md" v-else>
            <!-- <vue-audio
              id="audio"
              class="q-pa-lg"
              :audio-source="require('../assets/video/' + fileName)"
            ></vue-audio> -->
            <audio
              :src="require('../assets/video/' + fileName)"
              id="audio"
              controls
              @play="playFunc"
              @pause="pauseFunc"
              @loadedmetadata="loaded"
              controlslist="nodownload"
            ></audio>
          </div>
          <div id="menu" class="q-px-sm q-py-md row col-12">
            <div class="col-4 text-center" v-if="isVideo == false">
              <q-select
                id="selected"
                standout="bg-purple-4 text-white"
                color="purple"
                v-model="rateSelected"
                :options="options"
                @input="handleSpeed"
                label="Difficulty Degree"
                dense
                class="q-mx-md"
              >
                <template v-slot:prepend>
                  <q-icon name="speed" size="md" />
                </template>
              </q-select>
            </div>
            <div class="col-8 text-center">
              <q-btn
                class="q-mx-md"
                @click="goBack"
                color="purple-4"
                icon="replay_10"
                label="Backward"
                glossy
                style="width: 14em; height: 2.75em"
              />
              <q-btn
                class="q-mx-md"
                @click="goForward"
                color="purple-4"
                icon-right="forward_10"
                label="Forward"
                glossy
                style="width: 14em; height: 2.75em"
              />
            </div>
          </div>
        </div>
        <!-- 信息卡片 -->
        <div class="video-right-box">
          <q-card class="my-info-card q-mr-lg" flat bordered>
            <q-item>
              <q-item-section avatar>
                <avatar-org
                  :name="publisher"
                  class="publisher-avt"
                ></avatar-org>
              </q-item-section>

              <q-item-section>
                <q-item-label
                  >{{ publisher }} -「 {{ identity }} 」</q-item-label
                >
                <q-item-label caption
                  >Posted on {{ publishTime.slice(0, 10) }} at
                  {{ publishTime.slice(10) }}</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-separator />

            <q-list bordered separator>
              <q-item clickable v-ripple class="row">
                <q-item-section class="col-4">
                  <div class="text-left text-weight-bold">Title:</div>
                </q-item-section>
                <q-item-section class="col-8">
                  <div class="text-left">{{ taskTitle }}</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="row">
                <q-item-section class="col-4">
                  <div class="text-left text-weight-bold">Deadline:</div>
                </q-item-section>
                <q-item-section class="col-8">
                  <div class="text-left">{{ deadline }}</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="row">
                <q-item-section class="col-4">
                  <div class="text-left text-weight-bold">People:</div>
                </q-item-section>
                <q-item-section class="col-8">
                  <div class="text-left">
                    {{
                      submitted.filter(
                        (item, index, arr) => arr.indexOf(item) === index
                      ).length
                    }}
                  </div>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                class="row"
                v-if="isSubmitted && username != publisher"
              >
                <q-item-section class="col-4">
                  <div class="text-left text-weight-bold">Rank:</div>
                </q-item-section>
                <q-item-section class="col-8">
                  <div class="text-left">{{ myRank }}</div>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple class="row">
                <q-item-section class="col-4">
                  <div class="text-left text-weight-bold">Score:</div>
                </q-item-section>
                <q-item-section class="col-8">
                  <div class="text-left">{{ scores }}</div>
                </q-item-section>
              </q-item>

              <q-item v-if="isSubmitted">
                <q-item-section class="col-12 q-px-sm">
                  <div class="text-center">
                    <q-btn
                      color="purple"
                      size="md"
                      @click="checkScoresDetails()"
                      class="score-btn"
                      >Score Details</q-btn
                    >
                  </div>
                </q-item-section>
              </q-item>

              <q-item class="column" v-if="username == publisher && !isConfirm">
                <q-item-section class="col q-my-sm">
                  <div class="text-center">
                    <el-switch
                      v-model="isManual"
                      active-text="Manually"
                      inactive-text="Automatically"
                      @change="setManual()"
                    >
                    </el-switch>
                  </div>
                </q-item-section>
                <q-item-section
                  class="col q-my-sm"
                  v-if="isManual && username == publisher"
                >
                  <q-btn color="blue" size="md" @click="manualCofirm()">
                    Confirm
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

      <el-main id="mainContent" class="q-ma-xl">
        <el-row :gutter="21" type="flex" class="row-bg" justify="center">
          <el-col :span="21" v-if="isversion1">
            <p class="edit-tip">The Optimal Version:</p>
            <div id="textDiv">
              <div>
                <span v-for="(item, index) in final_context" :key="index">
                  <span
                    v-for="(final_word, final_word_index) in item.final_words"
                    :key="final_word_index"
                    @click="showAll($event, final_word_index, index)"
                    :class="{ active: isActive }"
                  >
                    <el-badge :is-dot="final_word.isedited" class="badge">
                      <span
                        v-if="regtest.test(final_word.diff)"
                        v-html="final_word.diff"
                      >
                      </span>
                      <span v-else>
                        {{ final_word.diff }}
                      </span>
                    </el-badge>
                  </span>
                </span>
              </div>
            </div>
            <div class="q-pa-md q-gutter-sm edit-btn" v-if="isTeacher">
              <q-btn
                glossy
                color="purple-14"
                icon="publish"
                @click="changev1()"
                label="Submit Final Version"
                style="width: 20em"
              />
            </div>
            <div class="q-pa-md q-gutter-sm edit-btn" v-else>
              <q-btn
                glossy
                color="purple-14"
                icon="assignment_returned"
                @click="returnback()"
                label="Restore"
                v-show="isreadonly"
                style="width: 15em"
              />
              <q-btn
                glossy
                color="purple-13"
                icon="edit"
                @click="changev1()"
                label="Edit"
                v-show="isreadonly"
                style="width: 15em"
              />
            </div>
          </el-col>
          <el-col :span="20" v-else>
            <div>
              <p class="edit-tip">
                Listen carefully and write what you hear in the box.
              </p>
              <el-input
                type="textarea"
                :rows="15"
                :autosize="{ minRows: 15, maxRows: 30 }"
                placeholder="What is the speaker saying?"
                v-model="text1"
                style="font-size: 20px"
              ></el-input>
              <div class="q-px-md q-pt-md q-gutter-sm submit-btn">
                <q-btn
                  icon="upload"
                  color="purple-14"
                  @click="submitv1()"
                  style="width: 15em"
                  glossy
                  label="Submit"
                />
              </div>
            </div>
          </el-col>
          <!-- <div><button @click="splitVideo()">切割句子</button></div> -->
          <el-col :span="12" v-if="isedit">
            <div>
              <p class="edit-tip">Editing:</p>
              <div v-for="(item, i) in sentenceList" :key="i">
                <el-input
                  type="textarea"
                  :rows="1"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  v-model="sentenceList[i]"
                ></el-input>
              </div>
              <div class="q-pa-md q-gutter-sm edit-btn">
                <q-btn
                  style="width: 10em"
                  @click="cancelChangev1()"
                  color="deep-purple-4"
                  icon="clear"
                  label="Cancel"
                />
                <q-btn
                  style="width: 10em"
                  @click="tempsave()"
                  color="purple-14"
                  icon="save"
                  label="Save"
                />
                <q-btn
                  @click="submitmv()"
                  color="purple-13"
                  icon="check"
                  label="Confirm"
                  style="width: 10em"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <q-btn
        color="purple"
        icon="more"
        round
        class="q-mt-md"
        @click="showTimeline()"
        style="left: 3%; margin-top: -40px; margin-bottom: 40px"
      >
        <q-tooltip content-class="bg-accent">Show More</q-tooltip>
      </q-btn>
      <div class="con" v-show="isTimeline" ref="history">
        <a class="aui_close1" @click="closeTimeline()">×</a>
        <div class="q-px-lg q-pb-md">
          <q-timeline
            color="purple"
            style="height: 550px; margin-top: 37px; overflow-y: auto"
          >
            <q-timeline-entry
              v-for="(version, index) in versions"
              :key="index"
              :title="version.name"
              :subtitle="version.time"
            >
              <div>
                {{ version.version }}
              </div>
            </q-timeline-entry>
          </q-timeline>
        </div>
      </div>
    </div>
    <div id="wordOperate" ref="main">
      <a class="aui_close" @click="closeShow()">×</a>
      <el-table
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        class="eltable"
      >
        <el-table-column
          type="String"
          prop="diff"
          label="Diff Version"
          width="200"
        >
          <template slot-scope="scope">
            <span v-html="scope.row.diff"></span>
          </template>
        </el-table-column>
        <el-table-column prop="names" label="Users" width="380">
          <template slot-scope="scope">
            <span v-for="(item, i) in scope.row.names" :key="i">
              <span
                v-if="item.username == submitted[0]"
                style="font-weight: bold"
                >{{ item.username + "; " }}</span
              >
              <span v-else>{{ item.username + "; " }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :page-size="pagesize"
        :current-page="currpage"
        :total="tableData.length"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
      <!-- 每个句子的不同详细版本 -->
      <el-collapse>
        <el-collapse-item style="padding-bottom: 1px">
          <template slot="title">
            Details:<i class="header-icon el-icon-info"></i>
          </template>
          <el-table
            :data="
              senTableData.slice(
                (currpageS - 1) * pagesizeS,
                currpageS * pagesizeS
              )
            "
            class="eltable"
          >
            <el-table-column prop="provider" label="Username" width="80">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.provider }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              type="String"
              prop="sentenceDiff"
              label="Sentence"
              width="500"
            >
              <template slot-scope="scope">
                <span
                  v-html="scope.row.sentenceDiff"
                  style="word-wrap: break-word; width: 500px"
                ></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :page-size="pagesizeS"
            :current-page="currpageS"
            :total="senTableData.length"
            @current-change="handleCurrentChangeS"
            @size-change="handleSizeChangeS"
          >
          </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </div>
  </q-page>
</template>

<script>
import AvatarOrg from "./basic/Avatar";
import { QSpinnerFacebook } from "quasar";

var differ = require("../diff.js").differ;
var {
  countTechScores,
  countMatchPoints,
  linearReg,
} = require("../countScores.js");

export default {
  data() {
    return {
      userStatus: 0,
      isreadonly: true,
      isTeacher: false,
      text1: "", //当前用户作为第一个用户提交的第一版本
      isversion1: false, //判断是否有第一个版本
      isFinal: false, //判断是否有修改记录可以生成综合版本
      text_v1: "", //从数据库取得的第一个用户提交的第一版本，可能与text1不一样
      text_fn: "",
      isedit: false, //控制是否显示修改框
      textDiv: "", //当前页面的textDiv的值, 记录当前用户的修改版本
      currentCompareText: "", //当前页面的textDiv的值, 用来做比较基础
      sentences: [], //第一个用户提交的第一版本的分句结果
      username: "",
      diffList: [],
      tableData: [], //分页相关
      senTableData: [], //句子版本相关
      pagesize: 3, //修改分页相关
      currpage: 1, //修改分页相关
      pagesizeS: 1, //句子版本分页相关
      currpageS: 1, //句子版本分页相关
      isActive: false,
      seen: false,
      tempindex: 0,
      current: 0,
      diffId: "", //当前任务的_id
      fileName: "",
      userList: [],
      inUserList: false,
      api: "/api",
      player: "", //播放器
      rateSelected: "1.0", //播放速度对象
      isVideo: false, //文件类型是否为视频
      videoType: ["AVI", "baiwma", "rmvb", "rm", "flash", "mp4", "mid", "3GP"], //视频类型
      options: ["0.5", "1.0", "1.25", "1.5", "2.0"], //音频播放速度选项
      sentenceList: [], //获得去掉标签之后各句子的综合版本，遍历填充修改框
      final_context: [],
      dbList: [],
      regtest: /[<ins>|<del>|<subins>]/g,
      publisher: "",
      status: "1",
      identity: "",
      submitted: [], //已提交修改的名单
      isAddition: false, //是否显示增加句子的文本框和按钮
      addition: "", //增加的内容
      autoplay: false, //控制视频自动播放
      taskTitle: "",
      deadline: "",
      publishTime: "",
      isTimeline: false,
      versions: [],
      reverse: true,
      taskLabels: [],
      userId: "",
      versionsList: "", //在created中从后台获取数据
      techScoreList: {}, //统计每个人得到的技术分
      matchScoreList: {}, //统计每个人得到的匹配分
      techList: [],
      matchList: [],
      scoreList: [], //总分
      countMatchScores: [],
      techPoints: 60, //总的技术分
      matchPoints: 40, //总的匹配分
      scores: "Not announced yet.",
      averScores: "", //平均分
      isPublisher: false,
      isSubmitted: false,
      taskCoins: 0, //每个任务可获得的金币
      myRank: "",
      timespan: 0, //video播放实际时间
      isCountTime: false, //是否计时
      isManual: "", //是否自动计算分数
      isConfirm: "", //是否确认成绩
      userTasks: "", //用户的tasks
      video_id: "", //对应视频的_id
      authcode: "", //对应任务的验证码
      configuration: "", //该任务的偏好设置
    };
  },
  components: {
    AvatarOrg,
  },
  methods: {
    tempsave() {
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          this.userList = res.data[0].userList;
          var isName = false;
          for (var uh = 0; uh < this.userList.length; uh++) {
            if (this.username == this.userList[uh].name) {
              isName = true;
              this.userList[uh].my_sentences = this.sentenceList;
            }
          }
          //如果没有则增加
          if (isName == false) {
            this.userList.push({
              name: this.username,
              my_sentences: this.sentenceList,
            });
          }

          this.$axios.post(this.api + "/tempsave", {
            params: {
              _id: this.diffId,
              userList: this.userList,
            },
          });
          this.$notify({
            type: "success",
            message: "success",
            position: "top-right",
            offset: 100,
          });
          this.isedit = false;
        });
    },
    returnback() {
      if (this.submitted.indexOf(this.username) >= 0) {
        if (this.submitted.indexOf(this.username) == 0) {
          if (this.submitted.indexOf(this.username, 1) == -1) {
            var user_index = this.userList.findIndex(
              (attr) => attr.name == this.username
            );
            if (user_index >= 0) {
              this.isedit = true;
              this.sentenceList = this.userList[user_index].my_sentences;
            } else {
              this.isedit = false;
              this.$notify({
                // title: "警告",
                type: "warning",
                message: "No recorded history",
                position: "top-right",
                offset: 100,
              });
            }
          } else {
            this.isedit = false;
            this.$notify({
              // title: "警告",
              type: "warning",
              message: "You have submitted your dictation before.",
              position: "top-right",
              offset: 100,
            });
          }
        } else {
          this.isedit = false;
          this.$notify({
            // title: "警告",
            type: "warning",
            message: "You have submitted your dictation before.",
            position: "top-right",
            offset: 100,
          });
        }
      } else {
        var user_index = this.userList.findIndex(
          (attr) => attr.name == this.username
        );
        if (user_index >= 0) {
          this.sentenceList = this.userList[user_index].my_sentences;
          this.isedit = true;
        } else {
          this.isedit = false;
          this.$notify({
            // title: "警告",
            type: "warning",
            message: "No recorded history",
            position: "top-right",
            offset: 100,
          });
        }
      }
    },
    showTimeline() {
      this.$axios
        .get(this.api + "/allVersions?_id=" + this.diffId)
        .then((res) => {
          // console.log("res data", res.data);
          this.versions = res.data;
          if (this.versions.length > 0) {
            this.isTimeline = true;
            document.addEventListener("click", this.hidePanel1, false);
          } else {
            this.$notify({
              // title: "警告",
              type: "warning",
              message: "No one has finished the current task.",
              position: "top-right",
              offset: 100,
            });
          }
        });
    },
    closeTimeline() {
      this.isTimeline = false;
      document.removeEventListener("click", this.hidePanel1, false);
    },
    //使用document.querySelector实现锚点的效果
    toBest(idName) {
      document.querySelector(idName).scrollIntoView(true);
    },
    //回到顶部
    toTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    //浮框
    changePos(event) {
      var wordOperate = document.getElementById("wordOperate");
      wordOperate.style.position = "fixed";
      wordOperate.style.display = "inline-block";
      wordOperate.style.backgroundColor = "white";
      if (event.clientX < window.screen.width / 2) {
        wordOperate.style.left = event.clientX + 5 + "px";
      } else {
        wordOperate.style.left = event.clientX - wordOperate.offsetWidth + "px";
      }

      if (event.clientY > window.screen.height / 2) {
        wordOperate.style.top = event.clientY - wordOperate.offsetHeight + "px";
      } else {
        wordOperate.style.top = event.clientY + "px";
      }
    },
    //确定是音频播放器还是视频播放器
    decidePlayer() {
      if (this.isVideo) {
        this.player = document.querySelector("#video > video");
      } else {
        this.player = document.getElementById("audio");
      }
    },
    //控制播放速度
    handleSpeed() {
      this.player.playbackRate = this.rateSelected;
    },
    //控制后退10秒
    goBack() {
      this.player.currentTime -= 10;
    },
    //控制前进10秒
    goForward() {
      this.player.currentTime += 10;
    },
    //分页相关
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //分页相关
    handleSizeChange(val) {
      this.pagesize = val;
    },
    //分页相关
    handleCurrentChangeS(val) {
      this.currpageS = val;
    },
    //分页相关
    handleSizeChangeS(val) {
      this.pagesizeS = val;
    },
    //提交第一份，只执行一次，但会决定数据库的结构
    submitv1() {
      //获得当前时间
      let newdate = this.$moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

      var flag = true;
      var regstr = /([A-Za-z0-9\'\"\!\?\-\:\;\.\,\%\$\&\[ \]])/;
      var limited_words = 0;
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          limited_words = res.data[0].words;
          // console.log(limited_words);
          var video_id = res.data[0].videoId; //对应视频的_id
          var authcode = res.data[0].authcode; //对应任务的验证码
          //输入的内容非空
          if (this.text1) {
            var t_length = this.text1.split(" ").length;
            // console.log(t_length)
            if (t_length > limited_words) {
              for (var a = 0; a < this.text1.length; a++) {
                var regResult = regstr.test(this.text1[a]);
                // console.log("-----1", regResult);
                if (regResult === false) {
                  // console.log("aaa");
                  flag = false;
                }
              }
              // console.log("flag", flag);
              if (flag) {
                this.$axios
                  .post(this.api + "/updateVersion", {
                    //整篇更新到版本列表
                    params: {
                      _id: this.diffId,
                      time: newdate,
                      new_version: this.text1,
                      username: this.username,
                      userId: this.userId,
                    },
                  })
                  .then((result) => {
                    // console.log("aaa");
                    this.$axios
                      .get(this.api + "/currentTask?_id=" + this.diffId)
                      .then((res) => {
                        // console.log("111");
                        this.diffList = res.data[0].diffList;
                        // console.log("diffList1", this.diffList)
                        this.userList = res.data[0].userList;
                        if (this.diffList.length == 0) {
                          this.$axios
                            .get(this.api + "/allVersions?_id=" + this.diffId)
                            .then((res) => {
                              // console.log("res data", res.data);
                              var owner = res.data[0].name; //第一个提交的用户
                              if (owner == this.username) {
                                this.$notify({
                                  type: "success",
                                  message:
                                    "Submitted and got 5 coins (Tip:The first one will get 10 coins)",
                                  position: "top-right",
                                  offset: 100,
                                });
                                if (
                                  this.userList.indexOf(
                                    this.userList.find(
                                      (obj) => obj.name == owner
                                    )
                                  ) == -1
                                ) {
                                  this.userList.push({
                                    name: owner,
                                    my_sentences: [],
                                  });
                                }
                                this.submitted.push(owner);
                                this.$axios
                                  .get(
                                    this.api + "/profile?name=" + this.username
                                  )
                                  .then((res) => {
                                    var userId = res.data[0]._id;
                                    var userTasks = res.data[0].myTasks;
                                    if (
                                      // 如果myTasks里已经有该任务了，则返回true，执行console.log的内容；
                                      // 如果没有，则返回false，执行userTasks.push内容
                                      userTasks.some((item) => {
                                        if (item.taskId == this.diffId) {
                                          return true;
                                        }
                                      })
                                    ) {
                                      console.log("该任务已加入任务栏中！");
                                    } else {
                                      userTasks.push({
                                        taskId: this.diffId,
                                        videoId: video_id,
                                        deadline: this.deadline,
                                        authcode: authcode,
                                        title: this.taskTitle,
                                        label: this.taskLabels,
                                        time: newdate,
                                        scores: "",
                                      });
                                    }
                                    // 更新用户“myTasks”

                                    this.userTasks = userTasks;

                                    this.$axios
                                      .post(this.api + "/updateMyTasks", {
                                        params: {
                                          _id: userId,
                                          myTasks: userTasks,
                                          time: newdate,
                                        },
                                      })
                                      .then((res) => {
                                        console.log("这里成功啦");
                                      })
                                      .catch((error) => {
                                        console.log("这次失败了", error);
                                      });
                                  });
                              } else {
                                this.$notify({
                                  // title: "警告",
                                  type: "warning",
                                  message: "Submitted (Not the first one)",
                                  position: "top-right",
                                  offset: 100,
                                });
                              }
                              this.isversion1 = true;
                              this.text_v1 = res.data[0].version;
                              var diffList1 = [];
                              //分句并存储到数据库中
                              this.sentences = this.text_v1.split(
                                /(?<=[^A-Z].[.?]) +(?=[A-Z])/g
                              );
                              // console.log(this.sentences);
                              for (
                                var sen = 0;
                                sen < this.sentences.length;
                                sen++
                              ) {
                                var reg2 = /\,\s/g;
                                var reg3 = /\.\s/g;
                                var reg4 = /\!\s/g;
                                var reg5 = /\?\s/g;
                                this.sentences[sen] = this.sentences[sen] + " ";
                                if (reg2.test(this.sentences[sen]) === true) {
                                  this.sentences[sen] = this.sentences[
                                    sen
                                  ].replace(reg2, " , ");
                                  // console.log("2t", text)
                                  console.log("2");
                                }
                                if (reg3.test(this.sentences[sen]) === true) {
                                  console.log("3");
                                  this.sentences[sen] = this.sentences[
                                    sen
                                  ].replace(reg3, " . ");
                                  // console.log("3t", text)
                                }
                                if (reg4.test(this.sentences[sen]) === true) {
                                  console.log("4");
                                  this.sentences[sen] = this.sentences[
                                    sen
                                  ].replace(reg4, " ! ");
                                }
                                if (reg5.test(this.sentences[sen]) === true) {
                                  console.log("5");
                                  this.sentences[sen] = this.sentences[
                                    sen
                                  ].replace(reg5, " ? ");
                                }
                                let words = this.sentences[sen].split(" "); //分词
                                //去掉空值
                                for (var y = 0; y < words.length; y++) {
                                  if (words[y] == "") {
                                    words.splice(y, 1);
                                    y = y - 1;
                                  }
                                }
                                let word_list = []; //分词列表，包括用户列表
                                var names = new Array();
                                var user_item = {
                                  username: this.username,
                                  edittime: newdate,
                                };
                                names.push(user_item);
                                for (var wor = 0; wor < words.length; wor++) {
                                  var wordItem = {
                                    // index: wor,
                                    word: words[wor],
                                    diffs: [
                                      {
                                        diff: words[wor],
                                        names: names,
                                        num: 1,
                                        time: newdate,
                                        status: 0, //0=>原词，没修改，初始值；1=>增加；2=>有增有删；-1=>删除
                                      },
                                    ],
                                    isedited: false,
                                    isfirst: true, //相对第一版，用于区分改版是否为增加的内容
                                  };
                                  word_list.push(wordItem);
                                }
                                //新改动
                                var sentence_item = {
                                  sentences: [
                                    {
                                      provider: this.username,
                                      sentence: this.sentences[sen],
                                      time: newdate,
                                    },
                                  ],
                                  words: word_list,
                                  author: this.username,
                                  sentenceDiffs: [
                                    {
                                      provider: this.username,
                                      sentenceDiff: this.sentences[sen],
                                    },
                                  ],
                                };
                                diffList1.push(sentence_item);
                              }
                              var user_index = this.userList.findIndex(
                                (attr) => attr.name == this.username
                              );
                              this.userList[
                                user_index
                              ].my_sentences = this.sentences;
                              // console.log("deffList2", diffList1)
                              this.$axios
                                .post(this.api + "/updatediff", {
                                  //将分词分句结果更新到数据库
                                  params: {
                                    _id: this.diffId,
                                    diffList: diffList1,
                                    userList: this.userList,
                                    submitted: this.submitted,
                                  },
                                })
                                .then((res) => {
                                  // console.log("-------" + res);
                                  // this.$router.go(0);
                                });
                              this.$router.go(0);
                              // this.createFinalVersion();
                            });

                          // this.createFinalVersion();
                        } else {
                          this.isversion1 = true;
                          this.isFinal = true;
                          //形成综合版本
                          this.$router.go(0);
                          // this.createFinalVersion();
                          this.$notify({
                            // title: "警告",
                            type: "warning",
                            message: "Submitted (Not the first one)",
                            position: "top-right",
                            offset: 100,
                          });
                        }
                      });
                  });
                // this.$router.go(0);
                // this.createFinalVersion();
              } else {
                // console.log(flag);
                this.$notify({
                  // title: "警告",
                  type: "warning",
                  message:
                    "Your dictation text contains illegal characters, please check!",
                  position: "top-right",
                  offset: 100,
                });
              }
            } else {
              this.$notify({
                // title: "警告",
                type: "warning",
                message:
                  "The current task needs to be more than " +
                  limited_words +
                  " words",
                position: "top-right",
                offset: 100,
              });
            }
          } else {
            //输入的内容为空
            this.$notify({
              // title: "警告",
              type: "warning",
              message: "You did not input anything.",
              position: "top-right",
              offset: 100,
            });
          }
        });
      // this.$router.go(0); //刷新页面
    },
    //打开增加句子编辑面板
    // editv1() {
    //   this.$notify({
    //     title: "Tip",
    //     message: "每次只能增加一个句子哦！",
    //     position: "top-right",
    //     offset: 100,
    //   });
    //   this.isAddition = true;
    //   this.addition = "";
    // },
    //点击修改按钮
    changev1() {
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          // this.submitted = res.data[0].submitted;
          // console.log("changev1 submitted", this.submitted);
          if (this.submitted.indexOf(this.username) >= 0) {
            if (this.submitted.indexOf(this.username) == 0) {
              if (this.submitted.indexOf(this.username, 1) == -1) {
                //点击修改按钮
                this.isedit = true;
                //当前用户要提交的版本
                // console.log(document.getElementById("textDiv").innerHTML);
                this.textDiv = document
                  .getElementById("textDiv")
                  .innerHTML.replace(/(<span[^>]*?>)|(<\/span>)/g, "");
                //用于比较的文本，去除标签
                this.currentCompareText = document
                  .getElementById("textDiv")
                  .innerHTML.replace(/(<span[^>]*?>)|(<\/span>)/g, "");
              } else {
                this.isedit = false;
                this.$notify({
                  // title: "警告",
                  type: "warning",
                  message: "You have submitted your dictation before.",
                  position: "top-right",
                  offset: 100,
                });
              }
            } else {
              this.isedit = false;
              this.$notify({
                // title: "警告",
                type: "warning",
                message: "You have submitted your dictation before.",
                position: "top-right",
                offset: 100,
              });
            }
          } else {
            //点击修改按钮
            this.isedit = true;
            //当前用户要提交的版本
            this.textDiv = document
              .getElementById("textDiv")
              .innerHTML.replace(/(<span[^>]*?>)|(<\/span>)/g, "");

            //用于比较的文本，去除标签
            this.currentCompareText = document
              .getElementById("textDiv")
              .innerHTML.replace(/(<span[^>]*?>)|(<\/span>)/g, "");
          }
        });
    },
    //取消修改
    cancelChangev1() {
      this.isedit = false;
    },
    //确定数组里是否有某个元素
    findElem(arrayToSearch, attr, val) {
      for (var i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][attr] == val) {
          return i;
        }
      }
      return -1;
    },
    //提交当前用户的版本
    submitmv() {
      this.$confirm(
        "Each user can only submit once. Do you want to continue?",
        "Alert",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
          center: true,
        }
      ).then(() => {
        var flag1 = true;
        var regstr = /([A-Za-z0-9\'\"\!\?\:\-\;\.\,\%\$\&\[ \]])/;
        for (var sl = 0; sl < this.sentenceList.length; sl++) {
          //每个句子
          for (var c = 0; c < this.sentenceList[sl].length; c++) {
            var regResult = regstr.test(this.sentenceList[sl][c]);
            // console.log("+++++3", regResult);
            if (regResult === false) {
              // console.log("ccc");
              flag1 = false;
            }
          }
        }
        // console.log("flag1", flag1);
        if (flag1) {
          //获得当前时间
          let newdate = this.$moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
          //获得最新的修改列表
          this.$axios
            .get(this.api + "/currentTask?_id=" + this.diffId)
            .then((res) => {
              this.dbList = res.data[0].diffList;
            });
          // console.log("dbDiffList", this.dbList);
          // console.log("sentenceList", this.sentenceList);
          var listLen = this.dbList.length;
          //与第一版本比较，根据句子的数量进行循环（修改后提交内容对应的句子）
          var final_result = []; //记录所有的修改情况
          for (var len = 0; len < listLen; len++) {
            var sen_result = []; //记录当前句子的修改情况
            var sentence = this.sentenceList[len] + " ";
            sentence = sentence
              .replace(/\s{2,}/g, " ")
              .replace(/[\r\n]/g, " ")
              .replace(/(\r\n|\n|\r)/g, " ")
              .replace(/\.\s/g, " . ")
              .replace(/\,\s/g, " , ")
              .replace(/\!\s/g, " ! ")
              .replace(/\?\s/g, " ? ");
            //新改动：换成跟 最新版本 的 第一版本句子 比较
            var v1_sentences = this.dbList[len].sentences.sort(
              this.compare("time")
            );
            // console.log("v1_sentences", v1_sentences);
            var v1_sentence = v1_sentences[v1_sentences.length - 1].sentence;
            var s_result1 = differ
              .parse(" " + v1_sentence, " " + sentence)
              .replace(/%2C/g, ",")
              .replace(/%3F/g, "?")
              .replace(/%27/g, "'")
              .replace(/%3A/g, ":")
              .replace(/%21/g, "!");
            //将单独的ins标签替换为del-ins标签
            // console.log("s_result1", s_result1);
            var reg = /([a-zA-Z0-9]+[\-\'\.\:]?[a-zA-Z0-9]*\s(<ins[^>]*?>.*?<\/ins>\s)+)|([\,\.\?\!]\s(<ins[^>]*?>.*?<\/ins>\s)+)/g;
            var insMatchResult = s_result1.match(reg);
            // console.log("insMatchResult", insMatchResult);
            if (insMatchResult !== null) {
              for (var m = 0; m < insMatchResult.length; m++) {
                //去掉空的匹配结果
                if (insMatchResult[m] == "") {
                  insMatchResult.splice(m, 1);
                  m = m - 1;
                } else {
                  s_result1 = s_result1.replace(insMatchResult[m], "<>"); //替换成特殊的符号 占位
                  var del_content = insMatchResult[m].split(" ")[0]; //原词
                  var edited_ver =
                    "<del>" +
                    del_content +
                    "</del> <ins>" +
                    del_content +
                    "</ins>";
                  insMatchResult[m] = insMatchResult[m].replace(
                    del_content,
                    edited_ver
                  );
                }
                s_result1 = s_result1
                  .replace("<>", insMatchResult[m])
                  .replace(/(\r\n|\n|\r)/g, " ");
              }
            }
            // console.log("after", s_result1);
            var s_result_del = s_result1
              .replace(/<ins[^>]*?>.*?<\/ins>\s/g, "")
              .replace(/(\r\n|\n|\r)/g, " ");
            //去掉所有ins标签，用于确认del标签的index
            var s_result_arr = s_result_del
              .trim()
              .split(/\s/g)
              .filter((d) => d);
            // console.log("s_result_arr", s_result_arr);
            // 给 s_result_arr 数组中每个词都加一个index和flag，便于后期找index
            var new_s_result_arr = s_result_arr.map((item, index) => {
              var robj = {};
              robj.index = index;
              robj.word = item;
              robj.flag = 0;
              return robj;
            });
            // console.log("new_s_result_arr", new_s_result_arr);
            //匹配出所有的修改
            var allMatchResult = s_result1.match(
              /((<del[^>]*?>.*?<\/del>\s)*(<ins[^>]*?>.*?<\/ins>\s)*)/g
            );
            // console.log("allMatchResult: ", allMatchResult);
            //对所有的匹配结果（修改）进行进一步的整合
            for (var n = 0; n < allMatchResult.length; n++) {
              //去掉空的匹配结果
              if (allMatchResult[n] == "") {
                allMatchResult.splice(n, 1);
                n = n - 1;
              } else {
                var matchSplit = allMatchResult[n]
                  .replace("\n", " ")
                  .replace("↵", " ")
                  .trim()
                  .split(/\s/g);
                // console.log("matchResult", matchSplit);
                var del = [];
                var ins = [];
                // var re1 = /<del[^>]*?>.*?<\/del>/g;
                // var re2 = /<ins[^>]*?>.*?<\/ins>/g;
                for (var t = 0; t < matchSplit.length; t++) {
                  //存储到相反的数组？？？
                  // console.log("m");
                  if (matchSplit[t].indexOf("<ins>")) {
                    // console.log("每个matchSplit：", matchSplit[t]);
                    // var del_index = s_result_arr.indexOf(matchSplit[t]);
                    var finishedItem = new_s_result_arr.find(
                      (item) => item.word == matchSplit[t] && item.flag == 0
                    );
                    if (finishedItem) {
                      var finishedIndex = new_s_result_arr.findIndex(
                        (item) => item == finishedItem
                      );
                      new_s_result_arr[finishedIndex].flag = 1;
                      var del_index = finishedIndex;
                      var del_item = {
                        del: matchSplit[t],
                        del_index: del_index,
                      };
                      del.push(del_item);
                    }
                  }
                  if (matchSplit[t].indexOf("<del>")) {
                    ins.push(matchSplit[t]);
                  }
                }
                // console.log("del arr", del);
                // console.log("ins arr", ins);
                if (ins.length == 0) {
                  for (var d = 0; d < del.length; d++) {
                    var diff1 = del[d].del.trim();
                    // console.log("a", diff1)
                    var del_content1 = del[d].del.replace(
                      /(<del[^>]*?>)|(<\/del>)/g,
                      ""
                    );
                    // console.log("del_content1", del_content1)
                    var item1 = {
                      word: del_content1,
                      diff: diff1,
                      index: del[d].del_index,
                      status: -1, //删除
                    };
                    sen_result.push(item1);
                  }
                }
                if (del.length == 1 && ins.length > 0) {
                  // console.log("del_del", del[0]);
                  var del_content2 = del[0].del
                    .replace(/(<del[^>]*?>)|(<\/del>)/g, "")
                    .trim();
                  var ins_content2 = ins[0].replace(
                    /(<ins[^>]*?>)|(<\/ins>)/g,
                    ""
                  );
                  var ins_content22 = ins[ins.length - 1].replace(
                    /(<ins[^>]*?>)|(<\/ins>)/g,
                    ""
                  );
                  // console.log("del_content2", del_content2);
                  // console.log("ins_content2", ins_content2);
                  var diff2 = del[0].del.trim() + ins.join(" ");
                  var status2 = 2; //修改
                  if (del_content2 == ins_content2) {
                    // console.log("del_content2 == ins_content2");
                    status2 = 1; //增加
                    var ins_temp = ins.slice(1);
                    diff2 = del_content2.trim() + " " + ins_temp.join(" ");
                  }
                  // if (del_content2 == ins_content22) {
                  //   console.log("del_content2 == ins_content22");
                  //   status2 = 1; //增加
                  //   var ins_temp = ins.slice(-1);
                  //   console.log("ins_temp", ins_temp)
                  //   diff2 = del_content2.trim() + " " + ins_temp.join(" ");
                  // }
                  // console.log("diff2", diff2);
                  // console.log("del_content2", del_content2);
                  var item2 = {
                    word: del_content2,
                    diff: diff2,
                    index: del[0].del_index,
                    status: status2,
                  };
                  sen_result.push(item2);
                }
                if (del.length > 1) {
                  if (del.length == ins.length) {
                    for (var a = 0; a < del.length; a++) {
                      // console.log(del[a])
                      var del_content3 = del[a].del.replace(
                        /(<del[^>]*?>)|(<\/del>)/g,
                        ""
                      );
                      var ins_content3 = ins[a].replace(
                        /(<ins[^>]*?>)|(<\/ins>)/g,
                        ""
                      );
                      // console.log("c", del_content3)
                      if (del_content3 !== ins_content3) {
                        var item3 = {
                          word: del_content3,
                          diff: del[a].del.trim() + ins[a],
                          index: del[a].del_index,
                          status: 2,
                        };
                        sen_result.push(item3);
                      }
                    }
                  }
                  if (del.length < ins.length) {
                    for (var b = 0; b < del.length; b++) {
                      var del_content4 = del[b].del.replace(
                        /(<del[^>]*?>)|(<\/del>)/g,
                        ""
                      );
                      // console.log("d", del_content4)
                      var diff4 = "";
                      if (b == del.length - 1) {
                        var temp_ins = ins.slice(b);
                        diff4 = del[b].del.trim() + temp_ins.join(" ");
                      } else {
                        diff4 = del[b].del.trim() + ins[b];
                      }
                      // console.log("d", diff4)
                      var ins_content4 = ins[b].replace(
                        /(<ins[^>]*?>)|(<\/ins>)/g,
                        ""
                      );
                      if (del_content4 !== ins_content4) {
                        var item4 = {
                          word: del_content4,
                          diff: diff4,
                          index: del[b].del_index,
                          status: 2,
                        };
                        sen_result.push(item4);
                      }
                    }
                  }
                  if (del.length > ins.length) {
                    var del1 = del[1].del
                      .replace(/(<del[^>]*?>)|(<\/del>)/g, "")
                      .trim();
                    var del0 = del[0].del
                      .replace(/(<del[^>]*?>)|(<\/del>)/g, "")
                      .trim();
                    if (del.length == 2 && ins.length == 1) {
                      var ins0 = ins[0]
                        .replace(/(<ins[^>]*?>)|(<\/ins>)/g, "")
                        .trim();
                      if (del1 == ins0) {
                        var item5 = {
                          word: del0,
                          diff: del[0].del.trim(),
                          index: del[0].del_index,
                          status: -1,
                          isAbnormal: false,
                        };
                        sen_result.push(item5);
                      } else {
                        for (var c = 0; c < ins.length; c++) {
                          var del_content5 = del[c].del
                            .replace(/(<del[^>]*?>)|(<\/del>)/g, "")
                            .trim();
                          var ins_content5 = ins[c]
                            .replace(/(<ins[^>]*?>)|(<\/ins>)/g, "")
                            .trim();
                          // console.log("e", del_content5)
                          if (del_content5 !== ins_content5) {
                            var item5 = {
                              word: del_content5,
                              diff: del[c].del.trim() + ins[c],
                              index: del[c].del_index,
                              status: 2,
                              isAbnormal: false,
                            };
                            sen_result.push(item5);
                          }
                        }
                        var temp_del = del.slice(ins.length, del.length);
                        for (var f = 0; f < temp_del.length; f++) {
                          var diff6 = temp_del[f].del.trim();
                          var del_content6 = temp_del[f].del.replace(
                            /(<del[^>]*?>)|(<\/del>)/g,
                            ""
                          );
                          // console.log("e", diff6)
                          // console.log("e", del_content6)
                          var item6 = {
                            word: del_content6,
                            diff: diff6,
                            index: temp_del[f].del_index,
                            status: -1,
                            isAbnormal: false,
                          };
                          sen_result.push(item6);
                        }
                      }
                    } else {
                      for (var c = 0; c < ins.length; c++) {
                        var del_content5 = del[c].del
                          .replace(/(<del[^>]*?>)|(<\/del>)/g, "")
                          .trim();
                        var ins_content5 = ins[c]
                          .replace(/(<ins[^>]*?>)|(<\/ins>)/g, "")
                          .trim();
                        // console.log("e", del_content5)
                        if (del_content5 !== ins_content5) {
                          var item5 = {
                            word: del_content5,
                            diff: del[c].del.trim() + ins[c],
                            index: del[c].del_index,
                            status: 2,
                            isAbnormal: false,
                          };
                          sen_result.push(item5);
                        }
                      }
                      var temp_del = del.slice(ins.length, del.length);
                      for (var f = 0; f < temp_del.length; f++) {
                        var diff6 = temp_del[f].del.trim();
                        var del_content6 = temp_del[f].del.replace(
                          /(<del[^>]*?>)|(<\/del>)/g,
                          ""
                        );
                        // console.log("e", diff6)
                        // console.log("e", del_content6)
                        var item6 = {
                          word: del_content6,
                          diff: diff6,
                          index: temp_del[f].del_index,
                          status: -1,
                          isAbnormal: false,
                        };
                        sen_result.push(item6);
                      }
                    }
                  }
                }
              }
            }
            final_result.push(sen_result);
          }
          // console.log("final_result: ", final_result);
          //再取一次数据，判断是属于哪个单词的修改，判断该修改是否存在
          //如果存在，直接加入用户，如果不存在，加入该修改以及用户
          this.$axios
            .get(this.api + "/currentTask?_id=" + this.diffId)
            .then((res) => {
              this.dbList = res.data[0].diffList;
            });
          // console.log("dbDiffList2", this.dbList);
          for (var r = 0; r < final_result.length; r++) {
            //r表示文本中的第r句
            var s_orders = final_result[r]; //第r句的修改记录
            // console.log("s_orders: ", s_orders);
            var s_words = this.dbList[r].words; //第r句的分词结果
            // console.log("s_words: ", s_words);
            var s_sentences = this.dbList[r].sentenceDiffs; //第r句的不同版本
            //新改动
            var new_sentences = this.dbList[r].sentences;
            if (s_orders.length == 0) {
              //第r句的修改记录为空
              s_sentences.push({
                provider: this.username,
                sentenceDiff: this.sentenceList[r],
              });
              // 由于数据库中的顺序会随机改变，所以先匹配再插入更改数据
              s_words.forEach((item) => {
                var no_edited_word = item.word;
                var no_edited_index = item.diffs.findIndex(
                  (attr) => attr.diff == no_edited_word
                );
                item.diffs[no_edited_index].names.push({
                  username: this.username,
                  edittime: newdate,
                });
                item.diffs[no_edited_index].num++;
                item.diffs[no_edited_index].time = newdate;
              });
            } else {
              //第r句的修改记录不为空
              // 第一部分：将修改记录替换到不同句子的版本展示中，便于展示修改的地方
              // 整合第二部分于第一部分中：判断每个词语是否有对应的修改
              var editing_words = [];
              s_words.forEach((item, index) => {
                var itemIndex = index;
                var replacedItemIndex = s_orders.indexOf(
                  s_orders.find((element) => element.index == itemIndex)
                );
                if (replacedItemIndex != -1) {
                  if (s_orders[replacedItemIndex].status == 1) {
                    //对前一个词的处理   补充：句尾的标点符号
                    var find_index = this.findElem(item.diffs, "status", 0);
                    // console.log("find_indexaaaa", find_index);
                    item.diffs[find_index].names.push({
                      username: this.username,
                      edittime: newdate,
                    });
                    item.diffs[find_index].num++;
                    item.diffs[find_index].time = newdate;

                    var r_ins_words = s_orders[replacedItemIndex].diff.split(
                      " "
                    );
                    var ins_words = r_ins_words.slice(1);
                    var ins_words_arr = [
                      {
                        word: r_ins_words[0],
                        diffs: [
                          {
                            styleDiff: r_ins_words[0], //展示数据
                          },
                        ],
                        isedited: false,
                      },
                    ];

                    //I love China.
                    //I very love China too.
                    ins_words.forEach((i, index) => {
                      var i_word = i.replace(/(<ins[^>]*?>)|(<\/ins>)/g, "");
                      var i_index = s_orders[replacedItemIndex].index;
                      var i_names = new Array();
                      var user_item = {
                        username: this.username,
                        edittime: newdate,
                      };
                      i_names.push(user_item);
                      var ins_wordItem = {
                        index: i_index,
                        word: i_word,
                        diffs: [
                          {
                            diff: i_word,
                            styleDiff: "<subins>" + i_word + "</subins>",
                            names: i_names,
                            num: 1,
                            time: newdate,
                            status: 0,
                          },
                        ],
                        isedited: false,
                        isfirst: false, //相对第一版，用于区分改版是否为增加的内容
                      };
                      ins_words_arr.push(ins_wordItem);
                    });
                    console.log("ins_words_arr aaaa", ins_words_arr);
                    editing_words.push(ins_words_arr);
                  } else {
                    var find_result = this.findElem(
                      item.diffs,
                      "diff",
                      s_orders[replacedItemIndex].diff
                    );
                    if (find_result == -1) {
                      //不存在
                      var names = new Array();
                      var user_item = {
                        username: this.username,
                        edittime: newdate,
                      };
                      names.push(user_item);
                      var diff_item = {
                        diff: s_orders[replacedItemIndex].diff,
                        names: names,
                        num: 1,
                        time: newdate,
                        status: s_orders[replacedItemIndex].status,
                      };
                      item.diffs.push(diff_item);
                      item.isedited = true;
                    } else {
                      item.diffs[find_result].names.push({
                        username: this.username,
                        edittime: newdate,
                      }); //将当前用户加入列表
                      item.diffs[find_result].num++; //数量加1
                      item.diffs[find_result].time = newdate; //更新日期
                    }
                    var word_diff = item.word.replace(
                      item.word,
                      s_orders[replacedItemIndex].diff
                    );
                    editing_words.push(word_diff);
                  }
                } else {
                  var no_edited_word = item.word;
                  console.log("no_edited_word", no_edited_word);
                  // console.log("item.diffs", item.diffs);
                  var no_edited_index = item.diffs.findIndex((attr) => {
                    return attr.diff == no_edited_word;
                  });
                  console.log("no_edited_index", no_edited_index);
                  item.diffs[no_edited_index].names.push({
                    username: this.username,
                    edittime: newdate,
                  });
                  item.diffs[no_edited_index].num++;
                  item.diffs[no_edited_index].time = newdate;

                  if (item.isfirst == true) {
                    editing_words.push(item.word);
                  } else {
                    // console.log(
                    //   "no_edited_word >> item.diffs[no_edited_index].styleDiff",
                    //   item.diffs[no_edited_index].styleDiff
                    // );
                    editing_words.push(item.diffs[no_edited_index].styleDiff);
                  }
                }
              });
              console.log("editing_words1", editing_words);
              var deepFlatten = (arr) =>
                [].concat(
                  ...arr.map((v) => (Array.isArray(v) ? deepFlatten(v) : v))
                );

              var more_ins_arr = []; //增加的原词数组
              for (var ma = 0; ma < editing_words.length; ma++) {
                if (Array.isArray(editing_words[ma])) {
                  more_ins_arr.push(editing_words[ma].slice(1));
                }
              }
              console.log("more_ins_arr", more_ins_arr); //more_ins_arr [[1, 2, 3], [4, 5], [7, 8]]
              var more_ins_arr1 = deepFlatten(more_ins_arr);
              console.log("more_ins_arr1", more_ins_arr1); //[1, 2, 3, 4, 5, 7, 8]

              for (var va = 0; va < more_ins_arr1.length; va++) {
                more_ins_arr1[va].index = more_ins_arr1[va].index + va + 1;
                s_words.splice(more_ins_arr1[va].index, 0, more_ins_arr1[va]);
              }
              // console.log("s_words2222", s_words);

              //新改动
              if (more_ins_arr1.length > 0) {
                var v1_words = [];
                v1_words = s_words.map((word) => {
                  return word.word;
                });
                console.log("v1_words", v1_words);
                var new_sentence = v1_words.join(" ");
                var new_item = {
                  provider: this.username,
                  sentence: new_sentence,
                  time: newdate,
                };
                new_sentences.push(new_item);
              }

              // console.log("s_words3333", s_words);

              editing_words = deepFlatten(
                editing_words.map((w) => {
                  if (Array.isArray(w) == true) {
                    var sub_sen = w.map((iw) => {
                      console.log(iw.diffs[0].styleDiff);
                      return iw.diffs[0].styleDiff;
                    });
                    return sub_sen;
                  } else {
                    return w;
                  }
                })
              );
              // console.log("editing_words2", editing_words);
              //["In", "<subins>@@@</subins>", "<subins>@@@@@@@@@@@</subins>", "Turkey,", "<del>have</del><ins>had</ins>", "earthquake."]
              //判断是否为标点符号
              // var regE1 = /\,|\.|\!|\?|\.\"|\.\'|\!\"|\!\'|\?\"|\?\'/;
              var regE1 = /\,|\.|\!|\?/;
              for (var ve = 0; ve < editing_words.length; ve++) {
                if (regE1.test(editing_words[ve])) {
                  editing_words[ve] = editing_words[ve];
                } else {
                  editing_words[ve] = " " + editing_words[ve];
                }
              }
              var editing_sentence = editing_words.join(" ");
              s_sentences.push({
                provider: this.username,
                sentenceDiff: editing_sentence,
              });
              console.log("sentenceDiffs: ", s_sentences);
            }
          }
          // console.log("bbb", this.dbList);

          //判断当前用户是否在userList中
          for (var h = 0; h < this.userList.length; h++) {
            if (this.username == this.userList[h].name) {
              this.inUserList = true;
            }
          }
          //如果没有则增加
          if (this.inUserList == false) {
            this.userList.push({
              name: this.username,
              my_sentences: this.sentenceList,
            });
          }
          console.log("submitmv submitted", this.submitted);
          this.submitted.push(this.username);

          //更新相应数据到数据库
          this.$axios.post(this.api + "/updatediff", {
            params: {
              _id: this.diffId,
              userList: this.userList,
              diffList: this.dbList,
              submitted: this.submitted,
            },
          });

          var new_version = this.sentenceList.join(" ");
          this.$axios.post(this.api + "/updateVersion", {
            params: {
              _id: this.diffId,
              new_version: new_version,
              time: newdate,
              username: this.username,
              userId: this.userId,
            },
          });

          // 当发布者超过截止日期后提交答案
          this.$axios
            .get(this.api + "/currentTask?_id=" + this.diffId)
            .then((res) => {
              //刷新diffList
              this.diffList = res.data[0].diffList;
              let newdate1 = this.$moment(new Date()).format(
                "YYYY/MM/DD HH:mm:ss"
              );
              if (
                this.username == this.publisher &&
                !this.isManual &&
                this.compareDate(newdate1, this.deadline)
              ) {
                this.countScores(); //"2021/02/05 00:00:00", this.deadline
                this.isConfirm = true;
              }
            });

          //关闭输入框
          this.isedit = false;
          this.loading = true;

          this.$notify({
            type: "success",
            message: "Success",
            position: "top-right",
            offset: 100,
          });
          this.createFinalVersion();
          // this.$router.go(0);
          this.$axios
            .get(this.api + "/currentTask?_id=" + this.diffId)
            .then((res) => {
              var video_id = res.data[0].videoId; //对应视频的_id
              var authcode = res.data[0].authcode; //对应任务的验证码
              this.$axios
                .get(this.api + "/profile?name=" + this.username)
                .then((res) => {
                  var userId = res.data[0]._id;
                  var userTasks = res.data[0].myTasks;
                  if (
                    // 如果myTasks里已经有该任务了，则返回true，执行console.log的内容；
                    // 如果没有，则返回false，执行userTasks.push内容
                    userTasks.some((item) => {
                      if (item.taskId == this.diffId) {
                        return true;
                      }
                    })
                  ) {
                    console.log("Joined Already!");
                  } else {
                    userTasks.push({
                      taskId: this.diffId,
                      videoId: video_id,
                      deadline: this.deadline,
                      authcode: authcode,
                      title: this.taskTitle,
                      label: this.taskLabels,
                      time: newdate,
                      scores: "",
                    });
                  }

                  // 更新用户“myTasks”
                  this.$axios.post(this.api + "/updateMyTasks", {
                    params: {
                      _id: userId,
                      myTasks: userTasks,
                    },
                  });
                });
            });
        } else {
          this.$notify({
            // title: "警告",
            type: "warning",
            message:
              "Your dictation text contains illegal characters, please check!",
            position: "top-right",
            offset: 100,
          });
        }
      });
      // .catch(() => {
      //   this.$notify({
      //     // title: "警告",
      //     type: "warning",
      //     message: "Cancelled",
      //     position: "top-right",
      //     offset: 100,
      //   });
      // });
    },
    //生成综合版本
    createFinalVersion() {
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          // this.openFullScreen2()
          this.dbList = res.data[0].diffList;
          //加载动画
          setTimeout(() => {
            this.loading = false;
          }, 1500);
          // console.log("dbList", this.dbList);
          var final_sentences = [];
          var only_sentences = [];
          var only_sentences1 = [];
          for (var k = 0; k < this.dbList.length; k++) {
            var words = this.dbList[k].words;
            var most_words = [];
            for (var w = 0; w < words.length; w++) {
              var words_diffs = words[w].diffs;
              var most_edited_word = words_diffs[words_diffs.length - 1].diff; //初始值
              //按时间排序
              //按用户数量排序
              var words_diffs2 = words_diffs
                .sort(this.compare("time"))
                .sort(this.compare("num"));
              // console.log("words_diffs2", words_diffs2)

              if (words_diffs2[words_diffs.length - 1].styleDiff) {
                most_edited_word = {
                  diff: words_diffs2[words_diffs.length - 1].styleDiff,
                  isedited: words[w].isedited,
                };
              } else {
                most_edited_word = {
                  diff: words_diffs2[words_diffs.length - 1].diff,
                  isedited: words[w].isedited,
                };
              }
              most_words.push(most_edited_word);
            }
            var final_sentence = "";
            for (var s = 0; s < most_words.length; s++) {
              most_words[s].diff.trim();
              most_words[s].diff = most_words[s].diff + " ";
              final_sentence = final_sentence + most_words[s].diff;
            }
            // var final_sentence = most_words.join("");
            final_sentences.push({
              final_sentence: final_sentence,
              final_words: most_words,
            });
            only_sentences.push(final_sentence);
          }
          for (var t = 0; t < only_sentences.length; t++) {
            var final_sentence1 = only_sentences[t]
              .replace(/(<del[^>]*?>.*?<\/del>)/g, "")
              .replace(/(<ins[^>]*?>)|(<\/ins>)/g, "")
              .replace(/(<subins[^>]*?>)|(<\/subins>)/g, "")
              .replace(/\s\.\s/g, ". ")
              .replace(/\s\,\s/g, ", ")
              .replace(/\s\!\s/g, "! ")
              .replace(/\s\?\s/g, "? ");
            // console.log(only_sentences[t])
            only_sentences1.push(final_sentence1);
          }
          // console.log(only_sentences1);
          // console.log("final_context: ", final_sentences);
          this.final_context = final_sentences;
          this.sentenceList = only_sentences1;
        });
      // 生成或获取综合版本时的加载过渡动画
      this.$q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "grey-2",
        spinnerSize: 60,
        backgroundColor: "purple-5",
      });
      // hiding in 5s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 3000);
      // console.log("aaaa", this.dbList);
      //显示提示信息
      // this.$message({
      //   message: "已更新",
      //   type: "success",
      // });
    },
    compare(attr, rev) {
      //第二个参数没有传递 默认升序排列
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = rev ? 1 : -1;
      }
      return function(a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      };
    },
    //ES6语法 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    showAll(event, index, s_index) {
      event || (event = window.event);
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true);
      this.tableData = [];
      //s_index表示句子序号；index表示单词序号
      this.seen = true;
      this.current = index;
      this.tempindex = index;
      this.isActive = true;
      // this.isShowAll = true;
      var words = this.dbList[s_index].words;
      this.tableData = words[index].diffs;
      // for (var i = 0; i < this.tableData.length; i++) {
      //   this.tableData[i].names = this.unique(this.tableData[i].names);
      // this.tableData[i].names = unique_names.join(", "); //bug：把names这个数组变成了字符串
      // }
      this.senTableData = this.dbList[s_index].sentenceDiffs;
      // console.log("senTableData: ", this.senTableData);
      // console.log("words: ", words);
      // console.log("tableData: ", this.tableData);
      this.changePos(event);
      // console.log(event);
      document.addEventListener("click", this.hidePanel, false);
    },
    closeShow() {
      this.seen = false;
      this.current = null;
      this.tempindex = null;
      this.isActive = false;
      // this.isShowAll = false;
      var wordOperate = document.getElementById("wordOperate");
      wordOperate.style.display = "none";
      document.removeEventListener("click", this.hidePanel, false);
    },
    hidePanel(e) {
      if (this.$refs.main && !this.$refs.main.contains(e.target)) {
        //点击除弹出层外的空白区域
        this.closeShow();
      }
    },
    hidePanel1(e) {
      if (this.$refs.history && !this.$refs.history.contains(e.target)) {
        //点击除弹出层外的空白区域
        this.closeTimeline();
      }
    },
    pip() {
      if (this.isVideo) {
        var video = document.querySelector("#video > video");
        if (!document.pictureInPictureElement) {
          //开启
          video.requestPictureInPicture().catch((error) => {
            console.log(
              error,
              "Video failed to enter Picture-in-Picture mode."
            );
          });
        } else {
          //关闭
          document.exitPictureInPicture().catch((error) => {
            console.log(
              error,
              "Video failed to leave Picture-in-Picture mode."
            );
          });
        }
      } else {
        this.$notify({
          // title: "警告",
          type: "warning",
          message: "Picture-in-picture is not supported.",
          position: "top-right",
          offset: 100,
        });
      }
    },

    // 计算分数
    countScores() {
      // this.$axios
      //   .post(this.api + "/getVersions", { params: { _id: this.diffId } })
      //   .then((res) => {
      //     this.versionsList = res.data; //获取每个人的版本
      //   });
      var { ts, fnl } = countTechScores(
        this.diffList,
        this.publisher,
        this.configuration.SMscore,
        this.submitted,
        this.configuration.timePercentage,
        this.configuration.timeSpan
      );
      this.matchPoints = 100 - this.configuration.SMscore;
      var { cms, ms } = countMatchPoints(
        this.versionsList,
        this.sentenceList,
        this.publisher,
        this.publishTime,
        this.deadline,
        this.matchPoints
      );
      this.techScoreList = ts;
      this.matchScoreList = ms;
      var sum = 0;
      var scoreList = [];
      var s = Array.from(new Set(this.submitted)); //如第一个人出现两次，则去除重复值
      for (var j = 0; j < s.length; j++) {
        var name = s[j];
        this.techScoreList[name] = !this.techScoreList[name]
          ? 0
          : this.techScoreList[name];
        this.matchScoreList[name] = !this.matchScoreList[name]
          ? 0
          : this.matchScoreList[name];
        if (name != this.publisher) {
          var scores =
            Number(this.techScoreList[name]) +
            Number(this.matchScoreList[name]);
          sum += scores;
          scoreList.push({
            name: name,
            matchScores: this.matchScoreList[name],
            techScores: this.techScoreList[name],
            scores: scores,
          });
        }
      }
      this.averScores = Math.round(sum / scoreList.length);

      scoreList.sort(this.compare("scores", false));
      var rankList = [];

      var pIndex = s.findIndex((item) => item == this.publisher);
      pIndex != -1 ? s.splice(pIndex, 1) : s;
      // 有发布者则把发布者去掉,无则保持原样

      for (var j = 0; j < s.length; j++) {
        scoreList[j].rank = j + 1;
        rankList.push({ name: scoreList[j].name, rank: scoreList[j].rank });
      }

      if (scoreList != [] && this.averScores) {
        this.techList = fnl;
        this.matchList = cms;
        this.scoreList = scoreList;
        this.$axios.post(this.api + "/updateScoresList", {
          params: {
            _id: this.diffId,
            scoreList: this.scoreList,
            techList: this.techList,
            matchList: this.matchList,
            averScores: this.averScores,
          },
        });
      }
    },

    //标注每一句的音频的开始和结束位置
    splitVideo() {
      console.log("splitvideo");
      var sentenceList = this.sentenceList;
      var fileName = this.fileName;
      var videoId = this.video_id;
      console.log(sentenceList);
      console.log(fileName);
      this.$axios.post("/python/splitVideo", {
        params: {
          sentences: sentenceList,
          fileName: fileName,
          videoId: videoId,
        },
      });
    },

    //获得分数列表
    isScoresList() {
      var index = null;
      this.checkStatus(); //判断身份
      // 判断提交名单是否存在发布者
      var newLen = Array.from(new Set(this.submitted));
      var pIndex = newLen.findIndex((item) => item == this.publisher);
      // 有发布者则把数组长度扣去1,无则保持原样
      newLen = pIndex != -1 ? newLen.length : newLen.length - 1;

      if (
        this.scoreList == "" ||
        this.scoreList == undefined || //如果scoreList为空
        !this.averScores //如果平均分为空
        // || isExceed
      ) {
        if (newLen <= 0) {
          //判断是否发布者为第一个提交的人
          this.scores = "No participants now!";
          this.isSubmitted = false;
          return;
        } else {
          this.countScores();
        }
      }
      this.scoreList.sort(this.compare("scores"));
      if (
        this.submitted.findIndex((item) => item === this.username) == -1 ||
        this.username == this.publisher
      ) {
        //该用户没有参与本次任务或是发布者
        this.scores = this.averScores + " (Average score)";
      } else {
        var index = this.scoreList.findIndex(
          (item) => item.name === this.username
        );
        var rank = this.scoreList[index].rank;
        this.myRank = rank;
        this.scores = this.scoreList[index].scores;
      }
      if (this.username == this.publisher) {
        // 更新发布者“myPublished”中的平均分
        this.$axios.post(this.api + "/updateMyPublishedScores", {
          params: {
            _id: this.userId,
            taskId: this.diffId,
            scoreList: this.scoreList,
            techList: this.techList,
            matchList: this.matchList,
            averScores: this.averScores,
            configuration: this.configuration,
          },
        });
      } else if (
        this.submitted.findIndex((item) => item === this.username) != -1 &&
        this.username != this.publisher
      ) {
        //如若先前更新myTasks失败
        var userTasks = [];
        this.$axios
          .get(this.api + "/profile?name=" + this.username)
          .then((res) => {
            userTasks = res.data[0].myTasks;
            let newdate = this.$moment(new Date()).format(
              "YYYY/MM/DD HH:mm:ss"
            );
            userTasks.push({
              taskId: this.diffId,
              videoId: this.video_id,
              deadline: this.deadline,
              authcode: this.authcode,
              title: this.taskTitle,
              label: this.taskLabels,
              time: newdate,
              scores: "",
            });

            // 更新用户“myTasks”中的分数
            this.$axios.post(this.api + "/updateMyTasksScores", {
              params: {
                _id: this.userId,
                taskId: this.diffId,
                scores: this.scoreList[index].scores
                  ? this.scoreList[index].scores
                  : "",
                userRank: this.myRank,
                userTasks: userTasks,
              },
            });
          });
      }
    },

    //比较日期大小
    compareDate(Date1, Date2) {
      if (Date1.search("/") == -1) {
        //如果模式为"2021/02/06 00:00:00"
        Date1 = Date1.replace("-", "/"); //转换成标准格式
      }
      if (Date2.search("/") == -1) {
        Date2 = Date2.replace("-", "/");
      }
      if (Date1.split(" ")[0] == Date2.split(" ")[0]) {
        //如果是同一天，则比较时分秒
        var time1 = Date1.split(" ")[1].split(":");
        var time2 = Date2.split(" ")[1].split(":");
        var total1 =
          Number(time1[0]) * 3600 + Number(time1[1]) * 60 + Number(time1[2]);
        var total2 =
          Number(time2[0]) * 3600 + Number(time2[1]) * 60 + Number(time2[2]);
        return total1 - total2 >= 0 ? true : false;
      } else {
        var oDate1 = new Date(Date1.split(" ")[0]);
        var oDate2 = new Date(Date2.split(" ")[0]);
        return oDate1 >= oDate2 ? true : false;
      }
    },
    //查看分数列表
    checkScoresDetails() {
      if (this.isPublisher) {
        var path = "/diff/" + this.diffId + "/scores";
        this.$router.push(path);
      } else {
        var path = "/diff/" + this.diffId + "/scoresStu";
        this.$router.push(path);
      }
    },
    // 检查身份
    checkStatus() {
      var index = this.submitted.findIndex((item) => item == this.username);
      if (this.username == this.publisher) {
        this.isPublisher = true;
        this.isSubmitted = true;
      } else if (index != -1) {
        this.isSubmitted = true;
      }
    },

    manualCofirm() {
      //手动确认后执行算分的函数
      this.isScoresList();
      this.isManual = !this.isManual;
      this.isConfirm = !this.isConfirm;
      this.setManual();
    },

    setManual() {
      //设置是否手动确认分数
      this.$axios.post(this.api + "/updateIsManual", {
        params: {
          _id: this.diffId,
          isManual: this.isManual,
          isConfirm: this.isConfirm,
        },
      });
    },

    //video play & load & pause
    playFunc() {
      this.isCountTime = true;
      console.log("playing");
    },
    pauseFunc() {
      this.isCountTime = false;
      console.log("pasused");
      // your code
    },
    loaded() {
      this.isCountTime = false;
      console.log("waiting");
    },
    startTime() {
      this.isCountTime = true;
      console.log("moving");
    },

    updateStudyTime() {
      let newdate = this.$moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
      var timespan = this.timespan;
      if (timespan > 0) {
        this.$axios.post("/score/updateStudyTime", {
          params: {
            _id: this.userId,
            listenTime: timespan,
            recordTime: newdate,
          },
        });
      }
    },
  },
  //页面生成前要做的工作
  created() {
    window.addEventListener("beforeunload", this.updateStudyTime);
    //可以考虑加个动画，因为有较多数据要加载，不然会显得页面卡顿
    this.diffId = this.$route.params.diffId;
    this.username = sessionStorage.getItem("userName");
    this.$axios.get(this.api + "/profile?name=" + this.username).then((res) => {
      this.userId = res.data[0]._id;
      this.userStatus = res.data[0].status;
    });
    this.$axios
      .post(this.api + "/getVersions", { params: { _id: this.diffId } })
      .then((res) => {
        this.versionsList = res.data; //获取每个人的版本
      });
    //渲染之前请求数据，判断是否有第一版本
    this.$axios
      .get(this.api + "/currentTask?_id=" + this.diffId)
      .then((res) => {
        var video_id = res.data[0].videoId; //对应视频的_id
        this.userList = res.data[0].userList;
        this.diffList = res.data[0].diffList;
        this.publisher = res.data[0].publisher;
        this.submitted = res.data[0].submitted;
        this.publishTime = res.data[0].time;
        this.taskTitle = res.data[0].title;
        this.deadline = res.data[0].deadline;
        this.taskLabels = res.data[0].label;
        this.scoreList = res.data[0].scoreList;
        this.techList = res.data[0].techList;
        this.matchList = res.data[0].matchList;
        this.averScores = res.data[0].averScores;
        this.isManual = res.data[0].isManual;
        this.isConfirm = res.data[0].isConfirm;
        this.video_id = res.data[0].videoId; //对应视频的_id
        this.authcode = res.data[0].authcode;
        this.configuration = res.data[0].configuration;
        console.log("lll", this.submitted);

        // let date = new Date();
        // let newdate = date.toLocaleString("chinese", {
        //   hour12: false,
        // });
        let newdate = this.$moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
        var isOut = this.compareDate(newdate, this.deadline);
        console.log("isOut", isOut);
        if (this.userStatus == "1") {
          this.isTeacher = true;
        }
        if (this.userStatus == "0") {
          this.isTeacher = false;
          if (isOut || this.scoreList.length > 0) {
            this.isreadonly = false;
          }
        }

        this.$axios
          .get(this.api + "/currentVideoPublisher?name=" + this.publisher)
          .then((res) => {
            this.status = res.data[0].status;
            if (this.status == "1") {
              this.identity = "Teacher";
            }
          });
        // console.log(this.userList);
        //获取视频路径，从服务器获取
        this.$axios
          .get(this.api + "/currentVideo?_id=" + video_id)
          .then((res) => {
            this.fileName = res.data[0].fileName;
            var filetype = this.fileName.split(".")[1];
            for (var i = 0; i < this.videoType.length; i++) {
              if (filetype == this.videoType[i]) {
                this.isVideo = true;
              }
            }
          });
        //先判断是否有修改记录，再判断是否有第一版本
        if (this.diffList.length == 0) {
          this.$axios
            .get(this.api + "/allVersions?_id=" + this.diffId)
            .then((res) => {
              if (res.data.length == 0) {
                //当前无人提交版本，显示输入框
                this.isversion1 = false;
                this.loading = false;
              } else {
                this.isversion1 = true;
                this.loading = false;
                this.text_v1 = res.data[0].version;
              }
            });
        } else {
          //形成综合版本
          this.createFinalVersion();
          this.isversion1 = true;
          this.isFinal = true;
        }
      });
    // if (this.submitted.length == 0) {
    //   this.isScoresList();
    // }
  },
  updated() {
    //判断是音频还是视频
    this.decidePlayer();
    let newdate = this.$moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
    //("2021/02/06 00:00:00", "2021/02/05 00:00:00" newdate, this.deadline)
    var isDDL = this.compareDate(newdate, this.deadline);
    if (
      // this.submitted.length >= 1 &&
      !this.isManual &&
      (isDDL || this.isConfirm)
    ) {
      //如果为自动计算，过了ddl或已经确认过，则运行函数
      this.isScoresList();
      //自启动splitvideo
      // this.splitVideo();
    }
  },
  mounted() {
    setInterval(() => {
      if (this.isCountTime) {
        this.timespan += 0.1;
        // console.log(this.timespan);
      }
    }, 100);
    //window.addEventListener('beforeunload', this.updateStudyTime)
    // window.addEventListener("keypress", this.startTime());
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.updateStudyTime);
    // window.removeEventListener("scroll", this.setHeadPosition, true);
  },
};
</script>

<style>
.con {
  z-index: 11000;
  width: 950px;
  height: 600px;
  background-color: white;
  position: fixed;
  top: 15%;
  left: 20%;
  position: fixed;
  box-shadow: 0px 0px 5px gray;
  border-radius: 5px;
}
/* 浮框底部距离 */
.el-collapse-item__content {
  padding-bottom: 0;
}

.eltable {
  width: 100%;
  font-size: 90%;
}

.eltable th {
  padding: 4px 0 !important;
}

.eltable td {
  padding: 4px 0 !important;
}

.badge {
  font-size: 1em;
  padding: 0.28em 0.22em;
  font-weight: normal;
  /* 字体可能得改改 */
}
.buttons {
  position: fixed;
  right: 0;
  margin-right: 6px;
  display: inline-block;
  margin-top: 150px;
  z-index: 99;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.edit {
  background-color: lavender;
}

ins {
  color: green;
  font-weight: bold;
}

subins {
  color: blue;
}

del {
  color: indianred;
}

.el-main {
  background: #d3cce3;
  background: -webkit-linear-gradient(to left, #fbe9fd 10%, #eee2ff 100%);
  background: linear-gradient(to left, #fbe9fd 10%, #eee2ff 100%);
  border-radius: 2em;
}
.edit-tip {
  color: purple;
  font-size: 20px;
  word-wrap: break-word;
  word-break: break-all;
}

#textDiv {
  margin-top: 0;
  padding: 1% 2%;
  font-size: 20px;
  background-color: white;
  border-radius: 6px;
  width: 100%;
  height: 85%;
  text-align: left;
}

#insertText {
  text-decoration: none;
  color: #21bf73;
}

#deleteText {
  color: #ef6c57;
  text-decoration: line-through #ea4c4c solid;
}
.box-card {
  width: 1000px;
  margin-top: 2%;
}
.active:hover {
  color: rgb(0, 0, 95);
  border-radius: 2px;
  border-bottom: 1px solid black;
}
#wordOperate {
  display: none;
  width: 600px;
  padding: 5px 5px;
  border-radius: 5px;
  transition-duration: 100ms;
  line-height: 100%;
  box-shadow: 0px 0px 7px rgb(143, 141, 141);
  z-index: 10001;
}

/* 视频css */
.video-container {
  margin: 1.5% auto;
  display: flex;
  justify-content: center;
}

.video-left-box,
.video-right-box {
  margin: 0 1.5em;
}

.example-player {
  position: relative;
  width: 750px;
  height: 450px;
  background-color: #000;
  font-weight: normal;
}

/* 音频盒子css */
.audio-box {
  width: 45em;
}

/* 原生audio css */
audio {
  margin-top: 2em;
  width: 100%;
  height: 7em;
  border-radius: 10px;
  box-shadow: 5px 5px 10px -4px #63645e;
}
audio::-webkit-media-controls-panel {
  background-image: linear-gradient(to top, #a94eb8 0%, #ffd3f3 100%);
  height: 100%;
  padding: 0 3em;
}
audio::-webkit-media-controls-enclosure {
  max-height: 100% !important;
  border-radius: 10px !important;
}
audio::-webkit-media-controls-play-button {
  background-color: white;
  border-radius: 50%;
  height: 32px;
  margin-right: 1em;
}
audio::-webkit-media-controls-mute-button {
  background-color: white;
  border-radius: 50%;
  height: 32px;
  /* margin-top: 7.5px; */
}
audio::-webkit-media-controls-current-time-display,
audio::-webkit-media-controls-time-remaining-display {
  color: #4a0e5c;
  font-weight: bold;
  font-size: large;
}

/* 音频插件css */
div.audio-box > .vueAudioBetter {
  overflow: hidden;
  width: 500px;
  margin: 0 auto;
  background-color: #e7d9ea;
  border-radius: 8px;
  box-shadow: 5px 5px 10px -4px #63645e;
  background-image: linear-gradient(to top, #9656a1 0%, #fbc2eb 100%);
  color: #4a0e5c;
}

.iconfont {
  color: #45046a !important;
}

.process {
  background: #ffc3e7 !important;
}

.thunk > .block {
  border: 3px solid #ffc3e7 !important;
}

/* 信息卡片css */
.my-info-card.q-card.q-card--bordered.q-card--flat.no-shadow {
  width: 18em;
}
.score-btn {
  width: 100%;
}
/* 信息卡片发布者头像 */
canvas.publisher-avt {
  width: 40px;
  height: 40px;
  margin: 5px 1px;
}

/* 视频快进快退css */
#menu,
.submit-btn,
.edit-btn {
  display: flex;
  justify-content: center;
}

/* .el-row {
  margin-bottom: 20px;
} */
.el-col {
  border-radius: 4px;
}
.row-bg {
  padding: 10px 0;
  /* background-color: #f9fafc; */
}
.el-textarea {
  position: relative;
  display: inline-block;
  width: 100%;
  vertical-align: baseline;
  font-size: 16px;
  line-height: 1.5;
}
main#mainContent {
  padding-bottom: 4%;
}
.q-item__section.column.q-item__section--main.justify-center {
  flex-direction: column;
}
.aui_close {
  width: 15px;
  height: 15px;
  line-height: 15px;
  display: block;
  position: absolute;
  right: 10px;
  top: 10px;
  font-family: Helvetica, STHeiti;
  _font-family: "\u9ed1\u4f53", "Book Antiqua", Palatino;
  font-size: 18px;
  border-radius: 20px;
  background: #999;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -moz-transition: linear 0.06s;
  -webkit-transition: linear 0.06s;
  transition: linear 0.06s;
  padding: 0;
  text-align: center;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  z-index: 20;
}
.aui_close:hover {
  width: 17px;
  height: 17px;
  line-height: 17px;
  right: 9px;
  top: 9px;
  color: #fff;
  box-shadow: 0 1px 3px rgba(209, 40, 42, 0.5);
  background: #d1282a;
  border-radius: 24px;
  transition: all 0.2s ease-out;
  text-decoration: none;
  opacity: 0.8;
}
.aui_close1 {
  width: 25px;
  height: 25px;
  line-height: 25px;
  display: block;
  position: absolute;
  right: 19px;
  top: 8px;
  font-family: Helvetica, STHeiti;
  _font-family: "\u9ed1\u4f53", "Book Antiqua", Palatino;
  font-size: 20px;
  border-radius: 20px;
  background: #999;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -moz-transition: linear 0.06s;
  -webkit-transition: linear 0.06s;
  transition: linear 0.06s;
  padding: 0;
  text-align: center;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  z-index: 20;
}
.aui_close1:hover {
  width: 27px;
  height: 27px;
  line-height: 27px;
  right: 18px;
  top: 7px;
  color: #fff;
  box-shadow: 0 1px 3px rgba(209, 40, 42, 0.5);
  background: #d1282a;
  border-radius: 24px;
  transition: all 0.2s ease-out;
  text-decoration: none;
  opacity: 0.8;
}
</style>
