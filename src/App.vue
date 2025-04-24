<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-toolbar-title>
          Ptodo - タスク管理アプリ
        </q-toolbar-title>
        
        <div v-if="isLoggedIn">
          <q-btn flat @click="logout">
            ログアウト
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
    
    const isLoggedIn = computed(() => {
      return !!localStorage.getItem('token')
    })
    
    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      router.push('/login')
    }
    
    return {
      isLoggedIn,
      logout
    }
  }
})
</script>

<style>
/* グローバルスタイルを設定 */
body {
  font-family: 'Roboto', sans-serif;
}

.q-page-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}
</style>
