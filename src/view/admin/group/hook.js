import { ref, onMounted, reactive } from '@vue/composition-api'
import { MessageBox, Message } from 'element-ui'
import AdminModel from '@/lin/model/admin'

export const groupList = () => {
  const tableData = ref([]) // 表格数据
  const loading = ref(false)

  // 获取所有分组并传给table渲染
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

  // delete an element
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

export const editGroup = (ctx, getAllGroups) => {
  const group = reactive({
    // 表单信息
    name: '',
    info: '',
  })
  const rules = {
    // 表单验证规则
    name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
    info: [],
  }
  let cacheGroup = reactive({})
  const dialogFormVisible = ref(false) // 是否弹窗
  const id = ref(0) // 分组id

  // 获取所拥有的权限并渲染  由子组件提供
  const handleEdit = val => {
    let selectedData
    // 单击 编辑按键
    if (val.index >= 0) {
      selectedData = val.row
    } else {
      // 单机 table row
      selectedData = val
    }
    id.value = selectedData.id
    group.name = selectedData.name
    group.info = selectedData.info
    cacheGroup = { ...group }
    dialogFormVisible.value = true
  }

  const confirmEdit = async () => {
    // 修改分组信息
    if (group.name === '') {
      Message.warning('请将信息填写完整')
      return
    }
    if (cacheGroup.name !== group.name || cacheGroup.info !== group.info) {
      // eslint-disable-line
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
  const resetForm = formName => {
    ctx.refs[formName].resetFields()
  }

  // 双击 table row
  const rowClick = row => {
    handleEdit(row)
  }

  return {
    id,
    rules,
    group,
    rowClick,
    resetForm,
    cacheGroup,
    handleEdit,
    confirmEdit,
    handleClose,
    dialogFormVisible,
  }
}
