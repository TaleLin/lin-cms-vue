<template>
  <div v-loading="loading" class="container">
    <div class="group" :class="{ 'group--without-label': !title }">
      <div v-if="title" class="label">
        <label>{{ title }}</label>
      </div>
      <div class="details">
        <div v-for="(permission, moduleName) in allPermissions" :key="moduleName" class="permissions-box">
          <el-checkbox-group v-model="permissionModuleNames">
            <el-checkbox
              :indeterminate="halfPermissions.includes(moduleName)"
              :value="moduleName"
              class="module"
              @change="moduleCheck($event, permission, moduleName)"
            >
              {{ moduleName }}
            </el-checkbox>
          </el-checkbox-group>

          <el-checkbox-group v-model="checkedPermissionNames">
            <ul class="permissions-ul">
              <li v-for="item in permission" :key="item.id" class="permissions-li">
                <el-checkbox :value="item.name" @change="singleCheck($event, item, permission, moduleName)">
                  {{ item.name }}
                </el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGroupPermissions } from './use-group-permissions'

const { id, title } = defineProps({
  id: {
    type: [Number, String],
    default: undefined,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['loaded'])
const selectedIds = defineModel('selectedIds', {
  type: Array,
  default: () => [],
})
const {
  allPermissions,
  checkedPermissionNames,
  getGroupPermissions,
  halfPermissions,
  loading,
  moduleCheck,
  permissionModuleNames,
  singleCheck,
} = useGroupPermissions(() => id, {
  onLoaded: payload => {
    emit('loaded', payload)
  },
  syncSelectedIds: nextSelectedIds => {
    selectedIds.value = nextSelectedIds
  },
})

defineExpose({
  getGroupPermissions,
})
</script>

<style lang="scss" scoped>
.group {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  column-gap: 20px;
  align-items: flex-start;

  &.group--without-label {
    grid-template-columns: minmax(0, 1fr);
  }

  .label {
    margin-top: 5px;

    label {
      color: #333;
      font-size: 14px;
      font-weight: 500;
      height: 20px;
      line-height: 20px;
    }
  }

  .details {
    margin-top: 5px;

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
        }
      }
    }
  }
}
</style>
