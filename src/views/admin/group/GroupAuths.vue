<template>
  <div class="container" v-loading="loading">
    <div class="group">
      <div class="label">
        <label>{{title}}</label>
      </div>
      <div class="details">
        <div class="permissions-box" v-for="(auth,moduleName) in allAuths" :key="moduleName">
          <el-checkbox-group v-model="auths">
            <div class="module-box">
              <el-checkbox
                @change="moduleCheck($event, auth,moduleName)"
                class="module"
                :label="moduleName"
                :indeterminate="halfAuths.includes(moduleName)"></el-checkbox>
            </div>

            <ul class="permissions-ul">
              <li class="permissions-li" v-for="(item,key) in auth" :key="key">
                <el-checkbox :label="key | filterTitle(32)" @change="singleCheck($event, key, moduleName)"></el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from 'lin/utils/util'
import Admin from '@/lin/models/admin'

export default {
  props: ['id', 'title'],
  data() {
    return {
      allAuths: {}, // 所有分组权限
      auths: [], // 拥有的分组权限
      halfAuths: [], // 该分类下的权限没有全选中
      cacheFlag: true,
      loading: false,
    }
  },
  methods: {
    // 获取全部权限
    async getAllAuths() {
      this.allAuths = await Admin.getAllAuths()
    },
    // 获取分组权限
    async getGroupAuths() {
      this.auths = [] // 父组件 重置
      this.allAuths = await Admin.getAllAuths()
      // 通过判断有没有传入id，来判断当前页面是添加分组还是编辑分组
      if (this.id) {
        let res = await Admin.getOneGroup(this.id)
        // 获取分组所拥有的权限
        /* eslint-disable */
        res = JSON.parse(JSON.stringify(res)); // 去除__ob__
        for (let i = 0; i < res.auths.length; i++) {
          for (const key in res.auths[i]) {
            for (let j = 0; j < res.auths[i][key].length; j++) {
              this.auths.push(res.auths[i][key][j].auth);
            }
          }
        }
        this.$emit("updateCacheAuths", this.auths);
        // 检查module状态是否需要选中
        for (const key in this.allAuths) {
          this.initModuleCheck(key);
        }
      }
      this.$emit("updateAuths", this.auths);
      this.$emit("updateAllAuths", this.allAuths);
    },
    // 弹窗打开时，判断某一分类权限是否全部选中
    initModuleCheck(moduleName) {
      const currentModuleChildrenArr = Object.keys(this.allAuths[moduleName]);
      const intersect = Utils.getIntersect(
        currentModuleChildrenArr,
        this.auths
      );
      // 全选
      if (intersect.length === currentModuleChildrenArr.length) {
        this.auths.push(moduleName);
      }
      // 半选
      if (
        intersect.length > 0 &&
        intersect.length < currentModuleChildrenArr.length
      ) {
        this.halfAuths.push(moduleName);
      }
    },
    moduleCheck(checked, auth, moduleName) {
      const authArr = Object.keys(auth);
      if (checked) {
        if (this.halfAuths.indexOf(moduleName) > -1) {
          this.halfAuths.splice(this.halfAuths.indexOf(moduleName), 1);
        }
        this.auths.push(...authArr);
      } else {
        if (this.halfAuths.indexOf(moduleName) > -1) {
          this.halfAuths.splice(this.halfAuths.indexOf(moduleName), 1);
        }
        this.auths = this.auths.filter(x => authArr.indexOf(x) < 0);
      }
      this.$emit("updateAuths", this.auths);
    },
    singleCheck(checked, singleAuth, moduleName) {
      const currentModuleChildrenArr = Object.keys(this.allAuths[moduleName]);
      const intersect = Utils.getIntersect(
        currentModuleChildrenArr,
        this.auths
      );
      if (intersect.length === currentModuleChildrenArr.length) {
        if (this.halfAuths.indexOf(moduleName) > -1) {
          this.halfAuths.splice(this.halfAuths.indexOf(moduleName), 1);
        }
        this.auths.push(moduleName);
      } else if (
        intersect.length > 0 &&
        intersect.length < currentModuleChildrenArr.length
      ) {
        if (this.auths.indexOf(moduleName) > -1) {
          this.auths.splice(this.auths.indexOf(moduleName), 1);
        }
        this.halfAuths.push(moduleName);
      } else if (intersect.length === 0){
        if (this.halfAuths.indexOf(moduleName) > -1) {
          this.halfAuths.splice(this.halfAuths.indexOf(moduleName), 1);
        }
        if (this.auths.indexOf(moduleName) > -1) {
          this.auths.splice(this.auths.indexOf(moduleName), 1);
        }
      }
      this.halfAuths = Array.from(new Set(this.halfAuths));
      this.auths = Array.from(new Set(this.auths));
      this.$emit("updateAuths", this.auths);
    }
  },
  async created() {
    try {
      this.loading = true;
      await this.getGroupAuths();
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.log(e);
    }
  }
};
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
