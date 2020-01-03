<template>
  <div class="container" v-loading="loading">
    <div class="group">
      <div class="label">
        <label>{{ title }}</label>
      </div>
      <div class="details">
        <div class="permissions-box" v-for="(auth, moduleName) in allAuths" :key="moduleName">
          <el-checkbox-group v-model="auth_module_name">
            <div class="module-box">
              <el-checkbox
                @change="moduleCheck($event, auth, moduleName)"
                class="module"
                :label="moduleName"
                :indeterminate="halfAuths.includes(moduleName)"
              ></el-checkbox>
            </div>
          </el-checkbox-group>
          <ul class="permissions-ul">
            <li class="permissions-li" v-for="(item, key) in auth" :key="key">
              <el-checkbox
                :label="item.name"
                :value="auth_module_ids.indexOf(item.id) > -1"
                @change="singleCheck(item.id, auth, moduleName)"
              ></el-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Admin from '@/lin/models/admin'

export default {
  props: ['id', 'title'],
  data() {
    return {
      allAuths: {}, // 所有分组权限
      allAuthIds: [],
      // auths: [], // 拥有的分组权限
      auth_module_name: [], // 权限组 module name
      auth_module_ids: [], // 权限组 集合 id
      halfAuths: [], // 该分类下的权限没有全选中
      cacheFlag: true,
      loading: false,
    }
  },
  async created() {
    try {
      this.loading = true
      await this.getGroupAuths()
      this.loading = false
    } catch (e) {
      this.loading = false
      console.log(e)
    }
  },
  methods: {
    // 获取分组权限
    async getGroupAuths() {
      this.allAuths = await Admin.getAllAuths()
      // 通过判断有没有传入id，来判断当前页面是添加分组还是编辑分组
      if (this.id) {
        const res = await Admin.getOneGroup(this.id)
        let temp = []
        const cache = {}
        res.permissions.forEach(v => {
          this.auth_module_ids.push(v.id)
          temp.push(v.module)
          // 每个module拥有权限个数
          if (!cache[v.module]) {
            cache[v.module] = 1
          } else {
            cache[v.module]++
          }
        })
        temp = Array.from(new Set(temp))
        // 半选
        temp.forEach(item => {
          if (this.allAuths[item].length !== cache[item]) {
            this.halfAuths.push(item)
          }
        })
        this.auth_module_name = Array.from(new Set(temp))
      }
      this.$emit('getCacheAuthIds', this.auth_module_ids.slice())
      this.$emit('updateAuths', this.auth_module_ids)
      this.$emit('updateAllAuths', this.allAuths)
    },

    // 批量选中
    moduleCheck(checked, ids, moduleName) {
      const _ids = ids.map(item => item.id)
      if (checked) {
        this.auth_module_ids = Array.from(new Set(this.auth_module_ids.concat(_ids)))
        this.auth_module_name.push(moduleName)
        this.halfAuths = this.halfAuths.filter(v => v !== moduleName)
      } else {
        this.auth_module_ids = this.auth_module_ids.filter(v => !_ids.includes(v))
        this.auth_module_name = this.auth_module_name.filter(v => v !== moduleName)
      }
      this.$emit('updateAuths', this.auth_module_ids)
    },

    // 单选
    singleCheck(id, auth, moduleName) {
      const _ids = auth.map(item => item.id)
      let count = 0
      const index = this.auth_module_ids.indexOf(id)
      if (index === -1) {
        this.auth_module_ids.push(id)
      } else {
        this.auth_module_ids.splice(index, 1)
      }
      _ids.forEach(item => {
        if (this.auth_module_ids.indexOf(item) > -1) {
          count++
        }
        // 全选状态
        if (_ids.length === count) {
          this.auth_module_name.push(moduleName)
          this.halfAuths = this.halfAuths.filter(v => v !== moduleName)
        } else if (count === 0) {
          // 未选中状态
          this.auth_module_name = this.auth_module_name.filter(v => v !== moduleName)
          this.halfAuths = this.halfAuths.filter(v => v !== moduleName)
        } else {
          // 半选状态
          this.auth_module_name = this.auth_module_name.filter(v => v !== moduleName)
          this.halfAuths.push(moduleName)
        }
      })
      this.$emit('updateAuths', this.auth_module_ids)
    },
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
