<template>
  <div class="lin-container">
    <div class="lin-title">Table</div>
    <div class="lin-wrap-ui">
      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>基础表格</span></div>
        <el-row>
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column align="center" fixed prop="date" label="日期" width="150"></el-table-column>
            <el-table-column align="center" prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column align="center" prop="province" label="省份" width="120"></el-table-column>
            <el-table-column align="center" prop="city" label="市区" width="120"></el-table-column>
            <el-table-column align="center" prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column align="center" prop="address" label="地址"></el-table-column>
          </el-table>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ basic }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>带边框表格</span></div>
        <el-row>
          <el-table :data="tableData" style="width: 100%" border stripe>
            <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ basic }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;" height="200">
        <div slot="header"><span>固定表头</span></div>
        <el-row>
          <el-table :data="tableData" height="200" stripe>
            <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ header }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;" height="200">
        <div slot="header"><span>固定列</span></div>
        <el-row>
          <el-table :data="tableData" style="width:800px;margin-left:auto;margin-right:auto;">
            <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="address" label="地址" width="300"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120" fixed="right"></el-table-column>
          </el-table>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ column }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>带操作区表格</span></div>
        <el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="address" label="地址" width="300"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="primary" plain size="mini">编辑</el-button>
                <el-button type="danger" size="mini" plain>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ operate }}</div>
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333,
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333,
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333,
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333,
        },
      ],
      basic: `
          <el-table :data="tableData" stripe>
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>`,
      border: `
          <el-table :data="tableData" stripe border>
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>`,
      header: `
          <el-table :data="tableData" height="200" stripe>
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>`,
      column: `
          <el-table :data="tableData" border style="width:800px;margin-left:auto;margin-right:auto;">
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="address" label="地址" width="300"></el-table-column>
            <el-table-column
              prop="zip"
              label="邮编"
              width="120"
              fixed="right"></el-table-column>
          </el-table>`,
      operate: `
         <el-table :data="tableData" style="width: 100%">
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="province" label="省份" width="120"></el-table-column>
            <el-table-column prop="city" label="市区" width="120"></el-table-column>
            <el-table-column prop="address" label="地址" width="300"></el-table-column>
            <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="primary"
                  plain
                  size="mini">编辑</el-button>
                <el-button type="danger" size="mini" plain>删除</el-button>
              </template>

            </el-table-column>
          </el-table>
      `,
    }
  },
  methods: {
    handleClick() {},
  },
}
</script>

<style lang="scss">
.lin-wrap-ui {
  padding: 30px 40px;

  .el-card__body {
    padding-top: 30px;
    padding-bottom: 0px;
  }

  .el-collapse {
    border-top: none;
    border-bottom: none;

    .el-collapse-item__header {
      border-bottom: none;
      color: #2f4e8c;
      padding-left: calc(100% - 77px);
    }

    .el-collapse-item__content {
      background: #e9f0f8;
      color: #2f4e8c;
      border-radius: 4px;
      padding: 0px 20px 20px 20px;
      margin-bottom: 20px;
    }
  }
}

.el-table__body tr.current-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row > td {
  background-color: #ecf5ff;
}
</style>
