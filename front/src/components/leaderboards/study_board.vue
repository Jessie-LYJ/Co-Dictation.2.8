<template>
  <div class="l-wrapper" style="margin-top: 60px">
    <div class="l-grid">
      <div class="l-grid__item l-grid__item--sticky">
        <div class="c-card shadow">
          <div class="u-display--flex u-justify--center">
            <div class="u-text--center q-mx-md">
              <h4>Rank</h4>
              <h4>{{ myRank }}</h4>
            </div>
            <div class="u-text--center q-mx-md">
              <h4>Score</h4>
              <h4>{{ myScore }}</h4>
            </div>
          </div>
        </div>

        <div class="c-card shadow u-display--flex u-justify--center">
          <div class="u-text--center">
            <h4 class="q-mt-lg q-mb-md">Winner</h4>
            <avatar-org
              class="c-avatar c-avatar--lg q-mt-sm"
              :name="winnerName"
            ></avatar-org>
            <h5 class="q-mt-md q-mb-sm">Username: {{ winnerName }}</h5>
            <h5 class="q-mt-sm q-mb-lg">Score: {{ winnerScore }}</h5>
          </div>
        </div>
      </div>
      <div class="l-grid__item">
        <div class="c-card shadow">
          <div class="c-card__header">
            <h3>Leaderboards</h3>
            <!-- <el-button @click="change('day')">Day</el-button>
            <el-button @click="change('week')">Week</el-button>
            <el-button @click="change('month')">Month</el-button>
            <el-button @click="change('year')">Year</el-button> -->
            <q-btn-group>
              <q-btn color="purple" glossy label="Day" @click="change('day')" />
              <q-btn
                color="purple"
                glossy
                label="Week"
                @click="change('week')"
              />
              <q-btn
                color="purple"
                glossy
                label="Month"
                @click="change('month')"
              />
              <q-btn
                color="purple"
                glossy
                label="Year"
                @click="change('year')"
              />
            </q-btn-group>
          </div>
          <div class="c-card__body">
            <div class="c-list__grid">
              <h5 class="q-my-xs u-text--left">Rank</h5>
              <h5 class="q-my-xs q-ml-sm u-text--left">Name</h5>
              <h5 class="q-my-xs u-text--right">Scores</h5>
            </div>
            <ul class="c-list list" id="list"></ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarOrg from "../basic/Avatar";
export default {
  data() {
    return {
      api: "score",
      name: "",
      myRank: "",
      myScore: "",
      winnerName: "",
      winnerScore: "",
      team: [],
      studyList: [],
    };
  },
  components: {
    AvatarOrg,
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.$axios.get(this.api + "/study").then((res) => {
      this.studyList = res.data;
      this.team = res.data.todaylist;
      this.pushRank();
    });
  },

  methods: {
    change(type) {
      var oUl = document.getElementsByClassName("c-list list");
      oUl[0].innerHTML = "";
      if (type == "day") {
        this.team = this.studyList.todaylist;
      } else if (type == "week") {
        this.team = this.studyList.weeklist;
        // console.log("week", this.studyList)
      } else if (type == "month") {
        this.team = this.studyList.monthlist;
      } else if (type == "year") {
        this.team = this.studyList.yearlist;
      }
      this.pushRank();
    },
    pushRank() {
      const randomEmoji = () => {
        const emojis = ["👏", "👍", "🙌", "🤩", "🔥", "⭐️", "🏆", "💯"];
        let randomNumber = Math.floor(Math.random() * emojis.length);
        return emojis[randomNumber];
      };
      if (this.team.length > 0) {
        this.team.forEach((member) => {
          if (member.rank <= 10) {
            let newRow = document.createElement("li");
            var oUl = document.getElementsByClassName("c-list list");
            newRow.classList = "c-list__item";
            newRow.innerHTML = `
		<div class="c-list__grid box">
			<div class="c-flag c-place u-bg--transparent">${member.rank}</div>
      <div class="c-media">
      <avatar-org></avatar-org>	
				<div class="c-media__content">
					<div class="c-media__title">${member.name}</div>
				</div>
			</div>
			<div class="u-text--right c-kudos">
				<div class="u-mt--8">
					<strong>${member.studyTime}</strong> ${randomEmoji()}
				</div>
			</div>
		</div>
  `;
            if (member.rank === 1) {
              this.winnerName = member.name;
              this.winnerScore = member.studyTime;
            }
            if (this.name == member.name) {
              this.myRank = member.rank;
              this.myScore = member.studyTime;
            }
            oUl[0].appendChild(newRow);
          }
        });
      } else {
        let newRow = document.createElement("li");
        var oUl = document.getElementsByClassName("c-list list");
        newRow.classList = "c-list__item";
        newRow.innerHTML = `
        <div style="text-align:center">No data yet</div>
        `;
        this.winnerName = "No Data";
        this.winnerScore = 0;
        this.myRank = 0;
        this.myScore = 0;
        oUl[0].appendChild(newRow);
      }
    },
  },
  watch: {
    $route(to, from) {
      //刷新参数放到这里里面去触发就可以刷新相同界面了
      this.pushRank();
    },
  },
};
</script>