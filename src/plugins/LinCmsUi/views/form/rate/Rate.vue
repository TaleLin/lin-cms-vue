<template>
  <div class="lin-container">
    <div class="lin-title">Rate 评分</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div class="block">
            <span class="demonstration">默认不区分颜色</span>
            <el-rate v-model="value1" :colors="colors1" :max="6"></el-rate>
          </div>
          <div class="block">
            <span class="demonstration">区分颜色</span>
            <el-rate v-model="value2" :colors="colors2"></el-rate>
          </div>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>辅助文字</span></div>
        <el-row> <el-rate v-model="value3" show-text :texts="texts" :colors="colors3"> </el-rate> </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ withText }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>只读</span></div>
        <el-row>
          <el-rate v-model="value4" disabled show-score text-color="#ff9900" score-template="{value}分"> </el-rate>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ disabled }}</div>
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
      value1: null,
      value2: null,
      value3: null,
      value4: 3.7,
      colors1: { 6: '#FFBE4D' },
      colors2: { 2: '#8C98AE', 4: { value: '#FFDD55', excluded: true }, 5: '#FFBE4D' },
      colors3: { 5: '#FFDD55' },
      texts: ['极差', '失望', '一般', '满意', '惊喜'],
      iconClasses: { 2: 'icon-rate-face-1', 4: { value: 'icon-rate-face-2', excluded: true }, 5: 'icon-rate-face-3' },
      base: `     
          <el-rate v-model="value1" :colors="colors1" :max="6"></el-rate>
          <el-rate v-model="value2" :colors="colors2"></el-rate>`,
      withText: `     
          <el-rate v-model="value3" show-text :texts="texts" :colors="colors3">
          </el-rate>`,
      disabled: `     
          <el-rate
            v-model="value4"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}分">
          </el-rate>`,
    }
  },
  components: {},
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
</style>
