import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import quasarUserOptions from './quasar-user-options'

// Quasarのスタイル
import 'quasar/src/css/index.sass'

// Axiosのデフォルト設定
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:8000'

const app = createApp(App)

// グローバルプロパティとしてaxiosを登録
app.config.globalProperties.$axios = axios

// Quasarを使用
app.use(Quasar, quasarUserOptions)

// Routerを使用
app.use(router)

app.mount('#app')
