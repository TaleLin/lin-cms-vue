import { ref, onMounted } from 'vue'
import AdminModel from '@/lin/model/admin'

export const useUserList = () => {
  const allGroups = ref([])
  const pageCount = ref(10) // 每页10条数据
  const tableData = ref([])
  const groupId = ref(null)
  const loading = ref(false)
  const totalNum = ref(0) // 分组内的用户总数
  const currentPage = ref(1) // 默认获取第一页的数据

  /**
   * 获取管理员列表数据
   */
  const getAdminUsers = async () => {
    let res = {}
    try {
      loading.value = true
      res = await AdminModel.getAdminUsers({
        groupId: groupId.value,
        count: pageCount.value,
        page: currentPage.value - 1,
      })
      loading.value = false
      tableData.value = shuffleList(res.items)
      totalNum.value = res.total
    } catch (e) {
      loading.value = false
      console.error(e)
    }
  }

  /**
   * 获取所有分组数据
   */
  const getAllGroups = async () => {
    try {
      loading.value = true
      allGroups.value = await AdminModel.getAllGroups()
      loading.value = false
    } catch (e) {
      loading.value = false
      console.error(e)
    }
  }

  /**
   * 多分组用 '，' 分割展示
   */
  const shuffleList = users => {
    const list = []
    users.forEach(element => {
      element.groupNames = element.groups.map(item => item.name).join('，')
      list.push(element)
    })
    return list
  }

  onMounted(async () => {
    await getAdminUsers()
    getAllGroups()
  })

  return {
    groupId,
    loading,
    totalNum,
    allGroups,
    pageCount,
    tableData,
    currentPage,
    getAdminUsers,
  }
}

export const useFormData = (ctx, dialogFormVisible, getAdminUsers, currentPage, loading, info, password) => {
  const id = ref(null)
  const activeTab = ref('修改信息')

  /**
   * 监听子组件更新管理员信息是否成功
   * 如果更新了管理员信息，重新请求管理员列表
   */
  const handleInfoResult = flag => {
    dialogFormVisible.value = false
    if (flag === true) {
      getAdminUsers()
    }
  }

  /**
   * 根据分组查询管理员
   */
  const handleChange = async () => {
    currentPage.value = 1
    loading.value = true
    await getAdminUsers()
    loading.value = false
  }

  /**
   * 监听是否完成密码更新
   * @param {boolean} result 是否完成密码更新
   */
  const handlePasswordResult = result => {
    if (result === true) {
      dialogFormVisible.value = false
    }
  }

  /**
   * 翻页
   */
  const handleCurrentChange = async val => {
    currentPage.value = val
    await getAdminUsers()
  }

  /**
   * 提交表单信息，更新管理员信息
   */
  const confirmEdit = async () => {
    if (activeTab.value === '修改信息') {
      await info.value.submitForm()
    } else {
      await password.value.submitForm()
    }
  }

  /**
   * 关闭编辑弹窗
   */
  const handleClose = done => {
    dialogFormVisible.value = false
    password.value.resetForm()
    activeTab.value = '修改信息'
    done()
  }

  const handleClick = tab => {
    activeTab.value = tab.props.name
  }

  /**
   * 重置表单
   */
  const resetForm = () => {
    if (activeTab.value === '修改信息') {
      info.value.resetForm()
    } else {
      password.value.resetForm()
    }
  }

  return {
    id,
    activeTab,
    resetForm,
    confirmEdit,
    handleClose,
    handleClick,
    handleChange,
    handleInfoResult,
    handleCurrentChange,
    handlePasswordResult,
  }
}
