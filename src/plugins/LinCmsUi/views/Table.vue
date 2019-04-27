<template>
  <div class="lin-container">
    <sticky-top>
      <div class="lin-title">Table</div>
      <lin-1px/>
    </sticky-top>
    <div class="lin-wrap-ui">
      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header">
          <span>基础表格</span>
        </div>
        <el-row>
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{basic}}</div>
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
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      basic: `
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>`
    };
  }
};
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
      color:#2f4e8c;
      padding-left: calc(100% - 77px);
    }

    .el-collapse-item__content {
      background: #e9f0f8;
      color:#2f4e8c;
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