import logModel from 'lin/model/log'
// import { searchLogKeyword } from 'lin/util/search'
import { onMounted, ref, reactive } from '@vue/composition-api'

export const init = (permissions, user) => {
  // init logic
  const loading = ref(false)
  let users = reactive([])
  let logs = reactive([])
  const initPage = async () => {
    try {
      loading.value = true
      if (user.value.admin || permissions.value.includes('查询日志记录的用户')) {
        users = await logModel.getLoggedUsers({})
      }
      const res = await logModel.getLogs({ page: 0 })
      logs = res.items
      loading.value = false
    } catch (err) {
      loading.value = false
      console.error(err.data)
    }
  }
  onMounted(async () => {
    await initPage()
  })
  return {
    users,
    logs,
    loading,
  }
}

export const a = 1
