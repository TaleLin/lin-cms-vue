<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">图书列表</div>
      </div>
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
    </div>

    <!-- 编辑页面 -->
    <BookModify v-else :edit-book-id="editBookId" @close="editClose" />
  </div>
</template>

<script setup>
import BookModify from './book'
import { getBookIndex } from '@/view/book/book-helpers'
import { useBookList } from './use-book-list'

defineOptions({
  name: 'BookList',
})

const indexMethod = getBookIndex
const { books, editBookId, editClose, handleDelete, handleEdit, loading, showEdit } = useBookList({})
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
