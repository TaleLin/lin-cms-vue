// eslint-disable-next-line
const importAll = requireContext => requireContext.keys().forEach(requireContext)
try {
  // 导入所有插件
  importAll(require.context('../../../../node_modules/tinymce/plugins', true))
} catch (err) {
  console.log(err)
}
