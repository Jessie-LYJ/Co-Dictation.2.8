<template>
  <div>
    <Header></Header>
    <el-backtop></el-backtop>
    <q-layout>
      <q-page-container class="GPL__page-container">
        <q-page-sticky
          v-if="$q.screen.gt.sm"
          expand
          position="left"
          style="top: 64px;"
        >
          <q-list padding class="fit q-pt-xl q-px-sm column" v-model="category">
            <q-btn
              round
              flat
              color="grey-8"
              stack
              no-caps
              size="25px"
              class="GPL__side-btn"
              v-for="item in categories"
              :key="item.value"
              @click="selectLabel(item.value)"
            >
              <q-icon size="24px" :name="item.icon" />
              <div class="GPL__side-btn__label">{{ item.label }}</div>
            </q-btn>
          </q-list>
        </q-page-sticky>

        <div class="cards-container">
          <div
            class="cards-box q-pa-md items-center q-gutter-md justify-center q-py-xl"
          >
            <q-card
              class="my-card"
              v-for="(v, index) in currentContent"
              :key="index"
            >
              <q-img
                :src="require('../assets/images/economy.jpg')"
                v-if="v.label[0].indexOf('Economy') !== -1"
                @click="startEx(index)"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-left">{{ v.title }}</div>
                  <div class="text-subtitle2 text-left">
                    by {{ v.publisher }}
                  </div>
                </div>
              </q-img>

              <q-img
                :src="require('../assets/images/science.jpg')"
                v-else-if="v.label.indexOf('Science') !== -1"
                @click="startEx(index)"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-left">{{ v.title }}</div>
                  <div class="text-subtitle2 text-left">
                    by {{ v.publisher }}
                  </div>
                </div>
              </q-img>

              <q-img
                :src="require('../assets/images/politics.png')"
                v-else-if="v.label.indexOf('Politics') !== -1"
                @click="startEx(index)"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-left">{{ v.title }}</div>
                  <div class="text-subtitle2 text-left">
                    by {{ v.publisher }}
                  </div>
                </div>
              </q-img>

              <q-img
                :src="require('../assets/images/literature.jpg')"
                v-else-if="v.label.indexOf('Literature') !== -1"
                @click="startEx(index)"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-left">{{ v.title }}</div>
                  <div class="text-subtitle2 text-left">
                    by {{ v.publisher }}
                  </div>
                </div>
              </q-img>

              <q-img
                :src="require('../assets/images/sports.jpg')"
                v-else-if="v.label.indexOf('Sports') !== -1"
                @click="startEx(index)"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-left">{{ v.title }}</div>
                  <div class="text-subtitle2 text-left">
                    by {{ v.publisher }}
                  </div>
                </div>
              </q-img>

              <q-img
                :src="require('../assets/images/others.png')"
                v-else-if="v.label.indexOf('Others') !== -1"
                @click="startEx(index)"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-left">{{ v.title }}</div>
                  <div class="text-subtitle2 text-left">
                    by {{ v.publisher }}
                  </div>
                </div>
              </q-img>

              <q-img
                :src="require('../assets/images/array.jpg')"
                v-else
                @click="startEx(index)"
              >
                <div class="absolute-bottom">
                  <div class="text-h6 text-left">{{ v.title }}</div>
                  <div class="text-subtitle2 text-left">
                    by {{ v.publisher }}
                  </div>
                </div>
              </q-img>

              <q-card-actions v-if="v.label.indexOf('Economy') !== -1">
                <q-badge
                  outline
                  align="middle"
                  color="orange-4"
                  v-for="(l, i) in v.label"
                  :key="i"
                >
                  {{ l }}
                </q-badge>
              </q-card-actions>

              <q-card-actions v-else-if="v.label.indexOf('Science') !== -1">
                <q-badge
                  outline
                  align="middle"
                  color="blue-4"
                  v-for="(l, i) in v.label"
                  :key="i"
                >
                  {{ l }}
                </q-badge>
              </q-card-actions>

              <q-card-actions v-else-if="v.label.indexOf('Politics') !== -1">
                <q-badge
                  outline
                  align="middle"
                  color="purple-3"
                  v-for="(l, i) in v.label"
                  :key="i"
                >
                  {{ l }}
                </q-badge>
              </q-card-actions>

              <q-card-actions v-else-if="v.label.indexOf('Literature') !== -1">
                <q-badge
                  outline
                  align="middle"
                  color="pink-3"
                  v-for="(l, i) in v.label"
                  :key="i"
                >
                  {{ l }}
                </q-badge>
              </q-card-actions>

              <q-card-actions v-else-if="v.label.indexOf('Sports') !== -1">
                <q-badge
                  outline
                  align="middle"
                  color="lime-8"
                  v-for="(l, i) in v.label"
                  :key="i"
                >
                  {{ l }}
                </q-badge>
              </q-card-actions>

              <q-card-actions v-else-if="v.label.indexOf('Others') !== -1">
                <q-badge
                  outline
                  align="middle"
                  color="brown-3"
                  v-for="(l, i) in v.label"
                  :key="i"
                >
                  {{ l }}
                </q-badge>
              </q-card-actions>

              <q-card-actions v-else>
                <q-badge
                  outline
                  align="middle"
                  color="teal-4"
                  v-for="(l, i) in v.label"
                  :key="i"
                >
                  {{ l }}
                </q-badge>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <q-pagination
          v-show="taskList.length > 10"
          v-model="currentpage"
          color="purple-8"
          :max="Math.ceil(total / 10)"
          :max-pages="6"
          :page-size="pagesize"
          :current-page.sync="currentpage"
          :boundary-numbers="true"
          :boundary-links="true"
          :direction-links="true"
          :ellipses="true"
          class="fixed-bottom justify-center q-my-xl"
        >
        </q-pagination>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import Header from "../components/basic/Header.vue";
export default {
  data() {
    return {
      taskList: [],
      code: "", //当前输入的验证码
      name: "", //当前用户
      api: "/api",
      categories: [
        { value: "All", label: "All", icon: "dashboard" },
        { value: "Economy", label: "Economy", icon: "attach_money" },
        { value: "Science", label: "Science", icon: "science" },
        { value: "Politics", label: "Politics", icon: "gavel" },
        { value: "Literature", label: "Literature", icon: "library_books" },
        { value: "Sports", label: "Sports", icon: "directions_run" },
        { value: "Others", label: "Others", icon: "more" },
        {
          value: "Customized",
          label: "Customized",
          icon: "dashboard_customize",
        },
      ],
      category: "",
      subcontents: [],
      total: 0,
      pagesize: 10,
      currentpage: 1,
      currentContent: [],
    };
  },
  watch: {
    category() {
      this.filterC(this.category);
    },
    subcontents() {
      // console.log(this.subcontents);
      this.currentTotal();
    },
    currentpage() {
      this.showCurrent(this.currentpage);
    },
  },

  methods: {
    selectLabel(value) {
      this.category = value;
    },
    showCurrent(cpage) {
      var min = (cpage - 1) * this.pagesize;
      var max = cpage * this.pagesize;
      this.currentContent = this.subcontents.slice(min, max);
    },
    currentTotal() {
      this.total = this.subcontents.length;
    },
    filterC(category) {
      this.subcontents = this.taskList;
      if (category != "All" && category != "" && category != "Customized") {
        this.subcontents = this.subcontents.filter((temp) => {
          return temp["label"].indexOf(category) !== -1;
        });
      } else if (category == "Customized") {
        this.subcontents = this.subcontents.filter((temp) => {
          return (
            temp["label"].indexOf("Economy") == -1 &&
            temp["label"].indexOf("Science") == -1 &&
            temp["label"].indexOf("Politics") == -1 &&
            temp["label"].indexOf("Literature") == -1 &&
            temp["label"].indexOf("Sports") == -1 &&
            temp["label"].indexOf("Others") == -1
          );
        });
      }
      this.showCurrent(1);
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
    startEx(index) {
      if (this.name) {
        var diffId = this.currentContent[index]._id; //任务_id
        var path = "/diff/" + diffId;
        var authcode = this.currentContent[index].authcode; //任务对应的验证码
        if (authcode !== "") {
          this.$prompt("Please enter the verification code", "Alert", {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
          })
            .then(({ value }) => {
              if (authcode === value) {
                this.$router.push(path);
                //跳转到相应的练习页面
              } else {
                this.$message.error("Verification code error");
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "Cancelled",
              });
            });
        } else {
          this.$router.push(path);
        }
      } else {
        this.$router.push("/Login");
      }
    },
  },
  components: {
    Header,
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.$axios.get(this.api + "/taskList").then((res) => {
      this.taskList = res.data;
      this.taskList.reverse();
      this.subcontents = this.taskList;
      this.total = this.subcontents.length;
      this.showCurrent(this.currentpage);
      //因为现在数据库里的数据大部分没有time这个字段，先直接倒置整个数组，后面改用sort + compare
      // this.taskList.sort(this.compare("time", -1));
      console.log(this.currentContent);
    });
  },
};
</script>

<style>
#q-app {
  overflow: unset;
}

.GPL__page-container {
  padding-left: 50px;
}

.box-card {
  width: 40%;
}

.cards-container {
  text-align: center;
  position: relative;
  top: 5em;
}

.cards-box {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
}

.my-card {
  width: 100%;
  max-width: 255px;
}

.q-card__actions.q-card__actions--horiz.row.justify-start {
  justify-content: space-around;
}

aside.q-drawer.q-drawer--left.q-drawer--bordered.q-drawer--standard,
aside.q-drawer.q-drawer--left.q-drawer--bordered.q-drawer--mini {
  position: fixed;
  margin-top: 3em;
}

.q-layout.q-layout--standard {
  min-height: auto !important;
}

.q-img__content > div {
  padding: 8px 16px 4px 16px;
}
</style>
