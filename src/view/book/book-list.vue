<template>
  <div>
    <PagePanel v-if="!showEdit" title="图书列表">
      <el-table :data="books" v-loading="loading">
        <el-table-column type="index" :index="indexMethod" label="序号" width="100"></el-table-column>
        <el-table-column prop="title" label="书名"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column label="操作" fixed="right" width="275">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-permission="{ permission: '删除图书', type: 'disabled' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </PagePanel>

    <!-- 编辑页面 -->
    <BookModify v-else :edit-book-id="editBookId" @close="editClose" />
  </div>
</template>

<script setup>
import PagePanel from '@/component/base/page-panel.vue'

import BookModify from './book'
import { useBookList } from './use-book-list'

defineOptions({
  name: 'BookList',
})

const indexMethod = index => index + 1
const { books, editBookId, editClose, handleDelete, handleEdit, loading, showEdit } = useBookList({})
</script>
