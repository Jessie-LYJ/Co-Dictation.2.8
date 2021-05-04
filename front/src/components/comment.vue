<template>
  <div class="comment-container" style="max-width: 800px; margin: 50px auto">
    <el-backtop></el-backtop>
    <q-btn
        color="purple"
        icon="create"
        round
        @click="toBottom()"
        style="position:fixed;right:2%;"
      >
        <q-tooltip
          content-class="bg-accent"
          anchor="center left"
          self="center right"
          :offset="[10, 10]"
          >Write A Comment</q-tooltip
        >
      </q-btn>
    <div v-if="commentList.length > 0" style="margin: 20px auto">
      <div
        class="comment"
        v-for="(item, index) in commentList"
        :key="item.time"
      >
        <div class="info">
          <avatar-org class="commenter-avt" :name="item.name"></avatar-org>
          <div class="right">
            <div class="name">{{ item.name }}</div>
            <div class="date">{{ item.time }}</div>
          </div>
        </div>
        <div class="content" style="word-break: break-all !important;">{{ item.comment }}</div>
        <!-- 每条评论的回复列表 -->
        <div class="reply">
          <div
            class="item"
            v-for="replyitem in item.reply"
            :key="replyitem.time"
          >
            <div class="reply-content">
              <span class="from-name text-subtitle1 q-mr-sm"
                >{{ replyitem.responder }}:</span
              >
              <span style="word-break: break-all !important;">{{ replyitem.comment }}</span>
            </div>
            <div class="reply-bottom">
              <span>{{ replyitem.time }}</span>
            </div>
          </div>
        </div>
        <div class="control" style="margin-bottom: -3%">
          <span
            class="comment-reply"
            @click="reply(index, item.name, item.comment, item.time)"
          >
            <i class="iconfont icon-comment"></i>
            <span>Reply</span>
          </span>
          <span
            class="like"
            :class="{ active: item.isLike }"
            @click="likeClick(item, index)"
          >
            <i class="iconfont icon-like"></i>
            <span class="like-num">{{
              item.likeNum > 0 ? item.likeNum + "Like" : "Like"
            }}</span>
          </span> 
        </div>

        <div :id="'input' + index" style="display: none; max-width: 400px; margin-top:2%;margin-left:9%">
          <!-- <div v-if="isShow"> -->
          <q-input v-model="replyComment" filled type="textarea" />
          <br />
          <q-btn
            color="purple-6"
            label="Reply"
            size="sm"
            @click="submitReply(index)"
            style="margin-top: -6%; margin-left: 58%;"
          />
          <q-btn
            color="purple-5"
            label="Cancel"
            size="sm"
            @click="cancelReply(index)"
            style="margin-top: -6%; margin-left: 3%;"
          />
        </div>
        <hr />
        <!-- <q-separator /> -->
      </div>
    </div>
    <div v-else style="max-width: 600px; margin: 20px auto; font-size: 20px">
      No comments yet...
    </div>
    <div class="q-pa-md" style="max-width: 600px; margin: 30px auto">
      <q-input v-model="comment" filled type="textarea" />
      <br />
      <q-btn
        color="purple"
        label="Submit"
        @click="submitCom()"
        style="margin-left: 85%"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import AvatarOrg from "../components/basic/Avatar";
import Header from "./basic/Header.vue";
export default {
  data() {
    return {
      commentList: [],
      comment: "",
      name: "",
      replyComment: "",
      isShow: false,
      currentReviewer: "",
      currentResponder: "",
      currentIndex: 0,
      isMainReply: false,
      diffId: "",
      api: "/api",
      taskId: "",
      taskPublisher: "",
      taskTitle: "",
      currentComment: "",
      commentTime: "",
    };
  },
  components: {
    AvatarOrg,
    Header,
  },
  methods: {
    toBottom(){
       window.scrollTo(0,50000);
    },
    addlike(comTime) {
      this.$axios.post("/score/addlike", {
        params: { _id: this.diffId, name: this.name, comTime: comTime },
      });
    },
    removelike(comTime) {
      this.$axios.post("/score/removelike", {
        params: { _id: this.diffId, name: this.name, comTime: comTime },
      });
    },
    likeClick(item, index) {
      var comTime = item.time;
      if (item.isLike === null) {
        Vue.$set(item, "isLike", true);
        item.likeNum++;
        this.addlike(comTime);
      } else {
        if (item.isLike) {
          item.likeNum--;

          this.removelike(comTime);
        } else {
          item.likeNum++;
          this.addlike(comTime);
        }
        item.isLike = !item.isLike;
      }
    },

    // },
    submitCom() {
      //获得当前时间
      let subTime = this.$moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
      if (this.comment) {
        let item = {
          name: this.name,
          time: subTime,
          comment: this.comment,
          reply: [],
        };
        this.commentList.push(item);
        // console.log(this.commentList)
        this.$axios.post(this.api + "/updatecomment", {
          params: {
            _id: this.diffId,
            comments: this.commentList,
          },
        });

        var userComment = this.comment;
        // console.log("userComment", userComment)
        this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
          var userComments = res.data[0].myComments;
          // console.log("userComments1111", userComments);
          userComments.push({
            commentKey: this.taskId + this.currentIndex,
            taskId: this.taskId,
            taskPublisher: this.taskPublisher,
            taskTitle: this.taskTitle,
            time: subTime,
            comment: userComment,
            reply: [],
          });
          // console.log("userComments222", userComments);
          this.$axios.post(this.api + "/updateMyComments", {
            params: {
              reviewer: this.name,
              myComments: userComments,
            },
          });
        });

        this.comment = "";
      } else {
        //输入的内容为空
        this.$notify({
          // title: "警告",
          type: "warning",
          message: "You did not enter anything.",
          position: "bottom-right",
        });
      }
    },
    submitReply(index) {
      // 回复评论
      //获得当前时间
      let subTime = this.$moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
      if (this.replyComment) {
        var replyItem = {
          reviewer: this.currentReviewer,
          responder: this.currentResponder, //回复的用户名
          time: subTime,
          comment: this.replyComment,
        };
        // console.log(replyItem);
        this.commentList[this.currentIndex].reply.push(replyItem);
        this.$axios.post(this.api + "/updateComment", {
          params: {
            _id: this.diffId,
            comments: this.commentList,
          },
        });

        var replies = this.commentList[this.currentIndex].reply;
        console.log("replies", replies);

        this.$axios
          .get(this.api + "/profile?name=" + this.currentReviewer)
          .then((res) => {
            var userComments = res.data[0].myComments;
            userComments.push({
              commentKey: this.taskId + this.currentIndex,
              taskId: this.taskId,
              taskPublisher: this.taskPublisher,
              taskTitle: this.taskTitle,
              time: this.commentTime,
              comment: this.currentComment,
              reply: replies,
            });
            // console.log("旧userComments", userComments);

            var newUserComments = userComments.reverse();
            var result = [];
            var obj = {};
            for (var i = 0; i < newUserComments.length; i++) {
              if (
                !obj[newUserComments[i].commentKey] &&
                !obj[newUserComments[i].time]
              ) {
                result.push(newUserComments[i]);
                obj[newUserComments[i].commentKey] = true;
                obj[newUserComments[i].time] = true;
              }
            }

            // console.log("新userComments", result);

            this.$axios.post(this.api + "/updateMyComments", {
              params: {
                reviewer: this.currentReviewer,
                myComments: result,
              },
            });
          });

        this.replyComment = "";
        document.getElementById("input" + index).style.display = "none";
      } else {
        //输入的内容为空
        this.$notify({
          // title: "警告",
          type: "warning",
          message: "You did not enter anything.",
          position: "bottom-right",
        });
      }
    },
    reply(index, reviewer, comment, commentTime) {
      document.getElementById("input" + index).style.display = "block";
      this.currentIndex = index;
      this.currentReviewer = reviewer; //当前被评论的人
      this.currentResponder = this.name; //当前用户
      this.currentComment = comment;
      this.commentTime = commentTime;
    },
    cancelReply(index) {
      document.getElementById("input" + index).style.display = "none";
    },
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.diffId = this.$route.params.diffId;
    var name = sessionStorage.getItem("userName");
    //请求数据
    this.$axios
      .get(this.api + "/currentTask?_id=" + this.diffId)
      .then((res) => {
        this.taskId = res.data[0]._id;
        this.taskPublisher = res.data[0].publisher;
        this.taskTitle = res.data[0].title;
        console.log(this.taskId, this.taskPublisher, this.taskTitle);
        var commentList = res.data[0].comments;
        // console.log(commentList)
        for (var i = 0; i < commentList.length; i++) {
          if (commentList[i].likeName) {
            const isName = commentList[i].likeName.findIndex(
              (item) => item == name
            );
            // console.log("aaaaaaa");
            if (isName == -1) {
              commentList[i].isLike = false;
            } else {
              commentList[i].isLike = true;
            }
          } else {
            commentList[i].isLike = false;
            commentList[i].likeNum = 0;
          }
          console.log("commentList", commentList);
        }
        this.commentList = commentList;
      });
  },
};
</script>

<style lang="scss">
@import "../../public/scss/index";

.comment-container {
  padding: 5px 20px;
  box-sizing: border-box;
  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid $border-fourth;
    .info {
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 50%;
      }
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .name {
          font-size: 16px;
          color: $text-main;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .date {
          font-size: 12px;
          color: $text-minor;
        }
      }
    }
  }
}
.content {
  font-size: 17px;
  color: $text-main;
  line-height: 20px;
  padding: 10px 0px 10px 75px;
}

.control {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-minor;
  .like {
    display: flex;
    align-items: center;
    margin-left: 20px;
    cursor: pointer;
    &.active,
    &:hover {
      color: purple;
    }
    .iconfont {
      font-size: 16px;
      margin-left: 12px;
      text-decoration: none;
    }
  }
  .comment-reply {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: purple;
    }
    .iconfont {
      font-size: 16px;
      margin-left: 645px;
    }
  }
}

.reply {
  margin: 10px 0;
  border-left: 2px solid $border-first;
  .item {
    margin: 0 10px;
    padding: 10px 0;
    border-bottom: 1px dashed $border-third;
    .reply-content {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-main;
      .from-name {
        color: $color-main;
      }
    }
  }
}

.reply-bottom {
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: $text-minor;
}

.write-reply {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-minor;
  padding: 10px;
  cursor: pointer;
  &:hover {
    color: $text-main;
  }
  .el-icon-edit {
    margin-right: 5px;
  }
}

.commenter-avt {
  width: 40px;
  height: 40px;
}
</style>
