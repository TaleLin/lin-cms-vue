<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">图书列表</div>
      </div>
      <!-- 表格 -->
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
    <book-modify v-else @editClose="editClose" :editBookId="editBookId"></book-modify>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import bookModel from '@/model/book'
import BookModify from './book'

export default {
  components: {
    BookModify,
  },
  setup() {
    const books = ref([])
    const editBookId = ref(1)
    const loading = ref(false)
    const showEdit = ref(false)

    onMounted(() => {
      getBooks()
    })

    const getBooks = async () => {
      try {
        loading.value = true
        books.value = await bookModel.getBooks()
        loading.value = false
      } catch (error) {
        loading.value = false
        if (error.code === 10020) {
          books.value = []
        }
      }
    }

    const handleEdit = id => {
      showEdit.value = true
      editBookId.value = id
    }

    const handleDelete = id => {
      ElMessageBox.confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await bookModel.deleteBook(id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          getBooks()
          ElMessage.success(`${res.message}`)
        }
      })
    }

    const editClose = () => {
      showEdit.value = false
      getBooks()
    }

    const indexMethod = index => index + 1

    return {
      books,
      loading,
      showEdit,
      editClose,
      handleEdit,
      editBookId,
      indexMethod,
      handleDelete,
    }
  },
}
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

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
