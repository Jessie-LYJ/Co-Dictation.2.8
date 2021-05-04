import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const includPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return includPush.call(this, location).catch(err => err)
}

const routes = [
  // 基本跳转界面
  {
    path: '/',
    component: () => import('../components/basic/Header.vue'),
    children: [
      { 
        path: '', 
        name: 'Home', 
        component: () => import('../views/Home.vue') 
      },
      { 
        path: 'profile', 
        component: () => import('../components/profile/components/profileSideBar.vue'),
        children: [
          {
            path: '',
            component: () => import('../components/profile/myinfo.vue')
          },
          {
            path: 'mycomments',
            name: 'mycomments',
            component: () => import('../components/profile/mycomments.vue')
          },
          {
            path: 'mypublished',
            name: 'mypublished',
            component: () => import('../components/profile/published.vue')
          },
          {
            path: 'mytasks',
            name: 'mytasks',
            component: () => import('../components/profile/mytasks.vue')
          },
          {
            path: 'mybadges',
            name: 'mybadges',
            component: () => import('../components/profile/mybadges.vue')
          },
          {
            path: 'mymistakes',
            name: 'mymistakes',
            component: () => import('../components/profile/mymistakes.vue')
          },
          {
            path: 'newtask',
            name: 'newtask',
            component: () => import('../components/profile/task.vue')
          },
          {
            path: 'addusers',
            name: 'addusers',
            component: () => import('../components/profile/addUsers.vue')
          },
          {
            path: 'resetpwd',
            name: 'resetpwd',
            component: () => import('../components/profile/resetPw.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dictation',
    name: 'Dictation',
    component: () => import('../components/Dictation.vue')
  },
  {
    path: '/leaderboards',
    name: 'Leaderboards',
    component: () => import('../components/leaderboards/Leaderboards.vue'),
    children: [
      {
        path: '',
        component: () => import('../components/leaderboards/coin_board.vue')
      },
      {
        path: 'coinboard',
        name: 'coinboard',
        component: () => import('../components/leaderboards/coin_board.vue')
      },
      {
        path: 'dictaboard',
        name: 'dictaboard',
        component: () => import('../components/leaderboards/dicta_board.vue')
      },
      {
        path: 'studyboard',
        name: 'studyboard',
        component: () => import('../components/leaderboards/study_board.vue')
      }
    ]
  },

  // 任务界面
  {
    path: '/diff/:diffId',
    name: 'diff',
    component: () => import('../components/diff_framework.vue'),
    children: [
      {
        path: '/diff/:diffId/main',
        name: 'main',
        component: () => import('../components/diff.vue')
      },
      {
        path: '/diff/:diffId/comment',
        name: 'comment',
        component: () => import('../components/comment.vue')
      },
      {
        path: '/diff/:diffId/reference',
        name: 'reference',
        component: () => import('../components/reference.vue')
      },
    ]
  },

  {
    path: '/diff/:diffId/scores',
    name: 'scores',
    component: () => import('../components/scores.vue')
  },
  {
    path: '/diff/:diffId/scoresStu',
    name: 'scoresStu',
    component: () => import('../components/scoresStu.vue')
  },
  
  //co-dictation后台管理系统
  {
    path: '/admin',
    name: 'adminLogin',
    component: () => import('../components/back/adminLogin')
  },
  {
    path: '/index',
    component: () => import('../components/back/layout'),
    beforeEnter: (to, from, next) => {
      const isToken = localStorage.elementToken ? true : false
      if (to.path == '/admin') {
        next()
      } else {
        isToken ? next() : next('/admin')
      }
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../components/back/home')
      },
      {
        path: '/videoEditor',
        name: 'videoEditor',
        component: () => import('../components/back/videoEditor')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('../components/back/video')
      },
      {
        path: '/tagEditor',
        name: 'tagEditor',
        component: () => import('../components/back/tagEditor')
      },
      {
        path: '/tag',
        name: 'tag',
        component: () => import('../components/back/tag')
      },
      {
        path: '/taskEditor',
        name: 'taskEditor',
        component: () => import('../components/back/taskEditor')
      },
      {
        path: '/task',
        name: 'task',
        component: () => import('../components/back/task')
      },
      {
        path: '/versionEditor',
        name: 'versionEditor',
        component: () => import('../components/back/versionEditor')
      },
      {
        path: '/version',
        name: 'version',
        component: () => import('../components/back/version')
      },
      {
        path: '/userEditor',
        name: 'userEditor',
        component: () => import('../components/back/userEditor')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('../components/back/user')
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
