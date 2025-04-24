<template>
  <div class="task-item q-pa-md q-mb-sm">
    <div class="row items-center">
      <div class="col-grow">
        <div class="text-h6">{{ task.title }}</div>
        <div class="task-description">{{ task.description }}</div>
      </div>
      <div class="col-auto">
        <q-btn flat round color="primary" icon="edit" @click="$emit('edit', task)" />
        <q-btn flat round color="negative" icon="delete" @click="$emit('delete', task.id)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.task-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
}

.task-item:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.task-description {
  color: #666;
  font-size: 0.9rem;
}
</style>
