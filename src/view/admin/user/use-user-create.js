import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

import { getAllGroups } from '@/model/admin'
import { notifyRequestError } from '@/lin/util/request-error'

const defaultAdminModel = {
  getAllGroups,
}

export function useUserCreate({
  adminModel = defaultAdminModel,
  message = ElMessage,
  notifyError = notifyRequestError,
} = {}) {
  const allGroups = ref([])
  const loading = ref(false)

  async function loadGroups() {
    try {
      loading.value = true
      allGroups.value = await adminModel.getAllGroups()
    } catch (error) {
      notifyError(message, error, '获取分组列表失败')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void loadGroups()
  })

  return {
    allGroups,
    loading,
    loadGroups,
  }
}
