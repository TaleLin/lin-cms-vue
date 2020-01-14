<template>
  <div class="lin-container">
    <div class="lin-title">Tag 标签</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div>
            <el-tag>标签一</el-tag>
            <el-tag type="success">标签二</el-tag>
            <el-tag type="info">标签三</el-tag>
            <el-tag type="warning">标签四</el-tag>
            <el-tag type="danger">标签五</el-tag>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>可移除标签</span></div>
        <el-row>
          <div>
            <el-tag v-for="tag in tags" :key="tag.name" closable @close="handleCloseTag(tag)" :type="tag.type">
              {{ tag.name }}
            </el-tag>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ closable }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>动态编辑标签</span></div>
        <el-row>
          <div>
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-model="inputValue"
              v-if="inputVisible"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <i v-else class="el-icon-circle-plus button-new-tag" @click="showInput"></i>
            <!-- <el-button  class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button> -->
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ dynamic }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>不同尺寸</span></div>
        <el-row>
          <div>
            <el-tag closable>默认标签</el-tag>
            <el-tag size="medium" closable>中等标签</el-tag>
            <el-tag size="small" closable>小型标签</el-tag>
            <el-tag size="mini" closable>超小标签</el-tag>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ size }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>不同主题,通过设置effect属性来改变主题，默认为 light</span></div>
        <el-row>
          <div class="block">
            <span class="demonstration">Dark主题</span>
            <div class="tag-group">
              <el-tag v-for="item in items" :key="item.label" :type="item.type" effect="dark">
                {{ item.label }}
              </el-tag>
            </div>
          </div>
          <div class="block">
            <span class="demonstration">Plain主题</span>
            <div class="tag-group">
              <el-tag v-for="item in items" :key="item.label" :type="item.type" effect="plain">
                {{ item.label }}
              </el-tag>
            </div>
          </div>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ theme }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      items: [
        { type: '', label: '标签一' },
        { type: 'success', label: '标签二' },
        { type: 'info', label: '标签三' },
        { type: 'danger', label: '标签四' },
        { type: 'warning', label: '标签五' },
      ],
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' },
      ],
      text: '',
      /* eslint-disable */
      base: `     
        <el-tag>标签一</el-tag>
        <el-tag type="success">标签二</el-tag>
        <el-tag type="info">标签三</el-tag>
        <el-tag type="warning">标签四</el-tag>
        <el-tag type="danger">标签五</el-tag>`,
      closable: `
       <el-tag
        v-for="tag in tags"
        :key="tag.name"
        closable
        @close="handleCloseTag(tag)"
        :type="tag.type">
        {{tag.name}}
      </el-tag>

      <script>
        export default {
          data() {
            return {
              tags: [
                { name: '标签一', type: '' },
                { name: '标签二', type: 'success' },
                { name: '标签三', type: 'info' },
                { name: '标签四', type: 'warning' },
                { name: '标签五', type: 'danger' }
              ]
            };
          methods: {
            handleCloseTag(tag) {
              this.tags.splice(this.tags.indexOf(tag), 1);
            },
          }
        }
      <\/script>`,
      dynamic: `
           <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

          <style>
            .el-tag + .el-tag {
              margin-left: 10px;
            }
            .button-new-tag {
              margin-left: 10px;
              height: 32px;
              line-height: 30px;
              padding-top: 0;
              padding-bottom: 0;
            }
            .input-new-tag {
              width: 90px;
              margin-left: 10px;
              vertical-align: bottom;
            }
            .input-new-tag /deep/ .el-input__inner {
              height: 24px;
            }
          </style>

          <script>
            export default {
              data() {
                return {
                  dynamicTags: ['标签一', '标签二', '标签三'],
                  inputVisible: false,
                  inputValue: ''
                };
              },
              methods: {
                handleClose(tag) {
                  this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                },

                showInput() {
                  this.inputVisible = true;
                  this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                  });
                },

                handleInputConfirm() {
                  let inputValue = this.inputValue;
                  if (inputValue) {
                    this.dynamicTags.push(inputValue);
                  }
                  this.inputVisible = false;
                  this.inputValue = '';
                }
              }
            }
          <\/script>`,
      size: `
            <el-tag closable>默认标签</el-tag>
            <el-tag size="medium" closable>中等标签</el-tag>
            <el-tag size="small" closable>小型标签</el-tag>
            <el-tag size="mini" closable>超小标签</el-tag>
            `,
      theme: `<div class="tag-group">
              <span class="tag-group__title">Dark</span>
              <el-tag
                v-for="item in items"
                :key="item.label"
                :type="item.type"
                effect="dark">
                {{ item.label }}
              </el-tag>
            </div>
            <div class="tag-group">
              <span class="tag-group__title">Plain</span>
              <el-tag
                v-for="item in items"
                :key="item.label"
                :type="item.type"
                effect="plain">
                {{ item.label }}
              </el-tag>
            </div>

            <script>
              export default {
                data() {
                  return {
                    items: [
                      { type: '', label: '标签一' },
                      { type: 'success', label: '标签二' },
                      { type: 'info', label: '标签三' },
                      { type: 'danger', label: '标签四' },
                      { type: 'warning', label: '标签五' }
                    ]
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
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleCloseTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/style/container.scss';
.block {
  padding: 30px 0;
  text-align: center;
  border-right: 1px solid #eff2f6;
  display: inline-block;
  width: 49%;
  box-sizing: border-box;

  &:last-child {
    border-right: none;
  }
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  cursor: pointer;
  vertical-align: middle;
  color: #3963bc;
  margin-left: 10px;
  font-size: 24px;
  height: 24px;
  line-height: 24px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.input-new-tag /deep/ .el-input__inner {
  height: 24px;
}
</style>
