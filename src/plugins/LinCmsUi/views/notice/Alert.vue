<template>
  <div class="lin-container">
    <div class="lin-title">Alert 警告</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div>
            <el-alert title="成功提示的文案" type="success"> </el-alert>
            <el-alert title="消息提示的文案" type="info"> </el-alert>
            <el-alert title="警告提示的文案" type="warning"> </el-alert>
            <el-alert title="错误提示的文案" type="error"> </el-alert>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>主题</span></div>
        <el-row>
          <div>
            <template>
              <el-alert title="成功提示的文案" type="success" effect="dark"> </el-alert>
              <el-alert title="消息提示的文案" type="info" effect="dark"> </el-alert>
              <el-alert title="警告提示的文案" type="warning" effect="dark"> </el-alert>
              <el-alert title="错误提示的文案" type="error" effect="dark"> </el-alert>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ effect }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>自定义关闭按钮</span></div>
        <el-row>
          <div>
            <template>
              <el-alert title="不可关闭的 alert" type="success" :closable="false"> </el-alert>
              <el-alert title="自定义 close-text" type="info" close-text="知道了"> </el-alert>
              <el-alert title="设置了回调的 alert" type="warning" @close="hello"> </el-alert>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ close }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>带有 icon</span></div>
        <el-row>
          <div>
            <template>
              <el-alert title="成功提示的文案" type="success" show-icon> </el-alert>
              <el-alert title="消息提示的文案" type="info" show-icon> </el-alert>
              <el-alert title="警告提示的文案" type="warning" show-icon> </el-alert>
              <el-alert title="错误提示的文案" type="error" show-icon> </el-alert>
            </template>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ showIcon }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>文字居中</span></div>
        <el-row>
          <div>
            <template>
              <el-alert title="成功提示的文案" type="success" center show-icon> </el-alert>
              <el-alert title="消息提示的文案" type="info" center show-icon> </el-alert>
              <el-alert title="警告提示的文案" type="warning" center show-icon> </el-alert>
              <el-alert title="错误提示的文案" type="error" center show-icon> </el-alert>
            </template>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ center }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>带有辅助性文字介绍</span></div>
        <el-row>
          <div>
            <template>
              <el-alert
                title="带辅助性文字介绍"
                type="success"
                description="这是一句绕口令：黑灰化肥会挥发发灰黑化肥挥发；灰黑化肥会挥发发黑灰化肥发挥。 黑灰化肥会挥发发灰黑化肥黑灰挥发化为灰……"
              >
              </el-alert>
            </template>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ description }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>带有 icon 和辅助性文字介绍</span></div>
        <el-row>
          <div>
            <template>
              <el-alert
                title="成功提示的文案"
                type="success"
                description="文字说明文字说明文字说明文字说明文字说明文字说明"
                show-icon
              >
              </el-alert>
              <el-alert
                title="消息提示的文案"
                type="info"
                description="文字说明文字说明文字说明文字说明文字说明文字说明"
                show-icon
              >
              </el-alert>
              <el-alert
                title="警告提示的文案"
                type="warning"
                description="文字说明文字说明文字说明文字说明文字说明文字说明"
                show-icon
              >
              </el-alert>
              <el-alert
                title="错误提示的文案"
                type="error"
                description="文字说明文字说明文字说明文字说明文字说明文字说明"
                show-icon
              >
              </el-alert>
            </template>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ descriptionAndShowIcon }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinCmsUiButton',
  components: {},
  data() {
    return {
      text: '',
      base: `     
        <template>
          <el-alert
            title="成功提示的文案"
            type="success">
          </el-alert>
          <el-alert
            title="消息提示的文案"
            type="info">
          </el-alert>
          <el-alert
            title="警告提示的文案"
            type="warning">
          </el-alert>
          <el-alert
            title="错误提示的文案"
            type="error">
          </el-alert>
        </template>`,
      effect: `
        <template>
          <el-alert
            title="成功提示的文案"
            type="success"
            effect="dark">
          </el-alert>
          <el-alert
            title="消息提示的文案"
            type="info"
            effect="dark">
          </el-alert>
          <el-alert
            title="警告提示的文案"
            type="warning"
            effect="dark">
          </el-alert>
          <el-alert
            title="错误提示的文案"
            type="error"
            effect="dark">
          </el-alert>
        </template>`,
      /* eslint-disable */
      close: `
        <template>
          <el-alert
            title="不可关闭的 alert"
            type="success"
            :closable="false">
          </el-alert>
          <el-alert
            title="自定义 close-text"
            type="info"
            close-text="知道了">
          </el-alert>
          <el-alert
            title="设置了回调的 alert"
            type="warning"
            @close="hello">
          </el-alert>
        </template>
        <script>
          export default {
            methods: {
              hello() {
                alert('Hello World!');
              }
            }
          }
        <\/script>`,
      showIcon: `
        <template>
          <el-alert
            title="成功提示的文案"
            type="success"
            show-icon>
          </el-alert>
          <el-alert
            title="消息提示的文案"
            type="info"
            show-icon>
          </el-alert>
          <el-alert
            title="警告提示的文案"
            type="warning"
            show-icon>
          </el-alert>
          <el-alert
            title="错误提示的文案"
            type="error"
            show-icon>
          </el-alert>
        </template>`,
      center: `
        <template>
          <el-alert
            title="成功提示的文案"
            type="success"
            center
            show-icon>
          </el-alert>
          <el-alert
            title="消息提示的文案"
            type="info"
            center
            show-icon>
          </el-alert>
          <el-alert
            title="警告提示的文案"
            type="warning"
            center
            show-icon>
          </el-alert>
          <el-alert
            title="错误提示的文案"
            type="error"
            center
            show-icon>
          </el-alert>
        </template>`,
      description: `
        <template>
          <el-alert
            title="带辅助性文字介绍"
            type="success"
            description="这是一句绕口令：黑灰化肥会挥发发灰黑化肥挥发；灰黑化肥会挥发发黑灰化肥发挥。 黑灰化肥会挥发发灰黑化肥黑灰挥发化为灰……">
          </el-alert>
        </template>`,
      descriptionAndShowIcon: `
        <template>
          <el-alert
            title="成功提示的文案"
            type="success"
            description="文字说明文字说明文字说明文字说明文字说明文字说明"
            show-icon>
          </el-alert>
          <el-alert
            title="消息提示的文案"
            type="info"
            description="文字说明文字说明文字说明文字说明文字说明文字说明"
            show-icon>
          </el-alert>
          <el-alert
            title="警告提示的文案"
            type="warning"
            description="文字说明文字说明文字说明文字说明文字说明文字说明"
            show-icon>
          </el-alert>
          <el-alert
            title="错误提示的文案"
            type="error"
            description="文字说明文字说明文字说明文字说明文字说明文字说明"
            show-icon>
          </el-alert>
        </template>`,
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
    hello() {
      // eslint-disable-next-line
      alert('Hello World!')
    },
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/container.scss';
.el-alert + .el-alert {
  margin-top: 20px;
}
</style>
