<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">ログイン</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="username"
            label="ユーザー名"
            :rules="[val => !!val || 'ユーザー名は必須です']"
            outlined
          />

          <q-input
            v-model="password"
            label="パスワード"
            type="password"
            :rules="[val => !!val || 'パスワードは必須です']"
            outlined
          />

          <div>
            <q-btn
              type="submit"
              color="primary"
              label="ログイン"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <p>アカウントをお持ちでない方は <router-link to="/register">登録</router-link> してください</p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios'

// APIのベースURL
const API_URL = 'http://localhost:8000'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async onSubmit() {
      if (!this.username || !this.password) return

      try {
        this.loading = true
        
        // FormDataの形式でリクエスト（OAuth2の仕様に合わせる）
        const formData = new URLSearchParams()
        formData.append('username', this.username)
        formData.append('password', this.password)
        
        const response = await axios.post(`${API_URL}/auth/login`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        
        // トークンをローカルストレージに保存
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('username', this.username)
        
        // ログイン成功メッセージ
        this.$q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'check_circle',
          message: 'ログインしました'
        })
        
        // タスク一覧ページに遷移
        this.$router.push('/tasks')
      } catch (error) {
        console.error('ログインエラー:', error)
        
        // エラーメッセージを表示
        this.$q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: 'ログインに失敗しました。ユーザー名とパスワードを確認してください。'
        })
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    // すでにログイン済みの場合はタスク一覧へリダイレクト
    if (localStorage.getItem('token')) {
      this.$router.push('/tasks')
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 0;
}
</style>
