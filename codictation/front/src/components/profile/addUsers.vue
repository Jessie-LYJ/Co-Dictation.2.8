<template>
  <q-page class="q-pa-md">
    <h3 class="q-my-md">Add Users</h3>
    <q-separator insert style="width: 55%" class="q-mb-lg" />
    <div class="row col-12 q-px-md">
      <div class="col-8">
        <!-- 上传小组名单 -->
        <q-input
          single
          type="file"
          standout="bg-purple-5 text-white"
          bottom-slots
          accept=".xlsx"
          class="q-mb-sm"
          @change="getFile($event)"
          v-model="fileName"
        >
          <template v-slot:before>
            <q-icon name="group_add" size="lg" color="purple" class="q-mr-sm" />
          </template>

          <template v-slot:hint>
            Group List
          </template>

          <template v-slot:append>
            <q-icon name="upload_file" size="md" />
          </template>
        </q-input>

        <!-- 小组标签：不可重复 -->
        <q-input
          standout="bg-purple-5 text-white"
          color="white"
          clearable
          clear-icon="close"
          v-model="tag"
          label="Account Tag"
          hint="No Repeating Account Tag"
          error-message="× Account Tag Already Existed. Please Change Another One."
          :error="isRepeted"
          lazy-rules
          bottom-slots
          id="task-title"
          autocomplete="off"
          class="q-mb-sm"
        >
          <template v-slot:before>
            <q-icon name="new_label" size="lg" color="purple" class="q-mr-sm" />
          </template>
        </q-input>
      </div>
      <div class="col-4 justify-center q-gutter-md q-px-md q-py-lg">
        <div class="row">
          <q-btn
            class="q-mx-md"
            label="Preview"
            color="purple-13"
            push
            icon="preview"
            @click="showTable()"
            style="width: 15em"
          />
        </div>
        <div class="row">
          <q-btn
            class="q-mx-md"
            label="Import"
            color="purple-14"
            push
            icon="upload"
            @click="submitList()"
            style="width: 15em"
            :disabled="tagExist"
          />
        </div>
      </div>
    </div>

    <div class="q-pa-md row justify-start">
      <div class="col-7 q-px-md">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Group Tag List
            </q-item-label>
            <q-separator insert style="width: 75%" class="q-my-sm" />
          </q-item-section>
        </q-item>
        <q-list
          bordered
          class="rounded-borders"
          v-for="(item, index) in allData"
          :key="index"
        >
          <q-expansion-item icon="sell" :label="item.tagName">
            <q-card>
              <q-card-section class="row justify-center">
                <q-table
                  :data="item.userList"
                  :columns="columns"
                  row-key="stuid"
                  style="width: 85%"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>

      <div class="col-5 q-px-lg" v-if="table">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              Preview
            </q-item-label>
            <q-separator insert style="width: 75%" class="q-my-sm" />
          </q-item-section>
        </q-item>
        <q-table
          :data="accountList"
          :columns="columns"
          row-key="stuid"
          style="width: 100%"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import Header from "../basic/Header.vue";
export default {
  data() {
    return {
      accountList: [],
      table: false,
      count: 0, //阻止文件上传成功事件触发的二次上传
      tag: "",
      tagList: [], //获取该用户已添加的tags
      tagExist: false,
      owner: "",
      status: "",
      api: "/api",
      allData: [],
      fileName: null, // 所上传的文件名
      columns: [
        {
          name: "stuid",
          required: true,
          label: "Student ID",
          align: "center",
          field: "stuid",
          sortable: true,
          headerClasses: "bg-purple text-white",
          style: "max-width: 100px",
        },
        {
          name: "stuname",
          align: "center",
          label: "Name",
          align: "center",
          field: "stuname",
          sortable: false,
          headerClasses: "bg-purple text-white",
        },
      ],
    };
  },
  components: {
    Header,
  },
  computed: {
    // 检测名单标签是否重名
    isRepeted() {
      for (var i = 0; i < this.tagList.length; i++) {
        if (this.tag == this.tagList[i]) {
          return true; //重名则无法提交
        }
      }
    },
  },
  methods: {
    showTable() {
      if (this.accountList.length > 0) {
        this.table = !this.table;
      } else {
        this.$notify({
          message: "Haven't added name list yet",
          type: "warning",
          position: "top-right",
          offset: 100,
        });
      }
    },
    getFile(event) {
      this.count = 0;
      this.accountList = [];
      this.count++;
      if (this.count == 1) {
        let _this = this;
        let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
        if (event.target.files.length == 1) {
          this.file = event.target.files[0];
        }
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require("xlsx");
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), {
                //手动转化
                type: "base64",
              });
            } else {
              wb = XLSX.read(binary, {
                type: "binary",
              });
            }
            // outdata就是你想要的东西 excel导入的数据
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            // excel 数据再处理
            let arr = [];
            outdata.map((v) => {
              let obj = {};
              obj.stuid = v.学号;
              obj.name = v.学号 + v.姓名;
              obj.stuname = v.姓名;
              obj.password = v.密码;
              arr.push(obj);
            });
            _this.accountList = [...arr];
            this.able = false;
            console.log(_this.accountList);
            // _this.reload();
          };
          reader.readAsArrayBuffer(f);
        };
        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      }
    },
    submitList() {
      if (this.accountList.length > 0) {
        if (this.tag.trim().length > 0) {
          this.$axios
            .post(this.api + "/addUsers", {
              owner: this.owner,
              userList: this.accountList,
              tagName: this.tag,
            })
            .then((result) => {
              console.log(result);
              console.log("数据已上传");
              this.$notify({
                type: "success",
                message: "Import name list successfully",
                position: "top-right",
                offset: 100,
              });
              this.$router.go(0);
            });
        } else {
          this.$notify({
            type: "warning",
            message: "The tag cannot be empty",
            position: "top-right",
            offset: 100,
          });
        }
      } else {
        this.$notify({
          message: "Haven't added name list yet",
          type: "warning",
          position: "top-right",
          offset: 100,
        });
      }
    },
    checkTag() {
      //检测标题是否重名
      for (var i = 0; i < this.tagList.length; i++) {
        if (this.tagList[i] == this.tag) {
          this.tagExist = true; //重名则无法提交
          return;
        } else {
          this.tagExist = false;
        }
      }
    },
    getTagList() {
      //连接数据库，获取数据库中属于当前用户的tag列表
      this.$axios.get(this.api + "/tagList?owner=" + this.owner).then((res) => {
        this.allData = res.data;
        for (var i = 0; i < this.allData.length; i++) {
          this.tagList.push(this.allData[i].tagName);
        }
        console.log(this.allData);
      });
    },
    getStatus() {
      //连接数据库，获取数据库中属于当前用户的status
      this.$axios.get(this.api + "/profile?name=" + this.owner).then((res) => {
        this.status = res.data[0].status;
      });
    },
  },
  created() {
    this.owner = sessionStorage.getItem("userName");
    this.getTagList();
    this.getStatus();
  },
};
</script>

<style>
.q-field__native[type="file"] {
  line-height: 3em;
}
</style>
