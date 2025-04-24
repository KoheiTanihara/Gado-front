import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import TaskList from '../views/TaskList.vue'

const routes = [
  {
    path: '/',
    redirect: '/tasks'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TaskList,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  // 認証が必要なルートかチェック
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // ログイン状態をチェック
    if (!localStorage.getItem('token')) {
      // 未ログインの場合はログインページへリダイレクト
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // ログイン済みの場合は次へ
      next()
    }
  } else {
    // 認証不要のルートは直接アクセスOK
    next()
  }
})

export default router
