<template>
  <div class="lin-container">
    <div class="lin-title">Notification 通知</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div>
            <template>
              <el-button plain @click="open1"> 可自动关闭 </el-button>
              <el-button plain @click="open2"> 不会自动关闭 </el-button>
            </template>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>带有倾向性</span></div>
        <el-row>
          <div>
            <template>
              <el-button plain @click="open3"> 成功 </el-button>
              <el-button plain @click="open4"> 警告 </el-button>
              <el-button plain @click="open5"> 消息 </el-button>
              <el-button plain @click="open6"> 错误 </el-button>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ type }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>自定义弹出位置</span></div>
        <el-row>
          <div>
            <template>
              <el-button plain @click="open7"> 右上角 </el-button>
              <el-button plain @click="open8"> 右下角 </el-button>
              <el-button plain @click="open9"> 左下角 </el-button>
              <el-button plain @click="open10"> 左上角 </el-button>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ position }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>带有偏移</span></div>
        <el-row>
          <div>
            <template>
              <el-button plain @click="open"> 偏移的消息 </el-button>
            </template>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ offset }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>使用 HTML 片段</span></div>
        <el-row>
          <div>
            <template>
              <el-button plain @click="open11"> 使用 HTML 片段 </el-button>
            </template>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ dangerouslyUseHTMLString }}</div>
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
  /* eslint-disable */
  data() {
    return {
      base: `     
        <template>
          <el-button
            plain
            @click="open1">
            可自动关闭
          </el-button>
          <el-button
            plain
            @click="open2">
            不会自动关闭
            </el-button>
        </template>

        <script>
          export default {
            methods: {
              open1() {
                const h = this.$createElement;
                this.$notify({
                  title: '标题名称',
                  message: h('i', { style: 'color: teal'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
                });
              },

              open2() {
                this.$notify({
                  title: '提示',
                  message: '这是一条不会自动关闭的消息',
                  duration: 0
                });
              }
            }
          }
        <\/script>`,
      type: `
        <template>
          <el-button
            plain
            @click="open1">
            成功
          </el-button>
          <el-button
            plain
            @click="open2">
            警告
          </el-button>
          <el-button
            plain
            @click="open3">
            消息
          </el-button>
          <el-button
            plain
            @click="open4">
            错误
          </el-button>
        </template>
        <script>
          export default {
            methods: {
              open1() {
                this.$notify({
                  title: '成功',
                  message: '这是一条成功的提示消息',
                  type: 'success'
                });
              },

              open2() {
                this.$notify({
                  title: '警告',
                  message: '这是一条警告的提示消息',
                  type: 'warning'
                });
              },

              open3() {
                this.$notify.info({
                  title: '消息',
                  message: '这是一条消息的提示消息'
                });
              },

              open4() {
                this.$notify.error({
                  title: '错误',
                  message: '这是一条错误的提示消息'
                });
              }
            }
          }
        <\/script>`,
      position: `
        <template>
          <el-button
            plain
            @click="open1">
            右上角
          </el-button>
          <el-button
            plain
            @click="open2">
            右下角
          </el-button>
          <el-button
            plain
            @click="open3">
            左下角
          </el-button>
          <el-button
            plain
            @click="open4">
            左上角
          </el-button>
        </template>
        <script>
          export default {
            methods: {
              open1() {
                this.$notify({
                  title: '自定义位置',
                  message: '右上角弹出的消息'
                });
              },

              open2() {
                this.$notify({
                  title: '自定义位置',
                  message: '右下角弹出的消息',
                  position: 'bottom-right'
                });
              },

              open3() {
                this.$notify({
                  title: '自定义位置',
                  message: '左下角弹出的消息',
                  position: 'bottom-left'
                });
              },

              open4() {
                this.$notify({
                  title: '自定义位置',
                  message: '左上角弹出的消息',
                  position: 'top-left'
                });
              }
            }
          }
        <\/script>`,
      offset: `
        <template>
          <el-button
            plain
            @click="open">
            偏移的消息
          </el-button>
        </template>
        <script>
          export default {
            methods: {
              open() {
                this.$notify({
                  title: '偏移',
                  message: '这是一条带有偏移的提示消息',
                  offset: 100
                });
              }
            }
          }
        <\/script>`,
      dangerouslyUseHTMLString: `
        <template>
          <el-button
            plain
            @click="open">
            使用 HTML 片段
          </el-button>
        </template>
        <script>
          export default {
            methods: {
              open() {
                this.$notify({
                  title: 'HTML 片段',
                  dangerouslyUseHTMLString: true,
                  message: '<strong>这是 <i>HTML</i> 片段</strong>'
                });
              }
            }
          }
        <\/script>`,
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
    open() {
      this.$notify({
        title: '偏移',
        message: '这是一条带有偏移的提示消息',
        offset: 100,
      })
    },
    open1() {
      const h = this.$createElement
      this.$notify({
        title: '标题名称',
        message: h(
          'i',
          { style: 'color: #3963BC' },
          '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案',
        ),
      })
    },

    open2() {
      this.$notify({
        title: '提示',
        message: '这是一条不会自动关闭的消息',
        duration: 0,
      })
    },
    open3() {
      this.$notify({
        title: '成功',
        message: '这是一条成功的提示消息',
        type: 'success',
      })
    },

    open4() {
      this.$notify({
        title: '警告',
        message: '这是一条警告的提示消息',
        type: 'warning',
      })
    },

    open5() {
      this.$notify.info({
        title: '消息',
        message: '这是一条消息的提示消息',
      })
    },

    open6() {
      this.$notify.error({
        title: '错误',
        message: '这是一条错误的提示消息',
      })
    },
    open7() {
      this.$notify({
        title: '自定义位置',
        message: '右上角弹出的消息',
      })
    },

    open8() {
      this.$notify({
        title: '自定义位置',
        message: '右下角弹出的消息',
        position: 'bottom-right',
      })
    },

    open9() {
      this.$notify({
        title: '自定义位置',
        message: '左下角弹出的消息',
        position: 'bottom-left',
      })
    },

    open10() {
      this.$notify({
        title: '自定义位置',
        message: '左上角弹出的消息',
        position: 'top-left',
      })
    },
    open11() {
      this.$notify({
        title: 'HTML 片段',
        dangerouslyUseHTMLString: true,
        message: '<strong>这是 <i>HTML</i> 片段</strong>',
      })
    },
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/container';
</style>
