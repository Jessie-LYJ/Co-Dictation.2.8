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
    };
  },
  components: {
    AvatarOrg,
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.$axios.get(this.api + "/task").then((res) => {
      var team = res.data;

      const randomEmoji = () => {
        const emojis = ["👏", "👍", "🙌", "🤩", "🔥", "⭐️", "🏆", "💯"];
        let randomNumber = Math.floor(Math.random() * emojis.length);
        return emojis[randomNumber];
      };

      team.forEach((member) => {
        if (member.rank <= 10) {
          let newRow = document.createElement("li");
          var oUl = document.getElementsByClassName("c-list list");

          newRow.classList = "c-list__item";
          newRow.innerHTML = `
		<div class="c-list__grid box">
			<div class="c-flag c-place u-bg--transparent">${member.rank}</div>
      <div class="c-media">
				<div class="c-media__content">
					<div class="c-media__title">${member.name}</div>
				</div>
			</div>
			<div class="u-text--right c-kudos">
				<div class="u-mt--8">
					<strong>${member.taskNums}</strong> ${randomEmoji()}
				</div>
			</div>
		</div>
  `;
          if (member.rank === 1) {
            this.winnerName = member.name;
            this.winnerScore = member.taskNums;
          }
          if (this.name == member.name) {
            this.myRank = member.rank;
            this.myScore = member.taskNums;
          }
          oUl[0].appendChild(newRow);
        }
      });
    });
  },

  methods: {},
};
</script>
