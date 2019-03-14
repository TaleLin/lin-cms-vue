<template>
  <div class="container">
    <div class="title">分组列表信息</div>
    <lin-table :tableColumn="tableColumn"
               :tableData="tableData"
               :operate="operate"
               @handleEdit="handleEdit"
               @handleDelete="handleDelete"
               @row-click="rowClick"
               v-loading="loading">
    </lin-table>
    <el-dialog :append-to-body="true"
               :visible.sync="dialogFormVisible"
               :before-close="handleClose">
      <div style="margin-top:-25px;">
        <el-tabs v-model="activeTab"
                 @tab-click="handleClick">
          <el-tab-pane label="修改信息"
                       name="修改信息"
                       style="margin-top:10px;">
            <el-form status-icon
                     v-if="dialogFormVisible"
                     ref="form"
                     label-width="120px"
                     :model="form"
                     label-position="labelPosition"
                     :rules="rules"
                     style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;">
              <el-form-item label="分组名称"
                            prop="name">
                <el-input clearable
                          v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="分组描述"
                            prop="info">
                <el-input clearable
                          v-model="form.info"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="配置权限"
                       name="配置权限"
                       style="margin-top:10px;">
            <group-auths v-if="dialogFormVisible"
                         :id="id"
                         ref="groupAuths"
                         @updateAuths="updateAuths"
                         @updateCacheAuths="updateCacheAuths"
                         @updateAllAuths="updateAllAuths"
                         style="margin-right:-30px;margin-left:-25px;margin-bottom:-10px;">
            </group-auths>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="padding-left:5px;">
        <el-button type="primary"
                   @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Utils from '@/lin/utils/util'
import Admin from '@/lin/models/admin'
import LinTable from '@/base/table/lin-table'
import GroupAuths from './GroupAuths'

export default {
  components: {
    LinTable,
    GroupAuths,
  },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 分组id
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 是否弹窗
      labelPosition: 'right', // 设置label位置
      form: { // 表单信息
        name: '',
        info: '',
      },
      allAuths: {}, // 所有分组权限
      auths: [], // 拥有的分组权限
      cacheAuths: [], // 缓存第一次打开弹窗的数据
      cacheForm: { // 缓存第一次的表单信息
        name: '',
        info: '',
      },
      loading: false,
      activeTab: '修改信息', // tab 标题
      rules: { // 表单验证规则
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
        ],
        info: [],
      },
    }
  },
  methods: {
    // 获取所有分组并传给table渲染
    async getAllGroups() {
      try {
        this.loading = true
        this.tableData = await Admin.getAllGroups()
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async confirmEdit() {
      // 修改分组信息
      if (this.activeTab === '修改信息') {
        if (this.form.name === '') {
          this.$message.warning('请将信息填写完整')
          return
        } else if (this.cacheForm.name !== this.form.name || this.cacheForm.info !== this.form.info) { // eslint-disable-line
          const res = await Admin.updateOneGroup(this.form.name, this.form.info, this.id)
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`)
            this.getAllGroups()
          }
        }
      } else {
        // 修改权限
        // 权限取子集(module)
        this.auths = this.auths.filter(item => Object.keys(this.allAuths).indexOf(item) < 0)
        this.cacheAuths = this.cacheAuths.filter(item => Object.keys(this.allAuths).indexOf(item) < 0) // eslint-disable-line
        // 判断是否更改了分组权限
        if (this.auths.sort().toString() !== this.cacheAuths.sort().toString()) {
          const addAuths = [...this.auths] // 增加的权限
          const deleteAuths = this.cacheAuths // 删除的权限
          let addRes = {}
          let delRes = {}
          // 判断增加的权限
          for (let i = 0; i < addAuths.length; i++) { // eslint-disable-line
            for (let j = 0; j < this.cacheAuths.length; j++) { // eslint-disable-line
              if (addAuths[i] === this.cacheAuths[j]) {
                addAuths.splice(i, 1)
              }
            }
          }
          // 判断删除的权限
          for (let i = 0; i < deleteAuths.length; i++) { // eslint-disable-line
            for (let j = 0; j < this.auths.length; j++) { // eslint-disable-line
              if (deleteAuths[i] === this.auths[j]) {
                deleteAuths.splice(i, 1)
              }
            }
          }
          if (addAuths.length > 0) {
            addRes = await Admin.dispatchAuths(this.id, addAuths)
          }
          if (deleteAuths.length > 0) {
            delRes = await Admin.removeAuths(this.id, deleteAuths)
          }
          if (addRes.error_code === 0 || delRes.error_code === 0) {
            this.$message.success('权限修改成功')
          }
        }
      }
      this.dialogFormVisible = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.groupAuths.getGroupAuths()
    },
    // 获取所拥有的权限并渲染  由子组件提供
    handleEdit(val) {
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单机 table row
        selectedData = val
      }
      this.id = selectedData.id
      this.form.name = selectedData.name
      this.form.info = selectedData.info
      this.cacheForm = { ...this.form }
      this.dialogFormVisible = true
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Admin.deleteOneGroup(val.row.id)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        if (res.error_code === 0) {
          await this.getAllGroups()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        } else {
          this.loading = false
          this.$message({
            type: 'error',
            message: `${res.msg}`,
          })
        }
      })
    },
    // 双击 table row
    rowClick(row) {
      this.handleEdit(row)
    },
    // 弹窗打开时，判断某一分类权限是否全部选中
    initModuleCheck(moduleName) {
      const currentModuleChildrenArr = Object.keys(this.allAuths[moduleName])
      const intersect = Utils.getIntersect(currentModuleChildrenArr, this.auths)
      if (intersect.length === currentModuleChildrenArr.length) {
        this.auths.push(moduleName)
      }
    },
    // 弹窗打开时，记录缓存所拥有的全部权限
    updateCacheAuths(cacheAuths) {
      this.cacheAuths = cacheAuths
    },
    // 获取拥有的权限
    updateAuths(auths) {
      this.auths = auths
    },
    // 获取所有权限
    updateAllAuths(allAuths) {
      this.allAuths = allAuths
    },
    // 弹框 右上角 X
    handleClose(done) {
      done()
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
  },
  async created() {
    await this.getAllGroups()
    this.tableColumn = [{ prop: 'name', label: '姓名' }, { prop: 'info', label: '信息' }] // 设置表头信息
    this.operate = [{ name: '编辑', func: 'handleEdit', type: 'edit' }, { name: '删除', func: 'handleDelete', type: 'del' }]
    // 监听分组是否成功
    this.eventBus.$on('addGroup', async (flag) => {
      if (flag === true) {
        await this.getAllGroups()
      }
    })
  },
}
</script>
<style lang="scss" scoped>
@import "~assets/styles/variable.scss";
.container {
  padding: 0 30px;
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
  }
}
</style>
