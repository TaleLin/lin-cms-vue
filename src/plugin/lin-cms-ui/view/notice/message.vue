<template>
  <div class="lin-container">
    <div class="lin-title">Message 消息提示</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div>
            <template>
              <el-button :plain="true" @click="open">打开消息提示</el-button>
              <el-button :plain="true" @click="openVn">VNode</el-button>
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
        <div slot="header"><span>不同状态</span></div>
        <el-row>
          <div>
            <template>
              <el-button :plain="true" @click="open2">成功</el-button>
              <el-button :plain="true" @click="open3">警告</el-button>
              <el-button :plain="true" @click="open1">消息</el-button>
              <el-button :plain="true" @click="open4">错误</el-button>
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
        <div slot="header"><span>可关闭</span></div>
        <el-row>
          <div>
            <template>
              <el-button :plain="true" @click="open5">消息</el-button>
              <el-button :plain="true" @click="open6">成功</el-button>
              <el-button :plain="true" @click="open7">警告</el-button>
              <el-button :plain="true" @click="open8">错误</el-button>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ showClose }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>文字居中</span></div>
        <el-row>
          <div>
            <template>
              <el-button :plain="true" @click="openCenter">文字居中</el-button>
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
        <div slot="header"><span>使用 HTML 片段</span></div>
        <el-row>
          <div>
            <template>
              <el-button :plain="true" @click="openHTML">使用 HTML 片段</el-button>
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
  data() {
    return {
      /* eslint-disable */
      base: `     
        <template>
          <el-button :plain="true" @click="open">打开消息提示</el-button>
          <el-button :plain="true" @click="openVn">VNode</el-button>
        </template>

        <script>
          export default {
            methods: {
              open() {
                this.$message('这是一条消息提示')
              },

              openVn() {
                const h = this.$createElement
                this.$message({
                  message: h('p', null, [
                    h('span', null, '内容可以是 '),
                    h('i', { style: 'color: teal' }, 'VNode')
                  ])
                })
              }
            }
          }
        <\/script>`,
      type: `
      <template>
        <el-button :plain="true" @click="open2">成功</el-button>
        <el-button :plain="true" @click="open3">警告</el-button>
        <el-button :plain="true" @click="open1">消息</el-button>
        <el-button :plain="true" @click="open4">错误</el-button>
      </template>

      <script>
        export default {
          methods: {
            open1() {
              this.$message('这是一条消息提示')
            },
            open2() {
              this.$message({
                message: '恭喜你，这是一条成功消息',
                type: 'success'
              })
            },

            open3() {
              this.$message({
                message: '警告哦，这是一条警告消息',
                type: 'warning'
              });
            },

            open4() {
              this.$message.error('错了哦，这是一条错误消息');
            }
          }
        }
      <\/script>`,
      showClose: `
        <template>
          <el-button :plain="true" @click="open1">消息</el-button>
          <el-button :plain="true" @click="open2">成功</el-button>
          <el-button :plain="true" @click="open3">警告</el-button>
          <el-button :plain="true" @click="open4">错误</el-button>
        </template>

        <script>
          export default {
            methods: {
              open1() {
                this.$message({
                  showClose: true,
                  message: '这是一条消息提示'
                });
              },

              open2() {
                this.$message({
                  showClose: true,
                  message: '恭喜你，这是一条成功消息',
                  type: 'success'
                });
              },

              open3() {
                this.$message({
                  showClose: true,
                  message: '警告哦，这是一条警告消息',
                  type: 'warning'
                });
              },

              open4() {
                this.$message({
                  showClose: true,
                  message: '错了哦，这是一条错误消息',
                  type: 'error'
                });
              }
            }
          }
        <\/script>`,
      center: `
        <template>
          <el-button :plain="true" @click="openCenter">文字居中</el-button>
        </template>

        <script>
          export default {
            methods: {
              openCenter() {
                this.$message({
                  message: '居中的文字',
                  center: true
                });
              }
            }
          }
        <\/script>
       `,
      dangerouslyUseHTMLString: `
        <template>
          <el-button :plain="true" @click="openHTML">使用 HTML 片段</el-button>
        </template>

        <script>
          export default {
            methods: {
              openHTML() {
                this.$message({
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
    openHTML() {
      this.$message({
        dangerouslyUseHTMLString: true,
        message: '<strong>这是 <i>HTML</i> 片段</strong>',
      })
    },
    openCenter() {
      this.$message({
        message: '居中的文字',
        center: true,
      })
    },
    open() {
      this.$message('这是一条消息提示')
    },
    openVn() {
      const h = this.$createElement
      this.$message({
        message: h('p', null, [
          h('span', { style: 'color: #3963BC' }, '内容可以是 '),
          h('i', { style: 'color: #3963BC' }, 'VNode'),
        ]),
      })
    },
    open1() {
      this.$message('这是一条消息提示')
    },
    open2() {
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'success',
      })
    },

    open3() {
      this.$message({
        message: '警告哦，这是一条警告消息',
        type: 'warning',
      })
    },

    open4() {
      this.$message.error('错了哦，这是一条错误消息')
    },
    open5() {
      this.$message({
        showClose: true,
        message: '这是一条消息提示',
      })
    },

    open6() {
      this.$message({
        showClose: true,
        message: '恭喜你，这是一条成功消息',
        type: 'success',
      })
    },

    open7() {
      this.$message({
        showClose: true,
        message: '警告哦，这是一条警告消息',
        type: 'warning',
      })
    },

    open8() {
      this.$message({
        showClose: true,
        message: '错了哦，这是一条错误消息',
        type: 'error',
      })
    },
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/container.scss';
</style>
