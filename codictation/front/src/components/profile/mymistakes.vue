<template>
  <div>
    <q-page class="q-pa-lg">
      <div id="container" v-if="islistType">
        <template v-for="item in listType" class="type">
          <q-btn
            color="purple"
            :label="item"
            @click="changetype(item)"
            :key="item"
            style="margin-left: 7px; margin-bottom: 17px"
          />
        </template>

        <template v-for="(item, index) in sentences">
          <el-card :key="item.stn" shadow="always" style="margin-top: 5px"
            ><span v-html="item.stn"> </span>
            <q-btn
              size="sm"
              color="purple"
              :label="item.isPlay"
              @click="
                playAudio(
                  item.sTime,
                  item.eTime,
                  item.fName,
                  index,
                  item.isPlay
                )
              "
              :key="item.sTime"
              style="margin-left: 7px"
            />
          </el-card>
        </template>
      </div>
      <div v-else>No mistakes yet...</div>
    </q-page>

    <!-- <button @click="playAudio('5','10')">play</button> -->
    <div class="audio-box q-mr-sm">
      <audio
        :src="require('@/assets/video/' + fileName)"
        id="audio"
        controls
        hidden
      ></audio>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      name: "", //当前用户的用户名
      //userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
      api: "/score",
      WrongLists: [],
      listType: [],
      islistType: false,
      // checkedType:" ",
      sentences: [],
      isShow: false,
      fileName: "3eefe69def1e7c20a76675eba160b820.mp3",
      endTime: "",
      startTime: "",
    };
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    console.log(this.name);
    this.$axios.get(this.api + "/wrongList/?name=" + this.name).then((res) => {
      var list = res.data.myWrongLists;
      this.WrongLists = res.data.myWrongLists;

      // var type = this.checkedType

      //筛选对应的类型的句子

      //返回存在的错误类型
      let list2 = list.map((item) => item.type);
      let list3 = list2.filter(function (element, index, self) {
        return self.indexOf(element) === index;
      });
      this.listType = list3;
      if (this.listType.length > 0) {
        this.islistType = true;
      }
    });
  },
  mounted() {
    //监听播放时间
    var player = document.getElementById("audio");
    player.addEventListener("timeupdate", this.loopPlayer);
  },
  methods: {
    loopPlayer() {
      var player = document.getElementById("audio");
      var timeDisplay;
      timeDisplay = player.currentTime;
      // console.log(timeDisplay)
      //ts 12.33 两位小数
      // var ts = Math.floor(timeDisplay * 100) / 100

      // floor(54.98) -- 54    ceil(54.12) -- 55
      var played = Math.floor(timeDisplay);
      var ended = Math.ceil(this.endTime);
      var duration = player.duration;
      if (ended > duration) {
        played = timeDisplay;
        ended = duration;
      }
      if (played == ended) {
        console.log(timeDisplay);
        console.log("pause");
        player.pause();
        player.currentTime = this.startTime;
        player.play();
      }
    },

    playAudio(sTime, eTime, fName, index, isPlay) {
      var player = document.getElementById("audio");
      if (isPlay == "Play") {
        console.log(fName);
        this.fileName = fName;
        this.endTime = eTime;
        this.startTime = sTime;
        console.log(this.startTime);
        console.log(this.endTime);
        player.currentTime = this.startTime;
        player.play();
        this.sentences[index].isPlay = "Pause";
      } else {
        player.pause();
        this.sentences[index].isPlay = "Play";
      }
    },
    stop() {
      var player = document.getElementById("audio");
      player.currentTime = this.startTime;
      player.pause();
      this.isPlay = true;
    },

    ToSecond(t) {
      var s = 0.0;
      if (t) {
        var p = t.split(":");
        for (let i = 0; i < p.length; i++) {
          s = s * 60 + parseFloat(p[i].replace(",", "."));
        }
      }
      return s;
    },

    changetype(item) {
      var list = this.WrongLists;
      let newList = list.filter(function (element) {
        return element.type == item;
      });
      let arr = [];
      newList.forEach((e) => {
        var startS = this.ToSecond(e.sTime);
        var endS = this.ToSecond(e.eTime);
        var newArr = {
          stn: e.sentence,
          sTime: startS + "",
          eTime: endS + "",
          fName: e.filename,
          isPlay: "Play",
        };
        arr.push(newArr);
      });

      this.sentences = arr;
      this.isShow = true;
      console.log(arr);
      // console.log("b", this.isShow);
    },
  },
};
</script>

<style>
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
</style>
