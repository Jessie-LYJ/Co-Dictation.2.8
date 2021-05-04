<template>
  <q-page class="diy-row">
    <div class="six diy-columns">
      <div class="ios7-icon">
        <ul class="hashtag">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="others">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="profile-text">
        <h3 class="q-pa-sm profileTi">Hi, {{ name }}</h3>
        <h3 class="q-pa-sm profileTi">Welcome To Codictation!</h3>
        <h2 class="q-pa-sm profileTi">Personalize Your Profile ~</h2>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      name: "", //当前用户的用户名
    };
  },
  created() {
    this.name = sessionStorage.getItem("userName");
  },
};
</script>

<style>
.diy-row {
  margin-top: 0;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  max-width: 1056px;
  width: 100%;
  *zoom: 1;
}
.diy-row:before,
.diyrow:after {
  display: table;
  content: " ";
}
.diy-row:after {
  clear: both;
}
.diy-column,
.diy-columns {
  position: relative;
  float: left;
  padding-right: 1.51516%;
  padding-left: 1.51516%;
  width: 100%;
}
.six {
  width: 100%;
}

.ios7-icon {
  width: 12em;
  height: 12em;
  -webkit-border-radius: 22.53125%;
  -moz-border-radius: 22.53125%;
  border-radius: 22.53125%;
  border: 1px solid #93329e;
  position: absolute;
  top: 0;
  left: 35.26315%;
  margin-top: 15.5em;
  -webkit-animation: dev_icon 1s 2.1s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: dev_icon 1s 2.1s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: dev_icon 1s 2.1s linear;
  -o-animation-fill-mode: forwards;
  animation: dev_icon 1s 2.1s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ios7-icon ul.others li:nth-child(3) {
  width: 0;
  height: 1px;
  position: absolute;
  top: 0.938em;
  left: -1em;
  background-color: #74a0be;
  -webkit-animation: line1 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:nth-child(4) {
  width: 0;
  height: 1px;
  position: absolute;
  top: 0.938em;
  right: -4px;
  background: #74a0be;
  -webkit-animation: line1 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:nth-child(9) {
  width: 0;
  height: 1px;
  position: absolute;
  bottom: 0.938em;
  left: -5px;
  background: #74a0be;
  -webkit-animation: line1 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:nth-child(10) {
  width: 0;
  height: 1px;
  position: absolute;
  bottom: 0.938em;
  right: -48px;
  background: #74a0be;
  -webkit-animation: line1 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}

.ios7-icon ul.others li:nth-child(5) {
  width: 1px;
  height: 0;
  position: absolute;
  top: -3px;
  left: 0.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:nth-child(8) {
  width: 1px;
  height: 0;
  position: absolute;
  bottom: -17px;
  left: 0.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:nth-child(6) {
  width: 1px;
  height: 0;
  position: absolute;
  top: -10px;
  right: 0.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:nth-child(7) {
  width: 1px;
  height: 0;
  position: absolute;
  bottom: -7px;
  right: 0.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 1.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 1.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 1.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 1.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.hashtag li:first-child {
  width: 0;
  height: 1px;
  position: absolute;
  top: 3.938em;
  left: 0;
  background-color: #74a0be;
  -webkit-animation: line1 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.hashtag li:nth-child(4) {
  width: 0;
  height: 1px;
  position: absolute;
  top: 3.938em;
  right: 0;
  background: #74a0be;
  -webkit-animation: line1 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}

.ios7-icon ul.hashtag li:nth-child(2) {
  width: 0;
  height: 1px;
  position: absolute;
  left: 0;
  bottom: 3.938em;
  background: #74a0be;
  -webkit-animation: line1 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}

.ios7-icon ul.hashtag li:nth-child(3) {
  width: 0;
  height: 1px;
  position: absolute;
  right: 0;
  bottom: 3.938em;
  background: #74a0be;
  -webkit-animation: line1 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line1 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line1 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line1 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.hashtag li:nth-child(5) {
  width: 1px;
  height: 0;
  position: absolute;
  top: 0;
  left: 3.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.hashtag li:nth-child(6) {
  width: 1px;
  height: 0;
  position: absolute;
  bottom: 0;
  left: 3.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.hashtag li:nth-child(7) {
  width: 1px;
  height: 0;
  position: absolute;
  top: 0;
  right: 3.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.hashtag li:nth-child(8) {
  width: 1px;
  height: 0;
  position: absolute;
  bottom: 0;
  right: 3.938em;
  background: #74a0be;
  -webkit-animation: line2 0.5s 0.5s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: line2 0.5s 0.5s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: line2 0.5s 0.5s linear;
  -o-animation-fill-mode: forwards;
  animation: line2 0.5s 0.5s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:first-child {
  width: 1px;
  height: 0;
  position: absolute;
  bottom: 0;
  left: -1px;
  background: #a37eba;
  -webkit-transform: rotate(45deg);
  -webkit-transform-origin: left bottom;
  -webkit-animation: line3 0.5s 1s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-transform: rotate(45deg);
  -moz-transform-origin: left bottom;
  -moz-animation: line3 0.5s 1s linear;
  -moz-animation-fill-mode: forwards;
  -o-transform: rotate(45deg);
  -o-transform-origin: left bottom;
  -o-animation: line3 0.5s 1s linear;
  -o-animation-fill-mode: forwards;
  transform: rotate(45deg);
  transform-origin: left bottom;
  animation: line3 0.5s 1s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.others li:nth-child(2) {
  width: 1px;
  height: 0;
  position: absolute;
  bottom: 0;
  right: -1px;
  background: #a37eba;
  -webkit-transform: rotate(-45deg);
  -webkit-transform-origin: right bottom;
  -webkit-animation: line3 0.5s 1s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-transform: rotate(-45deg);
  -moz-transform-origin: right bottom;
  -moz-animation: line3 0.5s 1s linear;
  -moz-animation-fill-mode: forwards;
  -o-transform: rotate(-45deg);
  -o-transform-origin: right bottom;
  -o-animation: line3 0.5s 1s linear;
  -o-animation-fill-mode: forwards;
  transform: rotate(-45deg);
  transform-origin: right bottom;
  animation: line3 0.5s 1s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.circles li:first-child {
  width: 2em;
  height: 2em;
  position: absolute;
  bottom: 0.938em;
  right: 4.813em;
  opacity: 0;
  border-radius: 100%;
  border: 1px solid #ad6989;
  background-color: #ad6989;
  -webkit-animation: circle1 0.5s 1.6s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: circle1 0.5s 1.6s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: circle1 0.5s 1.6s linear;
  -o-animation-fill-mode: forwards;
  animation: circle1 0.5s 1.6s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.circles li:nth-child(2) {
  width: 4em;
  height: 4em;
  position: absolute;
  bottom: 3.938em;
  left: -1px;
  opacity: 0;
  border-radius: 100%;
  border: 1px solid #ad6989;
  -webkit-animation: circle2 0.4s 1.6s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: circle2 0.4s 1.6s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: circle2 0.4s 1.6s linear;
  -o-animation-fill-mode: forwards;
  animation: circle2 0.4s 1.6s linear;
  animation-fill-mode: forwards;
}
.ios7-icon ul.circles li:nth-child(3) {
  width: 11.875em;
  height: 11.875em;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  border-radius: 100%;
  border: 1em solid #ad6989;
  -webkit-animation: circle3 0.2s 2.1s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: circle3 0.2s 2.1s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: circle3 0.2s 2.1s linear;
  -o-animation-fill-mode: forwards;
  animation: circle3 0.2s 2.1s linear;
  animation-fill-mode: forwards;
}

.profile-text {
  color: #6f4a8e;
  font-size: 168.3%;
  line-height: 1.1;
  position: absolute;
  text-decoration: none;
  /* text-transform: capitalize; */
  top: 3.25em;
  left: 16%;
  margin-left: -3em;
  margin-top: 1em;
  opacity: 0;
  -webkit-animation: profile_txt 0.5s 2.8s linear;
  -webkit-animation-fill-mode: forwards;
  -moz-animation: profile_txt 0.5s 2.8s linear;
  -moz-animation-fill-mode: forwards;
  -o-animation: profile_txt 0.5s 2.8s linear;
  -o-animation-fill-mode: forwards;
  animation: profile_txt 0.5s 2.8s linear;
  animation-fill-mode: forwards;
}

.profileTi {
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(135deg, #a37eba 10%, #923a6e 100%);
}

@-webkit-keyframes line1 {
  0% {
    width: 0;
  }
  100% {
    width: 8em;
  }
}
@-moz-keyframes line1 {
  0% {
    width: 0;
  }
  100% {
    width: 8em;
  }
}
@-o-keyframes line1 {
  0% {
    width: 0;
  }
  100% {
    width: 8em;
  }
}
@keyframes line1 {
  0% {
    width: 0;
  }
  100% {
    width: 8em;
  }
}

@-webkit-keyframes line2 {
  0% {
    height: 0;
  }
  100% {
    height: 6.75em;
  }
}
@-moz-keyframes line2 {
  0% {
    height: 0;
  }
  100% {
    height: 6.75em;
  }
}
@-o-keyframes line2 {
  0% {
    height: 0;
  }
  100% {
    height: 6.75em;
  }
}
@keyframes line2 {
  0% {
    height: 0;
  }
  100% {
    height: 6.75em;
  }
}

@-webkit-keyframes line3 {
  0% {
    bottom: 0;
    height: 0;
  }
  100% {
    bottom: 0;
    height: 17em;
  }
}
@-moz-keyframes line3 {
  0% {
    bottom: 0;
    height: 0;
  }
  100% {
    bottom: 0;
    height: 17em;
  }
}
@-o-keyframes line3 {
  0% {
    bottom: 0;
    height: 0;
  }
  100% {
    bottom: 0;
    height: 17em;
  }
}
@keyframes line3 {
  0% {
    bottom: 0;
    height: 0;
  }
  100% {
    bottom: 0;
    height: 17em;
  }
}

@-webkit-keyframes circle1 {
  0% {
    width: 2em;
    height: 2em;
    bottom: 0.938em;
    right: 4.813em;
    background-color: #ad6989;
    opacity: 0;
  }
  100% {
    width: 4em;
    height: 4em;
    bottom: 3.938em;
    right: 3.938em;
    background-color: transparent;
    opacity: 1;
  }
}
@-moz-keyframes circle1 {
  0% {
    width: 2em;
    height: 2em;
    bottom: 0.938em;
    right: 4.813em;
    background-color: #ad6989;
    opacity: 0;
  }
  100% {
    width: 4em;
    height: 4em;
    bottom: 3.938em;
    right: 3.938em;
    background-color: transparent;
    opacity: 1;
  }
}
@-o-keyframes circle1 {
  0% {
    width: 2em;
    height: 2em;
    bottom: 0.938em;
    right: 4.813em;
    background-color: #ad6989;
    opacity: 0;
  }
  100% {
    width: 4em;
    height: 4em;
    bottom: 3.938em;
    right: 3.938em;
    background-color: transparent;
    opacity: 1;
  }
}
@keyframes circle1 {
  0% {
    width: 2em;
    height: 2em;
    bottom: 0.938em;
    right: 4.813em;
    background-color: #ad6989;
    opacity: 0;
  }
  100% {
    width: 4em;
    height: 4em;
    bottom: 3.938em;
    right: 3.938em;
    background-color: transparent;
    opacity: 1;
  }
}

@-webkit-keyframes circle2 {
  0% {
    width: 4em;
    height: 4em;
    bottom: 4em;
    left: -1px;
    opacity: 0;
  }
  100% {
    width: 10em;
    height: 10em;
    bottom: 0.938em;
    left: 0.938em;
    opacity: 1;
  }
}
@-moz-keyframes circle2 {
  0% {
    width: 4em;
    height: 4em;
    bottom: 4em;
    left: -1px;
    opacity: 0;
  }
  100% {
    width: 10em;
    height: 10em;
    bottom: 0.938em;
    left: 0.938em;
    opacity: 1;
  }
}
@-o-keyframes circle2 {
  0% {
    width: 4em;
    height: 4em;
    bottom: 4em;
    left: -1px;
    opacity: 0;
  }
  100% {
    width: 10em;
    height: 10em;
    bottom: 0.938em;
    left: 0.938em;
    opacity: 1;
  }
}
@keyframes circle2 {
  0% {
    width: 4em;
    height: 4em;
    bottom: 4em;
    left: -1px;
    opacity: 0;
  }
  100% {
    width: 10em;
    height: 10em;
    bottom: 0.938em;
    left: 0.938em;
    opacity: 1;
  }
}

@-webkit-keyframes circle3 {
  0% {
    width: 11.875em;
    height: 11.875em;
    bottom: 0;
    left: 0;
    border: 1em solid #ad6989;
    opacity: 0;
  }
  100% {
    width: 12em;
    height: 12em;
    bottom: -1px;
    left: -1px;
    border: 1px solid #ad6989;
    opacity: 1;
  }
}
@-moz-keyframes circle3 {
  0% {
    width: 11.875em;
    height: 11.875em;
    bottom: 0;
    left: 0;
    border: 1em solid #ad6989;
    opacity: 0;
  }
  100% {
    width: 12em;
    height: 12em;
    bottom: -1px;
    left: -1px;
    border: 1px solid #ad6989;
    opacity: 1;
  }
}
@-o-keyframes circle3 {
  0% {
    width: 11.875em;
    height: 11.875em;
    bottom: 0;
    left: 0;
    border: 1em solid #ad6989;
    opacity: 0;
  }
  100% {
    width: 12em;
    height: 12em;
    bottom: -1px;
    left: -1px;
    border: 1px solid #ad6989;
    opacity: 1;
  }
}
@keyframes circle3 {
  0% {
    width: 11.875em;
    height: 11.875em;
    bottom: 0;
    left: 0;
    border: 1em solid #ad6989;
    opacity: 0;
  }
  100% {
    width: 12em;
    height: 12em;
    bottom: -1px;
    left: -1px;
    border: 1px solid #ad6989;
    opacity: 1;
  }
}

@-webkit-keyframes dev_icon {
  0% {
    left: 35.26315%;
  }
  100% {
    left: 8.42105%;
  }
}
@-moz-keyframes dev_icon {
  0% {
    left: 35.26315%;
  }
  100% {
    left: 8.42105%;
  }
}
@-o-keyframes dev_icon {
  0% {
    left: 35.26315%;
  }
  100% {
    left: 8.42105%;
  }
}
@keyframes dev_icon {
  0% {
    left: 35.26315%;
  }
  100% {
    left: 8.42105%;
  }
}

@-webkit-keyframes profile_txt {
  0% {
    opacity: 0;
    left: 23%;
  }
  100% {
    opacity: 1;
    left: 35%;
  }
}
@-moz-keyframes profile_txt {
  0% {
    opacity: 0;
    left: 23%;
  }
  100% {
    opacity: 1;
    left: 35%;
  }
}
@-o-keyframes profile_txt {
  0% {
    opacity: 0;
    left: 23%;
  }
  100% {
    opacity: 1;
    left: 35%;
  }
}
@keyframes profile_txt {
  0% {
    opacity: 0;
    left: 23%;
  }
  100% {
    opacity: 1;
    left: 35%;
  }
}

@keyframes scaleDraw {
  /*定義關鍵幀、scaleDrew是需要繫結到選擇器的關鍵幀名稱*/
  0% {
    transform: scale(0); /*開始為原始大小*/
  }
  25% {
    transform: scale(0.25); /*放大0.25倍*/
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
