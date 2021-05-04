import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import store from './store'
import axios from './axios'
import './quasar'

import moment from 'moment'//导入文件
Vue.prototype.$moment = moment;//赋值使用

Vue.prototype.$axios = axios
Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import VueCoreVideoPlayer from 'vue-core-video-player'
Vue.use(VueCoreVideoPlayer)

import VueAudio from 'vue-audio-better'
Vue.use(VueAudio)

import AudioVisual from 'vue-audio-visual'
Vue.use(AudioVisual)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
