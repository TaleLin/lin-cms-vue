import { ref, onMounted } from '@vue/composition-api'
import AdminModel from '@/lin/model/admin'

export const useUserList = () => {
  const groups = ref([])
  const pageCount = 10 // 每页10条数据
  const tableData = ref([])
  const groupID = ref(null)
  const loading = ref(false)
  const totalNum = ref(0) // 分组内的用户总数
  const currentPage = ref(1) // 默认获取第一页的数据

  /**
   * 获取管理员列表数据
   */
  const getAdminUsers = async () => {
    let res
    currentPage.value -= 1
    try {
      loading.value = true
      res = await AdminModel.getAdminUsers({ groupID: groupID.value, count: pageCount, page: currentPage.value })
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
      groups.value = await AdminModel.getAllGroups()
      loading.value = false
    } catch (e) {
      loading.value = false
      console.error(e)
    }
  }

  /**
   * 多分组用 ',' 分割展示
   */
  const shuffleList = users => {
    const list = []
    users.forEach(element => {
      const userGroups = []
      element.groups.forEach(item => {
        userGroups.push(item.name)
      })
      element.groupNames = userGroups.join(',')
      list.push(element)
    })
    return list
  }

  onMounted(async () => {
    await getAdminUsers()
    getAllGroups()
  })

  return {
    groups,
    groupID,
    loading,
    totalNum,
    tableData,
    currentPage,
    getAdminUsers,
  }
}

export const a = 1
