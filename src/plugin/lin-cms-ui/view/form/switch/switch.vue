<template>
  <div class="lin-container">
    <div class="lin-title">Switch 开关</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <el-switch v-model="value2" active-color="#3963bc" style="margin-right:20px"> </el-switch>
          <el-switch v-model="value1" active-color="#00C292" inactive-color="#E46A76"> </el-switch>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>文字描述</span></div>
        <el-row>
          <el-switch
            v-model="value3"
            active-color="#00C292"
            inactive-color="#E46A76"
            active-text="按月付费"
            inactive-text="按年付费"
          >
          </el-switch>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ withText }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>扩展的 value 类型</span></div>
        <el-row>
          <el-tooltip :content="'Switch value: ' + value4" placement="top">
            <el-switch
              v-model="value5"
              active-color="#00C292"
              inactive-color="#E46A76"
              active-value="100"
              inactive-value="0"
            >
            </el-switch>
          </el-tooltip>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ extendValue }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>禁用</span></div>
        <el-row>
          <el-switch v-model="value6" active-color="#3963bc" disabled style="margin-right:20px"> </el-switch>
          <el-switch v-model="value7" active-color="#3963bc" disabled> </el-switch>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ forbidden }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: true,
      value2: true,
      value3: true,
      value4: 100,
      value5: true,
      value6: true,
      value7: false,
      base: `     
          <el-switch v-model="value2" active-color="#3963bc">
          </el-switch>
          <el-switch v-model="value1" active-color="#00C292" inactive-color="#E46A76">
          </el-switch>`,
      withText: `
          <el-switch
            v-model="value3"
            active-color="#00C292"
            inactive-color="#E46A76"
            active-text="按月付费"
            inactive-text="按年付费">
          </el-switch>`,
      extendValue: `
          <el-tooltip :content="'Switch value: ' + value4" placement="top">
            <el-switch
              v-model="value5"
              active-color="#00C292"
              inactive-color="#E46A76"
              active-value="100"
              inactive-value="0">
            </el-switch>
          </el-tooltip>`,
      forbidden: `
          <el-switch v-model="value6" active-color="#3963bc" disabled>
          </el-switch>`,
    }
  },
  components: {},
}
</script>

<style lang="scss" scoped>
@import '../../../assets/style/container.scss';
</style>
