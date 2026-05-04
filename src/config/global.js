// 后端返回 code 小于此值表示成功
const MAX_SUCCESS_CODE = 9998

// 向后兼容：保持 window 上的全局访问
window.MAX_SUCCESS_CODE = MAX_SUCCESS_CODE

export default MAX_SUCCESS_CODE
