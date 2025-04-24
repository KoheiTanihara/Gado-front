<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h4 q-mb-md">タスク一覧</div>
      
      <!-- タスク追加フォーム -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">新しいタスク</div>
          <q-form @submit="addTask" class="q-gutter-md">
            <q-input
              v-model="newTask.title"
              label="タスク名"
              :rules="[val => !!val || 'タスク名は必須です']"
              outlined
            />
            <q-input
              v-model="newTask.description"
              label="説明"
              type="textarea"
              outlined
            />
            <q-btn
              type="submit"
              color="primary"
              label="タスクを追加"
              :loading="loading"
            />
          </q-form>
        </q-card-section>
      </q-card>

      <!-- ローディングインジケーター -->
      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="primary" size="3em" />
        <div class="text-subtitle1 q-mt-md">タスクを読み込み中...</div>
      </div>

      <!-- タスク一覧 -->
      <div v-else>
        <div v-if="tasks.length === 0" class="text-center q-pa-xl">
          <q-icon name="task_alt" size="5rem" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">タスクがありません</div>
        </div>
        <div v-else>
          <transition-group name="list" tag="div">
            <task-item
              v-for="task in tasks"
              :key="task.id"
              :task="task"
              @edit="editTask"
              @delete="deleteTask"
            />
          </transition-group>
        </div>
      </div>
    </div>

    <!-- タスク編集ダイアログ -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">タスクを編集</div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="editingTask">
          <q-form @submit="updateTask" class="q-gutter-md">
            <q-input
              v-model="editingTask.title"
              label="タスク名"
              :rules="[val => !!val || 'タスク名は必須です']"
              outlined
            />
            <q-input
              v-model="editingTask.description"
              label="説明"
              type="textarea"
              outlined
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="キャンセル" color="primary" v-close-popup />
          <q-btn flat label="更新" color="primary" @click="updateTask" :loading="loading" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import TaskItem from '../components/TaskItem.vue'
import axios from 'axios'

// APIのベースURL
const API_URL = 'http://localhost:8000'

export default {
  name: 'TaskList',
  components: {
    TaskItem
  },
  data() {
    return {
      tasks: [],
      loading: false,
      newTask: {
        title: '',
        description: ''
      },
      editDialog: false,
      editingTask: null
    }
  },
  methods: {
    // タスク一覧を取得
    async fetchTasks() {
      try {
        this.loading = true
        // ローカルストレージからトークンを取得
        const token = localStorage.getItem('token')
        
        if (!token) {
          // トークンがない場合はログインページへリダイレクト
          this.$router.push('/login')
          return
        }

        const response = await axios.get(`${API_URL}/tasks/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        // APIの結果を設定
        this.tasks = response.data
      } catch (error) {
        console.error('タスク取得エラー:', error)
        if (error.response && error.response.status === 401) {
          // 認証エラーの場合はログインページへリダイレクト
          this.$router.push('/login')
        }
        // エラーメッセージを表示
        this.$q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: 'タスクの取得に失敗しました'
        })
      } finally {
        this.loading = false
      }
    },

    // 新しいタスクを追加
    async addTask() {
      if (!this.newTask.title) return

      try {
        this.loading = true
        const token = localStorage.getItem('token')
        
        await axios.post(`${API_URL}/tasks/`, this.newTask, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        // タスク追加成功のメッセージ
        this.$q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'check_circle',
          message: 'タスクを追加しました'
        })
        
        // フォームをリセット
        this.newTask = {
          title: '',
          description: ''
        }
        
        // タスク一覧を再取得
        await this.fetchTasks()
      } catch (error) {
        console.error('タスク追加エラー:', error)
        this.$q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: 'タスクの追加に失敗しました'
        })
      } finally {
        this.loading = false
      }
    },

    // タスク編集ダイアログを表示
    editTask(task) {
      this.editingTask = { ...task }
      this.editDialog = true
    },

    // タスクを更新
    async updateTask() {
      if (!this.editingTask || !this.editingTask.title) return

      try {
        this.loading = true
        const token = localStorage.getItem('token')
        
        const updateData = {
          title: this.editingTask.title,
          description: this.editingTask.description
        }

        await axios.put(`${API_URL}/tasks/${this.editingTask.id}`, updateData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        this.$q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'check_circle',
          message: 'タスクを更新しました'
        })
        
        // ダイアログを閉じる
        this.editDialog = false
        this.editingTask = null
        
        // タスク一覧を再取得
        await this.fetchTasks()
      } catch (error) {
        console.error('タスク更新エラー:', error)
        this.$q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: 'タスクの更新に失敗しました'
        })
      } finally {
        this.loading = false
      }
    },

    // タスクを削除
    async deleteTask(id) {
      // 削除確認
      this.$q.dialog({
        title: '確認',
        message: 'このタスクを削除してもよろしいですか？',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          this.loading = true
          const token = localStorage.getItem('token')
          
          await axios.delete(`${API_URL}/tasks/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          this.$q.notify({
            color: 'positive',
            textColor: 'white',
            icon: 'check_circle',
            message: 'タスクを削除しました'
          })
          
          // タスク一覧を再取得
          await this.fetchTasks()
        } catch (error) {
          console.error('タスク削除エラー:', error)
          this.$q.notify({
            color: 'negative',
            textColor: 'white',
            icon: 'error',
            message: 'タスクの削除に失敗しました'
          })
        } finally {
          this.loading = false
        }
      })
    }
  },
  mounted() {
    // コンポーネントマウント時にタスク一覧を取得
    this.fetchTasks()
  }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
