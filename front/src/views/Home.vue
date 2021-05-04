<template>
  <q-page>
    <div class="scrollContainer">
      <section class="banner-area">
        <div class="banner-content">
          <div class="subtitle">
            <span>It's Time To Modify Others' Dictation!</span>
          </div>
          <h1 class="ml6 headline">
            <span class="text-wrapper">
              <span class="letters">Welcome to Co-Dictation!</span>
            </span>
          </h1>
          <p>
            Listen & Watch, Read & Modify, Record & Share New Information <br />
            Based on what you have captured from these diverse media. Everyone's
            welcome.
          </p>
          <a class="button" href="#/dictation">
            It's time to codictate!
          </a>
          <div class="q-mt-xl q-pt-xl">
            <a class="scroll-anima"><span></span></a>
          </div>
        </div>
      </section>

      <section class="intro-container" id="section1">
        <h3 class="home-sub-title text-center q-py-lg">
          — · ~ Features ~ · —
        </h3>

        <div
          class="feature ipsSpacer_bottom_double ipsGrid ipsGrid_collapsePhone"
        >
          <div
            class="featured-image-container ipsGrid_span5 gs_reveal gs_reveal_fromLeft"
          >
            <q-card class="q-pa-sm">
              <q-img :src="require('../assets/images/diff-6.png')" />
            </q-card>
          </div>

          <div class="ipsGrid_span7 ipsType_left">
            <h2 class="heading_large gs_reveal" style="padding: 0 1em">
              The formation of an optimal version through text comparison
            </h2>
          </div>
        </div>

        <div
          class="feature ipsSpacer_bottom_double ipsGrid ipsGrid_collapsePhone"
        >
          <div
            class="featured-image-container ipsGrid_span5 gs_reveal gs_reveal_fromLeft"
          >
            <q-card class="q-pa-sm">
              <q-img :src="require('../assets/images/score-2.png')" />
            </q-card>
          </div>

          <div class="ipsGrid_span7 ipsType_left">
            <h2 class="heading_large gs_reveal" style="padding: 0 1em">
              The detailed information of a student's dictation result
            </h2>
          </div>
        </div>

        <div
          class="feature ipsSpacer_bottom_double ipsGrid ipsGrid_collapsePhone"
        >
          <div
            class="featured-image-container ipsGrid_span5 gs_reveal gs_reveal_fromLeft"
          >
            <q-card class="q-pa-sm">
              <q-img :src="require('../assets/images/score-3.png')" />
            </q-card>
          </div>

          <div class="ipsGrid_span7 ipsType_left">
            <h2 class="heading_large gs_reveal" style="padding: 0 1em">
              The record of students' performance on dictation
            </h2>
          </div>
        </div>

        <div
          class="feature ipsSpacer_bottom_double ipsGrid ipsGrid_collapsePhone"
        >
          <div
            class="featured-image-container ipsGrid_span5 gs_reveal gs_reveal_fromLeft"
          >
            <q-card class="q-pa-sm">
              <q-img :src="require('../assets/images/board-1.png')" />
            </q-card>
          </div>

          <div class="ipsGrid_span7 ipsType_left">
            <h2 class="heading_large gs_reveal" style="padding: 0 1em">
              The use of leaderboards as a motivational tool
            </h2>
          </div>
        </div>
      </section>

      <section class="footer">
        <h6 class="footer-abs">
          <span>Created by Informatics 1701 of FELC in GDUFS.</span>
        </h6>
        <div class="footer-container waveWrapper waveAnimation">
          <div class="waveWrapperInner bgTop">
            <div
              class="wave waveTop"
              style="background-image: url('http://front-end-noobs.com/jecko/img/wave-top.png')"
            ></div>
          </div>
          <div class="waveWrapperInner bgMiddle">
            <div
              class="wave waveMiddle"
              style="background-image: url('http://front-end-noobs.com/jecko/img/wave-mid.png')"
            ></div>
          </div>
          <div class="waveWrapperInner bgBottom">
            <div
              class="wave waveBottom"
              style="background-image: url('http://front-end-noobs.com/jecko/img/wave-bot.png')"
            ></div>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script>
const anime = require("../anime.min.js");

export default {
  data() {
    return {
      slide: 1,
      autoplay: true,
    };
  },
  mounted() {
    var textWrapper = document.querySelector(".ml6 .letters");
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );

    anime.timeline({ loop: false }).add({
      targets: ".ml6 .letter",
      translateY: ["1.1em", 0],
      translateZ: 0,
      duration: 750,
      delay: (el, i) => 50 * i,
    });
  },
};
</script>

<style lang="scss">
body {
  transition: 0.3s ease-out;
  overflow-x: hidden;
  max-width: 100%;
  width: 100%;
}

// 第一个section的css
.banner-content {
  text-align: center;
  margin-top: -8em;
}

.banner-area {
  height: 100%;
  width: 100%;
  display: block;
  background: linear-gradient(rgba(0, 0, 0, 0) 30%, #790f8b73),
    url("../assets/logo/bg-2.jpg") no-repeat center center/cover;
  min-height: 100vh;
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  place-items: center;
}

.headline {
  font-size: 78px;
  line-height: 1.2;
  font-weight: 400;
  color: rgba(8, 8, 8, 1);
  text-align: center;
  font-feature-settings: "pnum" on, "lnum" on;
  font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
  letter-spacing: -0.05em;
  margin-top: 0.45em;
  margin-bottom: 0.2em;
}

p {
  margin: 0;
  padding-top: 10px;
  opacity: 1;
  transform: translate(0);
  transition: all 300ms linear;
  transition-delay: 1500ms;
  color: #7b617f;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.subtitle {
  position: relative;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  font-size: 14px;
  color: #671067;
}

.subtitle:before {
  margin-left: -68px;
  text-align: right;
}

.subtitle:after {
  margin-left: 15px;
}

.subtitle:before,
.subtitle:after {
  position: absolute;
  top: 50%;
  overflow: hidden;
  width: 50px;
  height: 1px;
  border-top: 2px solid #cab3ce;
  content: "";
}

.button {
  font-family: "Roboto Mono", sans-serif;
  text-decoration: none;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 2vmin;
  display: inline-block;
  position: relative;
  border: 3px solid purple;
  box-shadow: -0.5vmin 0.5vmin 0 rgba(purple, 0.5);
  background: transparent;
  margin-top: 7vmin;
  mix-blend-mode: multiply;
  color: purple;
  padding: 2vmin 2vmin 1.8vmin 2vmin;
  letter-spacing: 0.1em;
  text-shadow: none;
  line-height: 1;
  transform: translate3d(0.5vmin, -0.5vmin, 0);
  transition: all 100ms linear;

  &:hover {
    transform: translate3d(1vmin, -1vmin, 0);
    box-shadow: -1vmin 1vmin 0 rgba(rgb(184, 95, 184), 0.5);
    border: 3px solid rgb(185, 114, 185);
    background: rgb(185, 114, 185);
    color: white;
  }

  &:active {
    transform: translate3d(0px, 0px, 0);
    box-shadow: -0px 0px 0 rgba(purple, 0.5);
  }
}
// 向下滑动提示动画
.scroll-anima span {
  position: absolute;
  top: 68%;
  left: 50%;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  border-left: 1px solid #862897;
  border-bottom: 1px solid #862897;
  -webkit-transform: rotateZ(-45deg);
  transform: rotateZ(-45deg);
  -webkit-animation: sdb 1.5s infinite;
  animation: sdb 1.5s infinite;
  box-sizing: border-box;
}
@-webkit-keyframes sdb {
  0% {
    -webkit-transform: rotateY(0) rotateZ(-45deg) translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    -webkit-transform: rotateY(720deg) rotateZ(-45deg) translate(-20px, 20px);
    opacity: 0;
  }
}
@keyframes sdb {
  0% {
    transform: rotateY(0) rotateZ(-45deg) translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotateY(720deg) rotateZ(-45deg) translate(-20px, 20px);
    opacity: 0;
  }
}

// 第二个section的css
.intro-container {
  height: 100%;
  width: 100%;
  padding: 1% 10%;
  box-shadow: inset 6em 16em 25em -20em #560268;
}
.ipsType_right {
  text-align: right;
}
.ipsType_center {
  text-align: center;
}
.ipsSpacer_bottom_double {
  margin-bottom: 3em;
}
.ipsGrid {
  display: inline-block;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
}
.ipsGrid::before,
.ipsGrid::after {
  display: table;
  content: "";
  line-height: 0;
}
.ipsGrid > [class*="ipsGrid_span"] {
  display: block;
  width: 100%;
  min-height: 30px;
  box-sizing: border-box;
}
.ipsGrid > .ipsGrid_span5 {
  width: 60%;
}
.ipsGrid > .ipsGrid_span7 {
  width: 38%;
}
.ipsGrid > [class*="ipsGrid_span"] {
  float: left;
  margin-left: 2%;
}
.ipsGrid > [class*="ipsGrid_span"]:first-child {
  margin-left: 0;
}
.feature {
  display: flex;
  align-items: center;
}
h2.heading_large {
  font-size: 2em;
  font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
}
h6.gs_reveal {
  font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
}

// 最后一个section的wave背景
@keyframes move_wave {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}

.footer {
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: auto;
  place-items: center;
  min-height: 30vh !important;
  padding: 50px 10vw;
  margin: auto;
}

.footer-container {
  display: flex;
  position: relative;
  width: 100vw;
  max-height: 100vh;
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    padding-bottom: calc(100% / (16 / 9));
  }
}
.waveWrapper {
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}
.waveWrapperInner {
  position: absolute;
  width: 100%;
  overflow: hidden;
  height: 100%;
  bottom: -3em;
  background-image: linear-gradient(to top, #7c0f8f, #ffffff);
}
.bgTop {
  z-index: 15;
  opacity: 0.5;
}
.bgMiddle {
  z-index: 10;
  opacity: 0.75;
}
.bgBottom {
  z-index: 5;
}
.wave {
  position: absolute;
  bottom: 3em;
  left: 0;
  width: 200%;
  height: 100%;
  background-repeat: repeat no-repeat;
  background-position: 0 bottom;
  transform-origin: center bottom;
}
.waveTop {
  background-size: 50% 100px;
}
.waveAnimation .waveTop {
  animation: move-wave 3s;
  -webkit-animation: move-wave 3s;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
.waveMiddle {
  background-size: 50% 120px;
}
.waveAnimation .waveMiddle {
  animation: move_wave 10s linear infinite;
}
.waveBottom {
  background-size: 50% 100px;
}
.waveAnimation .waveBottom {
  animation: move_wave 15s linear infinite;
}

.home-sub-title {
  color: #253439;
  font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
}

// 最后一个section的slogan
.ml6 {
  position: relative;
  font-size: 6em;
  color: #2b242a;
}

.ml6 .text-wrapper {
  position: relative;
  display: inline-block;
  padding-top: 0.2em;
  padding-right: 0.05em;
  padding-bottom: 0.1em;
  overflow: hidden;
}

.ml6 .letter {
  display: inline-block;
  line-height: 1.2em;
}

.footer-abs {
  z-index: 999;
  font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
  margin-bottom: 4em;
}
</style>
