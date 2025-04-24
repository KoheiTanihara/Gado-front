<template>
  <q-page class="flex flex-center">
    <q-card class="register-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">ユーザー登録</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.username"
            label="ユーザー名"
            :rules="[val => !!val || 'ユーザー名は必須です']"
            outlined
          />

          <q-input
            v-model="form.email"
            label="メールアドレス"
            type="email"
            :rules="[
              val => !!val || 'メールアドレスは必須です',
              val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || '有効なメールアドレスを入力してください'
            ]"
            outlined
          />

          <q-input
            v-model="form.password"
            label="パスワード"
            type="password"
            :rules="[
              val => !!val || 'パスワードは必須です',
              val => val.length >= 8 || 'パスワードは8文字以上必要です'
            ]"
            outlined
          />

          <q-input
            v-model="confirmPassword"
            label="パスワード（確認）"
            type="password"
            :rules="[
              val => !!val || 'パスワード（確認）は必須です',
              val => val === form.password || 'パスワードが一致しません'
            ]"
            outlined
          />

          <div>
            <q-btn
              type="submit"
              color="primary"
              label="登録"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <p>すでにアカウントをお持ちの方は <router-link to="/login">ログイン</router-link> してください</p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios'

// APIのベースURL
const API_URL = 'http://localhost:8000'

export default {
  name: 'RegisterPage',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      },
      confirmPassword: '',
      loading: false
    }
  },
  methods: {
    async onSubmit() {
      if (!this.form.username || !this.form.email || !this.form.password || !this.confirmPassword) return
      if (this.form.password !== this.confirmPassword) return

      try {
        this.loading = true
        
        // ユーザー登録APIを呼び出す
        await axios.post(`${API_URL}/auth/register`, this.form)
        
        // 登録成功メッセージ
        this.$q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'check_circle',
          message: 'ユーザー登録が完了しました'
        })
        
        // ログインページへ遷移
        this.$router.push('/login')
      } catch (error) {
        console.error('登録エラー:', error)
        
        let errorMessage = '登録に失敗しました'
        
        // エラーレスポンスがある場合はそのメッセージを表示
        if (error.response && error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail
        }
        
        // エラーメッセージ
        this.$q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: errorMessage
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
.register-card {
  width: 100%;
  max-width: 400px;
  padding: 0;
}
</style>
