<template>
  <div class="container" v-loading="loading">
    <div class="group">
      <div class="label">
        <label>{{ title }}</label>
      </div>
      <div class="details">
        <div class="permissions-box" v-for="(permission, moduleName) in allPermissions" :key="moduleName">
          <el-checkbox-group v-model="permissionModuleNames">
            <div class="module-box">
              <el-checkbox
                @change="moduleCheck($event, permission, moduleName)"
                class="module"
                :label="moduleName"
                :indeterminate="halfPermissions.includes(moduleName)"
              ></el-checkbox>
            </div>
          </el-checkbox-group>
          <el-checkbox-group v-model="checkedPermissionNames">
            <ul class="permissions-ul">
              <li class="permissions-li" v-for="(item, key) in permission" :key="key">
                <el-checkbox
                  :label="item.name"
                  :value="permissionModuleIds.indexOf(item.id) > -1"
                  @change="singleCheck(item.id, permission, moduleName)"
                ></el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import AdminModel from '@/lin/model/admin'

export default {
  props: ['id', 'title'],
  setup(props, ctx) {
    const loading = ref(false)
    const allPermissions = ref({})
    const halfPermissions = ref([]) // 该分类下的权限没有全选中
    const permissionModuleIds = ref([]) // 权限组 集合 id
    const permissionModuleNames = ref([]) // 权限组 module name
    const checkedPermissionNames = ref([])

    /**
     * 初始化权限
     * 通过判断有没有传入id，来判断当前页面是添加分组还是编辑分组
     */
    const getGroupPermissions = async () => {
      allPermissions.value = await AdminModel.getAllPermissions()
      // 编辑分组权限
      if (props.id) {
        const res = await AdminModel.getOneGroup(props.id)
        let temp = []
        const cache = {}
        res.permissions.forEach(v => {
          permissionModuleIds.value.push(v.id)
          checkedPermissionNames.value.push(v.name)
          temp.push(v.module)
          // 每个module拥有权限个数
          if (!cache[v.module]) {
            cache[v.module] = 1
          } else {
            cache[v.module]++
          }
        })
        // 去重
        temp = Array.from(new Set(temp))
        // 半选
        temp.forEach(item => {
          if (allPermissions.value[item].length !== cache[item]) {
            halfPermissions.value.push(item)
          }
        })
        permissionModuleNames.value = Array.from(new Set(temp))
      }
      ctx.emit('getCacheAuthIds', permissionModuleIds.value.slice())
      ctx.emit('updatePermissions', permissionModuleIds.value)
      ctx.emit('updateAllPermissions', allPermissions.value)
    }

    onMounted(async () => {
      try {
        loading.value = true
        await getGroupPermissions()
        loading.value = false
      } catch (e) {
        loading.value = false
        console.error(e)
      }
    })

    /**
     * 权限批量选中（一个module）
     */
    const moduleCheck = (checked, ids, moduleName) => {
      const _ids = ids.map(item => item.id)
      const checkedNames = ids.map(item => item.name)
      if (checked) {
        permissionModuleIds.value = Array.from(new Set(permissionModuleIds.value.concat(_ids)))
        checkedPermissionNames.value = Array.from(new Set(checkedPermissionNames.value.concat(checkedNames)))
        if (!permissionModuleNames.value.includes(moduleName)) {
          permissionModuleNames.value.push(moduleName)
        }
      } else {
        permissionModuleIds.value = permissionModuleIds.value.filter(v => !_ids.includes(v))
        checkedPermissionNames.value = checkedPermissionNames.value.filter(v => !checkedNames.includes(v))
        permissionModuleNames.value = permissionModuleNames.value.filter(v => v !== moduleName)
      }
      halfPermissions.value = halfPermissions.value.filter(v => v !== moduleName)
      ctx.emit('updatePermissions', permissionModuleIds.value)
    }

    /**
     * 单选某一权限
     */
    const singleCheck = (id, permission, moduleName) => {
      const _ids = permission.map(item => item.id)
      let count = 0
      const index = permissionModuleIds.value.indexOf(id)
      if (index === -1) {
        permissionModuleIds.value.push(id)
      } else {
        permissionModuleIds.value.splice(index, 1)
      }
      _ids.forEach(item => {
        if (permissionModuleIds.value.indexOf(item) > -1) {
          count++
        }
        // 全选状态
        if (_ids.length === count) {
          permissionModuleNames.value.push(moduleName)
          halfPermissions.value = halfPermissions.value.filter(v => v !== moduleName)
        } else if (count === 0) {
          // 未选中状态
          permissionModuleNames.value = permissionModuleNames.value.filter(v => v !== moduleName)
          halfPermissions.value = halfPermissions.value.filter(v => v !== moduleName)
        } else {
          // 半选状态
          permissionModuleNames.value = permissionModuleNames.value.filter(v => v !== moduleName)
          if (!halfPermissions.value.includes(moduleName)) {
            halfPermissions.value.push(moduleName)
          }
        }
      })
      ctx.emit('updatePermissions', permissionModuleIds.value)
    }

    return {
      loading,
      moduleCheck,
      singleCheck,
      allPermissions,
      halfPermissions,
      getGroupPermissions,
      permissionModuleIds,
      permissionModuleNames,
      checkedPermissionNames,
    }
  },
}
</script>

<style lang="scss" scoped>
.group {
  margin-left: -95px;

  .label {
    margin-bottom: 10px;
    width: 70px;
    margin-left: 20px;
    float: left;
    font-weight: 500;

    label {
      color: #333333;
      font-size: 14px;
      font-weight: 500;
      height: 20px;
      line-height: 20px;
    }

    .necessary {
      color: #e46a76;
      font-size: 14px;
      font-weight: 500px;
      margin-right: 5px;
      font-size: 16px;
    }
  }

  .details {
    display: inline-block;
    width: calc(100% - 95px);
    margin-top: 5px;
    margin-left: 5px;

    .text-input {
      height: 40px;
      width: 780px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid #dee2e6;
      text-indent: 20px;

      &::placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #c4c9d2;
        text-indent: 20px;
      }
    }

    .permissions-box {
      .module {
        height: 20px;
        font-size: 13px;
        color: #45526b;
        line-height: 20px;
        margin-bottom: 10px;
      }

      .permissions-ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20px 20px 0;
        background: #f5f5f6;
        margin-bottom: 20px;

        .permissions-li {
          width: 150px;
          height: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          vertical-align: text-top;
          margin-right: 10px;

          .check {
            transform: translateY(2px);
            margin-right: 5px;
          }

          .permissions-name {
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #596c8e;
            line-height: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
