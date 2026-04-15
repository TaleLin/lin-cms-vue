<template>
  <PagePanel :title="editBookId ? '修改图书' : '新建图书'">
    <template v-if="editBookId" #actions>
      <span class="back" @click="back">
        <el-icon class="back__icon"><Back /></el-icon>
        返回
      </span>
    </template>

    <div v-loading="loading">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="book" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
            <el-form-item label="书名" prop="title">
              <el-input v-model="book.title" placeholder="请填写书名"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="book.author" placeholder="请填写作者"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-input v-model="book.image" placeholder="请填写封面地址"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入简介"
                v-model="book.summary"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm">保 存</el-button>
              <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </PagePanel>
</template>

<script setup>
import { Back } from '@element-plus/icons-vue'
import { onMounted, useTemplateRef } from 'vue'

import PagePanel from '@/component/base/page-panel.vue'

import { useBookForm } from './use-book-form'

defineOptions({
  name: 'BookModify',
})

const { editBookId } = defineProps({
  editBookId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['close'])
const form = useTemplateRef('form')
const { book, loadBook, loading, resetForm, rules, submitForm } = useBookForm({
  editBookId: () => editBookId,
  formRef: form,
  onSaved: ({ mode }) => {
    if (mode === 'edit') {
      emit('close')
    }
  },
})

function back() {
  emit('close')
}

onMounted(() => {
  void loadBook()
})
</script>

<style lang="scss" scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.back__icon {
  display: inline-flex;
  flex: 0 0 auto;
}

.submit :deep(.el-form-item__content) {
  justify-content: flex-start;
}
</style>
