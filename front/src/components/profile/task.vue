<template>
  <q-page class="q-pa-lg">
    <h3 class="q-my-md">Create Task</h3>
    <q-separator insert style="width: 75%" class="q-mb-md" />
    <q-form
      action="http://localhost:3000/api/task"
      method="post"
      enctype="multipart/form-data"
      class="q-gutter-sm col-12 row justify-center"
      @submit="onSubmit"
    >
      <div class="col-7">
        <!-- 当前发布者信息：只读 -->
        <q-input
          filled
          v-model="publisher"
          hint="The Current User *"
          readonly
          label="Publisher *"
          name="publisher"
          class="q-my-md"
          dense
        >
          <template v-slot:before>
            <q-icon name="person" size="lg" color="purple" class="q-mr-sm" />
          </template>
        </q-input>

        <!-- 上传音视频文件 -->
        <q-file
          clearable
          clear-icon="close"
          standout="bg-purple-5 text-white"
          bottom-slots
          v-model="fileName"
          label="Please Choose One File"
          counter
          max-files="1"
          name="f1"
          accept="video/*,audio/*"
          class="q-my-md"
          dense
        >
          <template v-slot:before>
            <q-icon
              name="create_new_folder"
              size="lg"
              color="purple"
              class="q-mr-sm"
            />
          </template>

          <template v-slot:hint> video/audio </template>

          <template v-slot:append>
            <q-icon name="cloud_upload" size="md" />
          </template>
        </q-file>

        <!-- 任务标题：不可重复 -->
        <q-input
          outlined
          clearable
          clear-icon="close"
          color="purple"
          v-model="title"
          label="Task Title"
          hint="No Repeating Task Title"
          error-message="×Task Title Already Existed. Please Change Another One."
          :error="isRepeted"
          name="title"
          lazy-rules
          bottom-slots
          id="task-title"
          autocomplete="off"
          class="q-my-md"
          dense
        >
          <template v-slot:before>
            <q-icon name="title" size="lg" color="purple" class="q-mr-sm" />
          </template>
        </q-input>

        <!-- 任务标签：可多选 -->
        <q-select
          outlined
          clearable
          clear-icon="close"
          v-model="modelMultiple"
          use-input
          use-chips
          multiple
          counter
          max-values="3"
          hint="Max 3 selections"
          input-debounce="0"
          @new-value="createValue"
          :options="filterOptions"
          @filter="filterFn"
          color="purple-6"
          transition-show="jump-up"
          transition-hide="jump-up"
          label="-- Task Tag --"
          name="videoLabel[]"
          class="q-my-md"
          dense
        >
          <template v-slot:before>
            <q-icon name="more" size="lg" color="purple" class="q-mr-sm" />
          </template>
        </q-select>

        <!-- 任务小组名单 -->
        <q-select
          outlined
          clearable
          clear-icon="close"
          v-model="tagName"
          :options="newTagList"
          @filter="filterFn"
          color="purple-6"
          label="-- Group List --"
          name="tag"
          hint="Not Necessary"
          class="q-my-md"
          dense
        >
          <template v-slot:before>
            <q-icon name="group" size="lg" color="purple" class="q-mr-sm" />
          </template>

          <template v-slot:no-option v-if="newTagList.length == 0">
            <q-item>
              <q-item-section class="text-italic text-grey">
                Please Upload The User List
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- 任务截止时间 -->
        <div class="row q-my-md">
          <div class="q-field__before q-field__marginal row no-wrap">
            <q-icon name="schedule" size="lg" color="purple" />
          </div>
          <div
            class="q-field__inner relative-position col self-stretch column justify-center"
          >
            <el-date-picker
              v-model="deadline"
              type="datetime"
              placeholder="Choose The Deadline"
              name="deadline"
              value-format="yyyy-MM-dd HH:mm:SS"
              size="large"
            >
            </el-date-picker>
          </div>
        </div>

        <!-- 任务最少字数限制 -->
        <q-input
          standout="bg-purple-5 text-white"
          v-model="words"
          label="The Minimum Word Limit"
          clearable
          clear-icon="close"
          name="words"
          dense
        >
          <template v-slot:before>
            <q-icon
              name="spellcheck"
              size="lg"
              color="purple"
              class="q-mr-sm"
            />
          </template>
        </q-input>
      </div>

      <div class="col-4 form-right-box q-pa-sm">
        <div class="q-px-md q-py-sm" style="width: 100%">
          <q-card class="q-mx-sm" flat bordered>
            <q-list bordered separator>
              <q-item class="column">
                <q-item-section class="col q-my-sm">
                  <div class="text-left text-subtitle2 text-weight-bold">
                    Score Confirmation:
                  </div>
                </q-item-section>
                <q-item-section class="col">
                  <div class="text-left">
                    <el-switch
                      v-model="isManual"
                      active-text="Manually"
                      inactive-text="Automatically"
                      name="isManual"
                      class="q-py-md"
                    >
                    </el-switch>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 进入任务相关验证码 -->
              <q-item class="column">
                <q-item-section class="col">
                  <div class="q-my-sm column justify-center">
                    <el-checkbox
                      v-model="checked"
                      @change="initAuthcode"
                      size="medium"
                      class="check-box"
                      ><span class="q-ml-sm"
                        >Verification Code</span
                      ></el-checkbox
                    >
                    <q-input
                      v-if="checked"
                      color="purple-6"
                      v-model="authcode"
                      clearable
                      clear-icon="close"
                      placeholder="Enter verification code"
                      name="authcode"
                      class="justify-center"
                    >
                      <template v-slot:prepend>
                        <q-icon name="vpn_key" />
                      </template>
                    </q-input>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 老师偏好设置 -->
              <q-expansion-item
                expand-separator
                icon="settings_suggest"
                label="More Settings"
                header-class="text-purple"
                class="more-settings"
                default-opened
              >
                <q-item class="column">
                  <q-item-section class="col">
                    <div class="q-my-sm">
                      <q-input
                        standout="bg-purple text-white"
                        v-model="configuration.SMscore"
                        label="Total score of SM"
                        type="number"
                        name="SMscore"
                        @blur="checkNum()"
                        dense
                      />
                    </div>
                    <div class="q-my-sm">
                      <q-input
                        standout="bg-purple text-white"
                        v-model="configuration.timePercentage"
                        label="Percentage of time(0.00)"
                        type="number"
                        name="timePercentage"
                        step="0.01"
                        @blur="checkNum()"
                        dense
                      />
                    </div>
                    <div class="q-my-sm">
                      <q-input
                        standout="bg-purple text-white"
                        v-model="configuration.timeSpan"
                        label="Span of submission time between 2 people(min)"
                        type="number"
                        name="timeSpan"
                        @blur="checkNum()"
                        dense
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>
          </q-card>

          <!-- 提交所有信息按钮 -->
          <div class="col-4 row justify-center q-my-lg q-px-md">
            <q-btn
              push
              icon-right="mdi-send-check"
              label="Submit"
              type="submit"
              color="purple-5"
              :disabled="titleExist"
              style="width: 100%; height: 3em"
            />
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { QSpinnerFacebook } from "quasar";

const stringOptions = [
  "Economy",
  "Science",
  "Politics",
  "Literature",
  "Sports",
  "Others",
];

export default {
  name: "task",
  data() {
    return {
      publisher: "",
      authcode: "", //验证码
      checked: false,
      deadline: "", //截止日期
      title: "",
      titleList: [],
      titleExist: false,
      accountList: [],
      multiple: false,
      newTagList: [],
      status: "",
      tagName: "",
      api: "/api",
      words: 0,
      modelMultiple: ["Others"],
      filterOptions: stringOptions,
      fileName: null, // 所上传的文件名
      isManual: false, //是否自动计算分数
      configuration: [],
    };
  },
  computed: {
    // 检测任务标题是否重名
    isRepeted() {
      for (var i = 0; i < this.titleList.length; i++) {
        if (this.title == this.titleList[i]) {
          return true; //重名则无法提交
        }
      }
    },
  },
  methods: {
    checkNum() {
      //对输入数字进行限制
      if (this.configuration.SMscore > 0) {
        this.configuration.SMscore =
          this.configuration.SMscore > 100 ? 100 : this.configuration.SMscore;
      } else {
        this.configuration.SMscore = 0;
      }

      if (this.configuration.timePercentage > 0) {
        this.configuration.timePercentage =
          this.configuration.timePercentage > 1
            ? 1
            : this.configuration.timePercentage;
      } else {
        this.configuration.timePercentage = 0;
      }

      if (this.configuration.timeSpan < 0) {
        this.configuration.timeSpan = 0;
      }
    },
    getTitleList() {
      //连接数据库，获取数据库中所有的title
      this.$axios.get(this.api + "/titleList").then((res) => {
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          this.titleList.push(data[i].title);
        }
        // console.log("已发布任务标题", this.titleList);
      });
    },
    getTagList() {
      //连接数据库，获取数据库中属于当前用户的tag列表
      this.$axios
        .get(this.api + "/tagList?owner=" + this.publisher)
        .then((res) => {
          var tagList = res.data;
          // console.log("Tag数据表", tagList);
          this.newTagList = tagList.map((item) => {
            return item.tagName;
          });
          // console.log("已发布任务小组标签", this.newTagList)
        });
    },
    getStatus() {
      //连接数据库，获取数据库中属于当前用户的status
      this.$axios
        .get(this.api + "/profile?name=" + this.publisher)
        .then((res) => {
          this.status = res.data[0].status;
          this.configuration = res.data[0].configuration;
        });
    },
    initAuthcode() {
      this.authcode = ""; //清空验证码
    },
    // 把自定义标签暂时放到展示列表里，刷新不保留
    createValue(val, done) {
      if (val.length > 0) {
        if (!stringOptions.includes(val)) {
          stringOptions.push(val);
        }
        done(val, "toggle");
      }
    },
    // 筛选任务标签
    filterFn(val, update) {
      update(() => {
        if (val === "") {
          this.filterOptions = stringOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = stringOptions.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    // 提交时判断任务标题是否重复来决定是否符合发布要求
    onSubmit(evt) {
      let _this = this;
      var findTitleIndex = this.titleList.indexOf(
        this.titleList.find((element) => element == this.title)
      );
      if (
        this.fileName == null ||
        findTitleIndex != -1 ||
        this.title == "" ||
        this.modelMultiple.length == 0
      ) {
        _this.$q.notify({
          color: "red-5",
          textColor: "white",
          timeout: 3000,
          icon: "sentiment_very_dissatisfied",
          message: "Release failed! Please check whether the information is complete and accurate!",
        });
      } else {
        this.titleExist = false;
        evt.target.submit();
        // 提交时的加载过渡动画
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
        }, 5000);
      }
    },
    // 网络加载完后，便结束加载动画，返回profile默认页面
    beforeDestroy() {
      if (this.timer !== void 0) {
        clearTimeout(this.timer);
        this.$q.loading.hide();
      }
    },
  },
  created() {
    this.publisher = sessionStorage.getItem("userName");
    this.getTitleList();
    this.getTagList();
    this.getStatus();
  },
};
</script>

<style>
.q-chip {
  background-color: #fff3e6;
}
.q-field--auto-height .q-field__control,
.q-field--auto-height .q-field__native,
.q-field--filled .q-field__control,
.q-field__control.relative-position.row.no-wrap {
  width: 100%;
}
div.q-menu.q-position-engine.scroll {
  z-index: 99999;
  max-height: 300px !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-input__icon:after {
  vertical-align: top;
}

.more-settings.q-expansion-item--collapsed.q-expansion-item--standard
  > div
  > div.q-item.q-item-type.row.no-wrap.q-item--clickable.q-link.cursor-pointer.q-focusable.q-hoverable.text-purple
  > div.q-item__section.column.q-item__section--main.justify-center,
.more-settings
  > div
  > div.q-item.q-item-type.row.no-wrap.q-item--clickable.q-link.cursor-pointer.q-focusable.q-hoverable.text-purple
  > div.q-item__section.column.q-item__section--main.justify-center {
  margin-left: -1.3em;
}
.check-box > span.el-checkbox__input {
  margin-left: 2.5px;
}
</style>
