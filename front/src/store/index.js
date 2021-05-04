import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 全局变量
    state: {
        isLogin: false,
        token: "",
        user: null
    },
    mutations: {
        // login(state, payload) {
        //     state.user = payload;
        // },
        userStatus(state, user) {
            if (user) {
                state.user = user;
                state.isLogin = true
            } else if (user == null) {
                //登出的时候，清空sessionStorage里的东西
                sessionStorage.setItem("userName", null);
                sessionStorage.setItem("elementToken", "");
                state.user = null;
                state.isLogin = false;
                state.token = "";
            }
        },
        userToken (state, userToken) { 
            if (userToken) {
              state.token = userToken;
            } else {
              state.token = null;
            }
          }
    },
    // 异步方法用actions
    // actions不能直接修改全局变量，需要调用commit方法来触发mutation中的方法
    actions: {
        setUser(context, user) {
            context.commit("userStatus", user)
        },
        setToken(context, userToken) {
            context.commit("userToken", userToken)
        },
    }
})

export default store