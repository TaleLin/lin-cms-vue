<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">图书列表</div></div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
      ></lin-table>
    </div>

    <!-- 编辑页面 -->
    <book-modify v-else @editClose="editClose" :editBookID="editBookID"></book-modify>
  </div>
</template>

<script>
import { reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import bookModel from '@/model/book'
import LinTable from '@/component/base/table/lin-table'
import BookModify from './book-modify'

export default {
  components: {
    LinTable,
    BookModify,
  },
  setup() {
    const bookList = reactive({
      tableColumn: [
        { prop: 'title', label: '书名' },
        { prop: 'author', label: '作者' },
      ],
      operate: [
        { name: '编辑', func: 'handleEdit', type: 'primary' },
        {
          name: '删除',
          func: 'handleDelete',
          type: 'danger',
          permission: '删除图书',
        },
      ],
      tableData: [],
      loading: false,
    })

    const getBooks = async () => {
      try {
        bookList.loading = true
        const books = await bookModel.getBooks()
        bookList.loading = false
        bookList.tableData = books
      } catch (error) {
        bookList.loading = false
        if (error.code === 10020) {
          bookList.tableData = []
        }
      }
    }

    onMounted(() => {
      getBooks()
    })

    const showEdit = ref(false)
    const editBookID = ref(1)

    const handleEdit = val => {
      showEdit.value = true
      editBookID.value = val.row.id
    }

    const handleDelete = val => {
      ElMessageBox.confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await bookModel.delectBook(val.row.id)
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

    return {
      ...toRefs(bookList),
      showEdit,
      editBookID,
      editClose,
      handleEdit,
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
