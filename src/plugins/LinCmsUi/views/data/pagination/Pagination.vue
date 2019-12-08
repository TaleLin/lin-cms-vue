<template>
  <div class="lin-container">
    <div class="lin-title">Pagination 分页</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div>
            <div class="block">
              <span class="demonstration">页数较少时的效果</span>
              <el-pagination layout="prev, pager, next" :total="50"> </el-pagination>
            </div>
            <div class="block" :style="{ marginTop: 30 + 'px' }">
              <span class="demonstration">大于 7 页时的效果</span>
              <el-pagination layout="prev, pager, next" :total="1000"> </el-pagination>
            </div>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>设置最大页码按钮数</span></div>
        <el-row>
          <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"> </el-pagination>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ pageCount }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>带有背景色的分页</span></div>
        <el-row>
          <div><el-pagination background layout="prev, pager, next" :total="1000"> </el-pagination></div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ background }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>小型分页</span></div>
        <el-row> <el-pagination small layout="prev, pager, next" :total="50"> </el-pagination> </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ small }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>附加功能</span></div>
        <el-row>
          <div class="block">
            <span class="demonstration">显示总数</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage1"
              :page-size="100"
              layout="total, prev, pager, next"
              :total="1000"
            >
            </el-pagination>
          </div>
          <div class="block" :style="{ marginTop: 30 + 'px' }">
            <span class="demonstration">调整每页显示条数</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage2"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="sizes, prev, pager, next"
              :total="1000"
            >
            </el-pagination>
          </div>
          <div class="block" :style="{ marginTop: 30 + 'px' }">
            <span class="demonstration">直接前往</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage3"
              :page-size="100"
              layout="prev, pager, next, jumper"
              :total="1000"
            >
            </el-pagination>
          </div>
          <div class="block" :style="{ marginTop: 30 + 'px' }">
            <span class="demonstration">完整功能</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            >
            </el-pagination>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ methodsCode }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>当只有一页时隐藏分页</span></div>
        <el-row>
          <div>
            <el-switch v-model="value"> </el-switch>
            <el-pagination :hide-on-single-page="value" :total="5" layout="prev, pager, next"> </el-pagination>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ hideOnSinglePage }}</div>
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
      value: false,
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      base: `     
        <div class="block">
        <span class="demonstration">页数较少时的效果</span>
        <el-pagination
            layout="prev, pager, next"
            :total="50">
        </el-pagination>
        </div>
        <div class="block">
        <span class="demonstration">大于 7 页时的效果</span>
        <el-pagination
            layout="prev, pager, next"
            :total="1000">
        </el-pagination>
        </div>`,
      pageCount: `
       <el-pagination
        :page-size="20"
        :pager-count="11"
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>`,
      background: `
           <el-pagination
            background
            layout="prev, pager, next"
            :total="1000">
          </el-pagination>`,
      small: `
           <el-pagination
            small
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
            `,
      /* eslint-disable */
      methodsCode: `
        <template>
          <div class="block">
            <span class="demonstration">显示总数</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage1"
              :page-size="100"
              layout="total, prev, pager, next"
              :total="1000">
            </el-pagination>
          </div>
          <div class="block">
            <span class="demonstration">调整每页显示条数</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage2"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="sizes, prev, pager, next"
              :total="1000">
            </el-pagination>
          </div>
          <div class="block">
            <span class="demonstration">直接前往</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage3"
              :page-size="100"
              layout="prev, pager, next, jumper"
              :total="1000">
            </el-pagination>
          </div>
          <div class="block">
            <span class="demonstration">完整功能</span>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </template>
        <script>
          export default {
            methods: {
              handleSizeChange(val) {
                console.log(\`每页 \${val} 条\`)
              },
              handleCurrentChange(val) {
                console.log(\`当前页: \${val}\`)
              }
            },
            data() {
              return {
                currentPage1: 5,
                currentPage2: 5,
                currentPage3: 5,
                currentPage4: 4
              };
            }
          }
        <\/script>`,
      hideOnSinglePage: `
        <div>
          <el-switch v-model="value">
          </el-switch>
          <el-pagination
            :hide-on-single-page="value"
            :total="5"
            layout="prev, pager, next">
          </el-pagination>
        </div>
        <script>
          export default {
            data() {
              return {
                value: false
              }
            }
          }
        <\/script>
      `,
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/style/container.scss';
.el-pagination {
  margin-top: 10px;
}
</style>
