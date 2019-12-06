<template>
  <div class="lin-container">
    <div class="lin-title">Dropdown 下拉菜单</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                <el-dropdown-item divided command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>触发对象</span></div>
        <el-row>
          <div>
            <el-row class="block-col-2">
              <el-col :span="12">
                <span class="demonstration">触发下拉菜单的按钮</span>
                <el-dropdown @command="handleCommand">
                  <el-button type="primary"> 更多菜单<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                    <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                    <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                    <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="12">
                <span class="demonstration">左边是功能按钮，右边是触发下拉菜单的按钮</span>
                <el-dropdown split-button type="primary" @click="handleClick" @command="handleCommand">
                  更多菜单
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                    <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                    <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                    <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ splitButton }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>触发方式</span></div>
        <el-row>
          <div>
            <el-row class="block-col-2">
              <el-col :span="12">
                <span class="demonstration">hover 激活</span>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-plus" command="黄金糕">黄金糕</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus" command="狮子头">狮子头</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus-outline" command="螺蛳粉">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-check" command="双皮奶">双皮奶</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-check-outline" command="蚵仔煎">蚵仔煎</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="12">
                <span class="demonstration">click 激活</span>
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-plus" command="黄金糕">黄金糕</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus" command="狮子头">狮子头</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus-outline" command="螺蛳粉">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-check" command="双皮奶">双皮奶</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-check-outline" command="蚵仔煎">蚵仔煎</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ trigger }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>菜单隐藏方式</span></div>
        <el-row>
          <div>
            <el-row class="block-col-2">
              <el-col :span="12">
                <span class="demonstration">点击菜单项后不隐藏</span>
                <el-dropdown :hide-on-click="false" @command="handleCommand">
                  <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                    <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                    <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                    <el-dropdown-item divided command="蚵仔煎">蚵仔煎</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="12">
                <span class="demonstration">点击菜单项后隐藏</span>
                <el-dropdown :hide-on-click="true" @command="handleCommand">
                  <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                    <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                    <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                    <el-dropdown-item divided command="蚵仔煎">蚵仔煎</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ hideOnClick }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>指令事件</span></div>
        <el-row>
          <div>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                <el-dropdown-item command="b">狮子头</el-dropdown-item>
                <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ handleCommandCode }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>不同尺寸</span></div>
        <el-row>
          <div>
            <el-dropdown split-button type="primary" @command="handleCommand">
              默认尺寸
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown size="medium" split-button type="primary" @command="handleCommand">
              中等尺寸
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown size="small" split-button type="primary" @command="handleCommand">
              小型尺寸
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
              超小尺寸
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ size }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  /* eslint-disable */
  name: 'LinCmsUiButton',
  components: {},
  data() {
    return {
      base: `     
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
            <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
            <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled >双皮奶</el-dropdown-item>
            <el-dropdown-item divided command="蚵仔煎">蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>`,
      splitButton: `
       <div>
        <el-row class="block-col-2">
          <el-col :span="12">
            <span class="demonstration">触发下拉菜单的按钮</span>
            <el-dropdown @command="handleCommand">
              <el-button type="primary">
                更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="12">
            <span class="demonstration">左边是功能按钮，右边是触发下拉菜单的按钮</span>
            <el-dropdown split-button type="primary" @click="handleClick" @command="handleCommand">
              更多菜单
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">双皮奶</el-dropdown-item>
                <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>`,
      trigger: `
        <div>
        <el-row class="block-col-2">
          <el-col :span="12">
            <span class="demonstration">hover 激活</span>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline" command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check" command="双皮奶">双皮奶</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-check-outline" command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="12">
            <span class="demonstration">click 激活</span>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="黄金糕">黄金糕</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="狮子头">狮子头</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline" command="螺蛳粉">螺蛳粉</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check" command="双皮奶">双皮奶</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-check-outline" command="蚵仔煎">蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>`,
      hideOnClick: `
        <div>
          <el-row class="block-col-2">
            <el-col :span="12">
              <span class="demonstration">点击菜单项后不隐藏</span>
              <el-dropdown :hide-on-click="false" @command="handleCommand">
                <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                  <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                  <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                  <el-dropdown-item disabled >双皮奶</el-dropdown-item>
                  <el-dropdown-item divided command="蚵仔煎">蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
             <el-col :span="12">
               <span class="demonstration">点击菜单项后隐藏</span>
              <el-dropdown :hide-on-click="true" @command="handleCommand">
                <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
                  <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
                  <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
                  <el-dropdown-item disabled >双皮奶</el-dropdown-item>
                  <el-dropdown-item divided command="蚵仔煎">蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
             </el-col>
          </el-row>
        </div>`,
      handleCommandCode: `
       <div>
         <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">黄金糕</el-dropdown-item>
              <el-dropdown-item command="b">狮子头</el-dropdown-item>
              <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
              <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
              <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>`,
      size: `
      <el-dropdown split-button type="primary">
        默认尺寸
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown size="medium" split-button type="primary">
        中等尺寸
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown size="small" split-button type="primary">
        小型尺寸
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown size="mini" split-button type="primary">
        超小尺寸
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>`,
    }
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    handleCommand(command) {
      this.$message('点击了 ' + command)
    },
    handleClick() {
      // eslint-disable-next-line
      alert('button click')
    },
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/container';
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
