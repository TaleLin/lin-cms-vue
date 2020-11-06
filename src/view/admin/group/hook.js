import { ref, onMounted, reactive } from 'vue'
import { MessageBox, Message } from 'element-plus'
import AdminModel from '@/lin/model/admin'

export const useGroupList = () => {
  const tableData = ref([]) // 表格数据
  const loading = ref(false)

  /**
   * 获取所有分组并传给table渲染
   */
  const getAllGroups = async () => {
    try {
      loading.value = true
      tableData.value = await AdminModel.getAllGroups()
      loading.value = false
    } catch (e) {
      loading.value = false
      console.error(e)
    }
  }

  /**
   * 删除某项数据
   * @param {object} val 选中的一行数据
   */
  const handleDelete = val => {
    let res
    MessageBox.confirm('此操作将永久删除该分组, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      try {
        loading.value = true
        res = await AdminModel.deleteOneGroup(val.row.id)
      } catch (e) {
        loading.value = false
        console.log(e)
      }
      if (res.code < window.MAX_SUCCESS_CODE) {
        await getAllGroups()
        Message.message({
          type: 'success',
          message: `${res.message}`,
        })
      } else {
        loading.value = false
        Message.message({
          type: 'error',
          message: `${res.message}`,
        })
      }
    })
  }

  onMounted(async () => {
    await getAllGroups()
  })

  return {
    tableData,
    loading,
    handleDelete,
    getAllGroups,
  }
}

export const useEditGroup = (ctx, getAllGroups) => {
  let cacheGroup
  const id = ref(0) // 分组id
  const group = reactive({ name: '', info: '' })
  const dialogFormVisible = ref(false) // 是否弹窗
  const rules = {
    // 表单验证规则
    name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
    info: [],
  }

  /**
   * 获取所拥有的权限并渲染  由子组件提供
   * @param {*} val 选中的某行数据
   */
  const handleEdit = val => {
    id.value = val.row.id
    group.name = val.row.name
    group.info = val.row.info
    cacheGroup = { ...group }
    dialogFormVisible.value = true
  }

  /**
   * 修改分组信息
   */
  const confirmEdit = async () => {
    if (group.name === '') {
      Message.warning('请将信息填写完整')
      return
    }
    if (cacheGroup.name !== group.name || cacheGroup.info !== group.info) {
      const res = await AdminModel.updateOneGroup(group.name, group.info, id.value)
      if (res.code < window.MAX_SUCCESS_CODE) {
        Message.success(`${res.message}`)
        getAllGroups()
      }
    }
    dialogFormVisible.value = false
  }

  const handleClose = done => {
    done()
  }
  const rowClick = row => {
    handleEdit(row)
  }
  const resetForm = formName => {
    ctx.refs[formName].resetFields()
  }

  return {
    id,
    rules,
    group,
    rowClick,
    resetForm,
    handleEdit,
    confirmEdit,
    handleClose,
    dialogFormVisible,
  }
}
